const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    nic: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true, enum: ["male", "female"] },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["Admin", "Patient", "Doctor"],
      default: "Patient",
    },
    doctorDepartment: { type: String },
    docAvatar: {
     public_id: { type: String},
      url: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
