const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt.js");
const jwt = require("jsonwebtoken");
const db = require(`../config/database`);

// Register new user
router.post("/register", async (req, res) => {
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

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // check if user exists
    const [users] = await db.query(
      "SELECT id, email, password, first_name, last_name, role from users WHERE email=?",
      [email]
    );

    if (user.length == 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_TOKEN,
      { expiresIn: "24h" }
    );

    // Remove password from response
    delete user.password;

    res.json({
      token,
      user,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
