const express = require("express");
const router = express.Router();
const db = require("../config/database");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");
const fs = require("fs").promises;

// Product management
// get all products with detailed info
router.get("/products", adminAuth, async (req, res) => {
  try {
    const [products] = await db.query(`
              SELECT p.*, c.name as category_name,
                GROUP_CONCAT(pi.filename) as images
              FROM products p
              LEFT JOIN categories c ON p.category_id = c.id  
              LEFT JOIN product_images pi on p.id = pi.product_id
              GROUP BY p.id
            `);
    res.json(products);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

// Create all products
router.post(
  "/products",
  adminAuth,
  upload.array("images", 5),
  async (req, res) => {
    const { name, description, price, category_id, stock } = req.body;

    try {
      // Input validation
      if (!name || !price || !category_id) {
        // Delete uploaded files if validation fails
        if (req.files) {
          await Promise.all(
            req.files.map((file) => fs.unlink(file.path).catch(console.error))
          );
        }
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      // Start transaction
      await db.query("START TRANSACTION");

      // Insert product
      const [result] = await db.query(
        "INSERT INTO products (name, description, price, category_id, stock) VALUES (?, ?, ?, ?, ?)",
        [name, description, price, category_id, stock]
      );

      // Handle image uploads
      if (req.files && req.files.length > 0) {
        const imageValues = req.files.map((file) => [
          result.insertId,
          file.filename,
          file.path,
        ]);

        await db.query(
          "INSERT INTO product_images (product_id, filename, filepath) VALUES ?",
          [imageValues]
        );
      }

      // Commit transaction
      await db.query("COMMIT");

      // get the created product with images
      const [newProduct] = await db.query(
        `SELECT p.*, c.name as category_name,
                GROUP_CONCAT(pi.filename) as images
              FROM products p
              LEFT JOIN categories c ON p.category_id = c.id  
              LEFT JOIN product_images pi on p.id = pi.product_id
              WHERE p.id = ?
              GROUP BY p.id
              `,
        [result.insertId]
      );

      res.status(201).json(newProduct[0]);
    } catch (error) {
      // Rollback transaction on error
      await db.query("ROLLBACK");

      // Delete uploaded files if any
      if (req.files) {
        await Promise.all(
          req.files.map((file) => fs.unlink(file.path).catch(console.error))
        );
      }

      console.error("Error:", error);
      res.status(500).json({ message: "Error creating products" });
    }
  }
);

// Update product
router.put(
  "/products/:id",
  adminAuth,
  upload.array("images", 5),
  async (req, res) => {
    const { name, description, price, category_id, stock } = req.body;
    const productId = req.params.id;

    try {
      await db.query("START TRANSACTION");

      // Update product details
      await db.query(
        "UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, stock = ? WHERE id = ?",
        [name, description, price, category_id, stock, productId]
      );

      // Handle new images
      if (req.files && req.files.length > 0) {
        // Add new images
        const imageValues = req.files.map((file) => [
          productId,
          file.filename,
          file.path,
        ]);
        await db.query(
          "INSERT INTO product_images (product_id, filename, filepath) VALUES ?",
          [imageValues]
        );
      }

      await db.query("COMMIT");

      res.json({ message: "Product updated successfully" });
    } catch (error) {
      await db.query("ROLLBACK");
      // Clean up newly uploaded files on error if any exist
      if (req.files) {
        await Promise.all(
          req.files.map((file) => fs.unlink(file.path).catch(console.error))
        );
      }
      console.error("Error: ", error);
      res.status(500).json({ message: "Error updating product" });
    }
  }
);

// --- START: ADDED CODE BLOCK ---
// This new route handles the deletion of a single image for a product.
router.delete("/products/:id/images/:filename", adminAuth, async (req, res) => {
  const { filename } = req.params;

  if (!filename) {
    return res.status(400).json({ message: "Image filename is required." });
  }

  try {
    // Find the image in the database to get its filepath for deletion
    const [images] = await db.query(
      "SELECT filepath FROM product_images WHERE filename = ?",
      [filename]
    );

    if (images.length === 0) {
      return res.status(404).json({ message: "Image not found in database." });
    }

    const image = images[0];

    // 1. Delete the physical file from the server's storage
    await fs.unlink(image.filepath).catch((err) => {
      // Log error if file doesn't exist but don't stop the process,
      // as we still want to remove the DB record.
      console.error(
        "Failed to delete file from disk, but continuing to delete DB record:",
        err
      );
    });

    // 2. Delete the image record from the database
    await db.query("DELETE FROM product_images WHERE filename = ?", [filename]);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Error deleting image" });
  }
});
// --- END: ADDED CODE BLOCK ---

// Delete product
router.delete("/products/:id", adminAuth, async (req, res) => {
  try {
    await db.query("START TRANSACTION");

    // delete product images from storage
    const [images] = await db.query(
      "SELECT filepath FROM product_images WHERE product_id = ?",
      [req.params.id]
    );

    for (const image of images) {
      await fs.unlink(image.filepath).catch(console.error);
    }

    // Delete product and related images from db
    await db.query("DELETE FROM product_images WHERE product_id = ?", [
      req.params.id,
    ]);
    await db.query("DELETE FROM products WHERE id = ?", [req.params.id]);

    await db.query("COMMIT");
    res.json({ message: "Product deleted succesfully" });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error: ", error);
    res.status(500).json({ message: "Error deleting product" });
  }
});

module.exports = router;
