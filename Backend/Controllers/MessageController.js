const Message = require("../models/MessageSchema");

const sendMessage = async (req, res) => {
  try {
    const receiver = req.params.id;
    const { firstname, lastname, email, phone, message, sender } = req.body;

    if (!firstname || !lastname || !email || !phone || !message || !sender) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
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

    res
      .status(201)
      .json({ success: true, message: "Message sent.", data: newMessage });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const receiverid = req.params.id;
    const messages = await Message.find({receiver: receiverid});
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

module.exports = { sendMessage, getAllMessages };
