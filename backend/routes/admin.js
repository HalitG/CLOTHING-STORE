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
  } catch (error) {}
});
