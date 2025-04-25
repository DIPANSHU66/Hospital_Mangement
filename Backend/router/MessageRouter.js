const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
} = require("../Controllers/MessageController");
const { isAdminAuthenticated} = require("../middleware/auth");
router.post("/send/:id", sendMessage);
router.get("/getall/:id", isAdminAuthenticated, getAllMessages);
module.exports = router;
