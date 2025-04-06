const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");
require("dotenv").config();

const isAdminAuthenticated = async (req, res, next) => {
  const token = req.cookies.Admintoken;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Admin Not Authenticated", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Unauthorized access", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

const isPatientAuthenticated = async (req, res,next) => {
  const token = req.cookies.Patienttoken;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Patient Not Authenticated", success: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "Patient") {
      return res
        .status(403)
        .json({ message: "Unauthorized access", success: false });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

module.exports = { isAdminAuthenticated, isPatientAuthenticated };
