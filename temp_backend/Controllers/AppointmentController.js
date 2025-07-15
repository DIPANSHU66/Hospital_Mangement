const Appointment = require("../models/appontementSchema");
const User = require("../models/UserSchema");

const postAppointment = async (req, res) => {
  try {
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
      return res
        .status(400)
        .json({ message: "Please fill in all details", success: false });
    }

    const doctor = await User.findOne({
      firstname: doctor_firstname,
      lastname: doctor_lastname,
      role: "Doctor",
      doctorDepartment: department,
    });

    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found", success: false });
    }

    const doctor_id = doctor._id;
    const patientId = req.user?._id;

    if (!patientId) {
      return res
        .status(401)
        .json({ message: "Unauthorized request", success: false });
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
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

const getDoctorAppointments = async (req, res) => {
  try {
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing user information",
      });
    }

    let appointments = [];

    if (role === "Doctor") {
      appointments = await Appointment.find({ doctor_id: userId });
    } else if (role === "Patient") {
      appointments = await Appointment.find({ patientId: userId });
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Invalid user role",
      });
    }

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found", success: false });
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
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res
        .status(404)
        .json({ message: "Appointment not found", success: false });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  postAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
  deleteAppointment,
};
