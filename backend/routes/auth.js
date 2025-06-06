const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt.js");
const jwt = require("jsonwebtoken");
const db = require(`../config/database`);

router.post("register", async (req, res) => {
  const { email, password, first_name, last_name } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Check if user already exists
    const [existingUser] = await db.query(
      "SELECT id from users where email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const [result] = await db.query(
      "INSERT INTO users (email, password, first_name, last_name) values (?, ?, ?, ?)",
      [email, hashedPassword, first_name, last_name]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        first_name,
        last_name,
      },
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

module.exports = router;
