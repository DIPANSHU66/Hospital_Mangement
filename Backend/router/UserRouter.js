const express = require("express");
const router = express.Router();

const {
  register,
  login,
  addNewAdmin,
  getAllDoctors,
  getUserDetails,
  logout,
  addNewDoctor,
  getuserbyid,
} = require("../Controllers/UserController");

const { isAuthenticated } = require("../middleware/auth");
const { singleUpload } = require("../middleware/multer");

// Public Routes
router.post("/register", register);
router.post("/login", login);
router.get("/doctors", getAllDoctors);
router.get("/getdetail/:id", getuserbyid);


router.post("/admin/addnew",addNewAdmin);
router.post("/doctor/addnew", singleUpload, isAuthenticated("Admin"), addNewDoctor);

router.get("/me", isAuthenticated(), getUserDetails);


router.get("/logout", isAuthenticated(), logout);
module.exports = router;

