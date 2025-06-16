const jwt = require("jsonwebtoken");
const db = require("../config/database");

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // First, check if the header even exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Correctly extract the token from the header
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // This database check is an excellent security measure
    const [user] = await db.query(
      'SELECT id, email, role, first_name, last_name FROM users WHERE id = ? AND role = "admin"',
      [decoded.id]
    );

    if (user.length === 0) {
      // Throwing an error here correctly sends the response in the catch block
      throw new Error("User is not an admin.");
    }

    // Attach user info (without the password) to the request and proceed
    req.user = user[0];
    next();
  } catch (error) {
    // This catch block handles a failed JWT verification OR the "not an admin" case
    res.status(401).json({ message: "Not authorized as admin" });
  }
};

module.exports = adminAuth;
