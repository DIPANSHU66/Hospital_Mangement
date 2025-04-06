const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllMessages,
} = require("../Controllers/MessageController");
const { isAdminAuthenticated} = require("../middleware/auth");
router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);
module.exports = router;
