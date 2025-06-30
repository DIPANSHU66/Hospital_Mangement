const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
  deleteMessage
} = require("../Controllers/MessageController");
const { isAuthenticated } = require("../middleware/auth");
router.post("/send/:id?", isAuthenticated(), sendMessage);

router.get("/getall", isAuthenticated(), getAllMessages);
router.delete("/deletemessage", isAuthenticated(), deleteMessage);
module.exports = router;
