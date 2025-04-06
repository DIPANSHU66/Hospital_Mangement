const express = require("express");
const router = express.Router();
const {
  postAppointment,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../Controllers/AppointmentController");
const {
  isAdminAuthenticated,
  isPatientAuthenticated,
} = require("../middleware/auth");
router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", deleteAppointment);
module.exports = router;
