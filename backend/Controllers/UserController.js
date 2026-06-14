const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const getdataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary");
const { catchAsyncErrors, ErrorHandler } = require("../middleware/errorMiddleware");
require("dotenv").config();


const register = catchAsyncErrors(async (req, res, next) => {
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
    docAvatar,
    doctorDepartment,
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
    return next(new ErrorHandler("Please fill out the full form", 400));
  }

  if (await User.findOne({ email })) {
    return next(new ErrorHandler("User with this email already exists", 400));
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
    docAvatar,
    doctorDepartment,
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
  });
});


const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Email not registered. Please register first.", 404));
  }

  if (user.role !== role) {
    return next(new ErrorHandler(`No ${role} account found with this email`, 403));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid password", 400));
  }

  const finduser = await User.findById(user._id).select("-password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message: "Login successful",
      user: finduser,
    });
});


const addNewAdmin = catchAsyncErrors(async (req, res, next) => {
  req.body.role = "Admin";
  return register(req, res, next);
});


const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  const { file } = req;
  if (!file) {
    return next(new ErrorHandler("Doctor avatar is required", 400));
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

  return register(req, res, next);
});


const getAllDoctors = catchAsyncErrors(async (req, res, next) => {
  const doctors = await User.find({ role: "Doctor" }).select("-password");
  res.status(200).json({ success: true, doctors });
});


const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ success: true, user: req.user });
});


const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({ success: true, message: "Logout successful" });
});


const getuserbyid = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  res.status(200).json({ success: true, user });
});

module.exports = {
  register,
  login,
  addNewAdmin,
  addNewDoctor,
  getAllDoctors,
  getUserDetails,
  getuserbyid,
  logout,
};
