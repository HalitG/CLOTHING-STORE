const jwt = require("jsonwebtoken");
const db = require("../config/database");

const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Check if user exists and is admin
    const [user] = await db.query(
      'SELECT * FROM users WHERE id = ? AND role = "admin"',
      [decoded.id]
    );

    if (user.length === 0) {
      throw new Error();
    }

    req.user = user[0];
    next();

    const decoded = jwt.verify(token, procces.env.JWT_SECRET);
  } catch (error) {
    res.status(401).json({ message: "Not authorized as admin" });
  }
};
