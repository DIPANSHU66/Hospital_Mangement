const express = require("express");
const router = express.Router();
const {
  register,
  login,
  addNewAdmin,
  getAllDoctors,
  getUserDetails,
  logoutAdmin,
  logoutPatient,
  addNewDoctor,
} = require("../Controllers/UserController");
const {
  isAdminAuthenticated,
  isPatientAuthenticated,
} = require("../middleware/auth");

const { singleUpload } = require("../middleware/multer");
router.post("/register", register);
router.post("/login", login);
router.post("/admin/addnew", addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, logoutAdmin);
router.get("/patient/logout", isPatientAuthenticated, logoutPatient);
router.post("/doctor/addnew", singleUpload, isAdminAuthenticated, addNewDoctor);

module.exports = router;
