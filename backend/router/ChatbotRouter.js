const express = require("express");
const { askChatbot } = require("../Controllers/ChatbotController");

const router = express.Router();

router.post("/ask", askChatbot);

module.exports = router;
