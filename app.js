require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const roomsRoutes = require("./routes/rooms.routes");
const authRoutes = require("./routes/auth.routes");

const { notFound } = require("./middleware/notFound");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: {
      status: 429,
      code: "RATE_LIMITED",
      message: "Too many requests. Try again later.",
    },
  },
});

app.use("/auth", authLimiter, authRoutes); 
app.use("/rooms", roomsRoutes);

app.get("/", (req, res) => {
  res.send("Rooms API is running");
});

app.use(notFound);       
app.use(errorHandler);   

module.exports = app;
