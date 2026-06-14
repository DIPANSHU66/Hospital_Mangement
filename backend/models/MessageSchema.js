const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reply: { type: String },
    isReplied: { type: Boolean, default: false },
    repliedAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
