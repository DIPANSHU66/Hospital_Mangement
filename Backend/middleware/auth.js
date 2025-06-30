const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

const isAuthenticated = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Authentication token missing. Please login.",
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found. Please login again.",
        });
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied for role: ${user.role}`,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("isAuthenticated Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Authentication failed",
        error: error.message,
      });
    }
  };
};

module.exports = { isAuthenticated };
