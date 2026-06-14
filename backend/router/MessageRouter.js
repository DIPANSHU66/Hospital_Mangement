const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
  replyToMessage,
  deleteMessage
} = require("../Controllers/MessageController");
const { isAuthenticated } = require("../middleware/auth");

router.post("/send/:id?", isAuthenticated(), sendMessage);
router.get("/getall", isAuthenticated(), getAllMessages);
router.put("/reply/:id", isAuthenticated("Admin", "Doctor"), replyToMessage);
router.delete("/deletemessage", isAuthenticated(), deleteMessage);

module.exports = router;
