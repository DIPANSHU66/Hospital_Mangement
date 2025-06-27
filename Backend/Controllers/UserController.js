const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const getdataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary");

const register = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      phone,
      nic,
      dob,
      gender,
      password,
      role,
    } = req.body;

    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !nic ||
      !dob ||
      !gender ||
      !password ||
      !role
    ) {
      res
        .status(400)
        .json({ success: false, message: "Please fill out the full form" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({
        success: false,
        message: "User with this Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstname,
      lastname,
      email,
      phone,
      nic,
      dob,
      gender,
      password: hashedPassword,
      role,
    });

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, confirmpassword, role } = req.body;

    if (!email || !password || !confirmpassword || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (password !== confirmpassword) {
      return res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (role !== user.role) {
      return res
        .status(400)
        .json({ success: false, message: "User with this role is not found" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    return;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const addNewAdmin = async (req, res) => {
  req.body.role = "Admin";
  return register(req, res);
};

const addNewDoctor = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Doctor avatar is required" });
    }

    const fileuri = getdataUri(file);
    const uploadResult = await cloudinary.uploader.upload(fileuri.content, {
      folder: "avatars",
      resource_type: "auto",
    });

    req.body.role = "Doctor";
    req.body.docAvatar = {
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
    };

    return register(req, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "Doctor" });
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

const getUserDetails = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

const logout = (role) => (req, res) => {
  res
    .status(200)
    .cookie(`${role}token`, "", { httpOnly: true, expires: new Date(0) })
    .json({ success: true, message: "Logout successful" });
};

const getuserbyid = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  res.status(200).json({ success: true, user: user });
};

module.exports = {
  register,
  login,
  addNewAdmin,
  getAllDoctors,
  getUserDetails,
  logoutAdmin: logout("Admin"),
  logoutPatient: logout("Patient"),
  addNewDoctor,
  getuserbyid,
};
