
const express = require("express");
const router = express.Router();


const {
  postAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} = require("../Controllers/AppointmentController");
const {
  isAuthenticated,
} = require("../middleware/auth");


router.post("/post", isAuthenticated(), postAppointment);

router.get("/appointmentget",isAuthenticated("Patient","Doctor"),getDoctorAppointments);



router.put("/update/:id", isAuthenticated(), updateAppointmentStatus);

router.delete("/delete/:id",isAuthenticated(),deleteAppointment);

module.exports = router;
