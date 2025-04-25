

const express = require("express");
const router = express.Router();

const {
  postAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../Controllers/AppointmentController");
const {
  isAdminAuthenticated,
  isPatientAuthenticated,
} = require("../middleware/auth");

router.post("/post", isPatientAuthenticated, postAppointment);
router.get("/getall/:id", getDoctorAppointments);
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete("/delete/:id", deleteAppointment);

module.exports = router;
