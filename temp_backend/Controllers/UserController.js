const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const getdataUri = require("../utils/datauri");
const cloudinary = require("../utils/cloudinary");
require("dotenv").config();


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
      return res.status(400).json({
        success: false,
        message: "Please fill out the full form",
      });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
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
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, password, and role",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    // Check if email exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered. Please register first.",
      });
    }

  
    if (user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `No ${role} account found with this email`,
      });
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
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
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        success: true,
        message: "Login successful",
        user: finduser,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
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
    const doctors = await User.find({ role: "Doctor" }).select("-password");
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


const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({ success: true, message: "Logout successful" });
};


const getuserbyid = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

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
