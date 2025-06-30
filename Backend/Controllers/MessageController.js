const Message = require("../models/MessageSchema");
const User = require("../models/UserSchema");

const sendMessage = async (req, res) => {
  const sender = req.user._id;
  let receiver = req.params.id;

  try {
    const { firstname, lastname, email, phone, message } = req.body;

    if (!firstname || !lastname || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    let createdMessages = [];

    if (!receiver) {
      const adminUsers = await User.find({ role: "Admin" });

      if (!adminUsers.length) {
        return res.status(404).json({
          success: false,
          message: "No admin users found.",
        });
      }

      for (const admin of adminUsers) {
        const msg = await Message.create({
          firstname,
          lastname,
          email,
          phone,
          message,
          sender,
          receiver: admin._id,
        });
        createdMessages.push(msg);
      }

      return res.status(201).json({
        success: true,
        message: "Message sent .",
        data: createdMessages,
      });
    }

    const newMessage = await Message.create({
      firstname,
      lastname,
      email,
      phone,
      message,
      sender,
      receiver,
    });

    return res.status(201).json({
      success: true,
      message: "Message sent.",
      data: newMessage,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const receiverId = req.user._id;

    const messages = await Message.find({ receiver: receiverId });

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


const deleteMessage = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Message ID is required." });
    }

    const deleted = await Message.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    return res.status(200).json({ success: true, message: "Message deleted successfully." });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
module.exports = { sendMessage, getAllMessages, deleteMessage };
