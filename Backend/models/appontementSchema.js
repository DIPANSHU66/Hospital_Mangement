const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  nic: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true, enum: ["male", "female"] },
  appointment_date: { type: Date, required: true },
  department: { type: String, required: true },
  doctor: {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
  },
  doctor_id: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  patientId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  address: { type: String, required: true },
  hasVisited: { type: Boolean, default: false },
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
});

module.exports = mongoose.model("Appointment", appointmentSchema);
