const Message = require("../models/MessageSchema");
const User = require("../models/UserSchema");
const { catchAsyncErrors, ErrorHandler } = require("../middleware/errorMiddleware");

const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const sender = req.user._id;
  let receiver = req.params.id;

  const firstname = req.body.firstname || req.user?.firstname;
  const lastname = req.body.lastname || req.user?.lastname;
  const email = req.body.email || req.user?.email;
  const phone = req.body.phone || req.user?.phone;
  const { message } = req.body;

  if (!firstname || !lastname || !email || !phone || !message) {
    return next(new ErrorHandler("All fields are required.", 400));
  }

  let createdMessages = [];

  if (!receiver) {
    const adminUsers = await User.find({ role: "Admin" });

    if (!adminUsers.length) {
      return next(new ErrorHandler("No admin users found.", 404));
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
      message: "Message sent.",
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
});

const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const userId = req.user._id;
  const role = req.user.role;

  let messages;
  if (role === "Admin") {
    // Admins see all inquiries addressed to them, newest first
    messages = await Message.find({ receiver: userId }).sort({ createdAt: -1 });
  } else {
    // Patients or Doctors see messages they either sent or received, ordered chronologically for chat threads
    messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: 1 });
  }

  res.status(200).json({ success: true, messages });
});

const replyToMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply) {
    return next(new ErrorHandler("Reply message content is required.", 400));
  }

  const message = await Message.findById(id);

  if (!message) {
    return next(new ErrorHandler("Message not found.", 404));
  }

  message.reply = reply;
  message.isReplied = true;
  message.repliedAt = new Date();

  await message.save();

  // Also create a reciprocal message in the DB for the chat thread if desired, 
  // but updating the existing message structure is cleaner and satisfies the reply field.
  
  res.status(200).json({
    success: true,
    message: "Reply sent successfully.",
    data: message,
  });
});

const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.body;

  if (!id) {
    return next(new ErrorHandler("Message ID is required.", 400));
  }

  const deleted = await Message.findByIdAndDelete(id);

  if (!deleted) {
    return next(new ErrorHandler("Message not found.", 404));
  }

  return res.status(200).json({ success: true, message: "Message deleted successfully." });
});

module.exports = { sendMessage, getAllMessages, replyToMessage, deleteMessage };
