const express = require("express");
const router = express.Router();
const db = require("../config/database");

// get all categories
router.get("/", async (req, res) => {
  try {
    const [categories] = await db.query(`
                SELECT c.*, COUNT(p.id) as product_count
                FROM categories c
                LEFT JOIN products p ON c.id = p.category_id
                GROUP BY c.id
            `);

    res.json(categories);
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
});

module.exports = router;
