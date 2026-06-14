const Appointment = require("../models/AppointmentSchema");
const User = require("../models/UserSchema");
const { catchAsyncErrors, ErrorHandler } = require("../middleware/errorMiddleware");

const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstname,
    doctor_lastname,
    hasVisited = false,
    address,
  } = req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstname ||
    !doctor_lastname ||
    !address
  ) {
    return next(new ErrorHandler("Please fill in all details", 400));
  }

  const doctor = await User.findOne({
    firstname: doctor_firstname,
    lastname: doctor_lastname,
    role: "Doctor",
    doctorDepartment: department,
  });

  if (!doctor) {
    return next(new ErrorHandler("Doctor not found", 404));
  }

  const doctor_id = doctor._id;
  const patientId = req.user?._id;

  if (!patientId) {
    return next(new ErrorHandler("Unauthorized request", 401));
  }

  const appointment = await Appointment.create({
    firstname,
    lastname,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstname: doctor_firstname,
      lastname: doctor_lastname,
    },
    hasVisited,
    address,
    doctor_id,
    patientId,
  });

  res.status(201).json({
    success: true,
    message: "Appointment booked successfully",
    appointment,
  });
});

const getDoctorAppointments = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user?._id;
  const role = req.user?.role;

  if (!userId || !role) {
    return next(new ErrorHandler("Unauthorized: Missing user information", 401));
  }

  let appointments = [];

  if (role === "Doctor") {
    appointments = await Appointment.find({ doctor_id: userId });
  } else if (role === "Patient") {
    appointments = await Appointment.find({ patientId: userId });
  } else {
    return next(new ErrorHandler("Forbidden: Invalid user role", 403));
  }

  return res.status(200).json({
    success: true,
    appointments,
  });
});

const updateAppointmentStatus = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    message: "Appointment status updated successfully",
    appointment: updatedAppointment,
  });
});

const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return next(new ErrorHandler("Appointment not found", 404));
  }

  await appointment.deleteOne();

  res.status(200).json({
    success: true,
    message: "Appointment deleted successfully",
  });
});

module.exports = {
  postAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};
