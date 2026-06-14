const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const { dbconnection } = require("./database/dbConnection");
const { errorMiddleware } = require("./middleware/errorMiddleware");

const messagerouter = require("./router/MessageRouter");
const userRouter = require("./router/UserRouter");
const appointmentrouter = require("./router/AppointmentRouter");
const chatbotRouter = require("./router/ChatbotRouter");

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/message", messagerouter);
app.use("/api/v1/appointment", appointmentrouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/chatbot", chatbotRouter);

// Error Middleware
app.use(errorMiddleware);

// Database Connection
dbconnection();

// Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});