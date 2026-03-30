const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(cors());

// Security headers
app.use(helmet());

// Prevent MongoDB injection attacks
//app.use(mongoSanitize());

app.use(
  mongoSanitize({
    replaceWith: "_",
    allowDots: true,
    sanitizeQuery: false, // IMPORTANT for Express 5
  })
);

// Enforce HTTPS in production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
  }
  next();
});

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} - ${duration} ms`);
  });

  next();
});

// routes
const signupRoute = require("./routes/authentication_api/userSignup");
const loginRoute = require("./routes/authentication_api/userLogin");
const rememberLoginRoute = require("./routes/authentication_api/userRememberLogin");
const authMiddleware = require("./middleware/authMiddleware");
const userLogout = require("./routes/authentication_api/userLogout");
const createTaskRoute = require("./routes/taskCreationAndRetrival_api/createTask");
const getUserTasksRoute = require("./routes/taskCreationAndRetrival_api/getUserTasks");
const updateTaskStatusRoute = require("./routes/taskStatusManagement_api/updateTaskStatus");
const autoMoveOverdueTasks = require("./routes/taskStatusManagement_api/autoMoveOverdueTasks");
const deleteTaskRoute = require("./routes/taskStatusManagement_api/deleteTask");


app.use("/api/auth", signupRoute);
app.use("/api/auth", loginRoute);
app.use("/api/auth", rememberLoginRoute);
app.use("/api/auth", userLogout);
app.use("/api/task", createTaskRoute);
app.use("/api/task", getUserTasksRoute);
app.use("/api/task", updateTaskStatusRoute);
app.use("/api/tasks", autoMoveOverdueTasks);
app.use("/api/task", deleteTaskRoute);


// test route
app.get("/", (req, res) => {
  res.send("TODO List API is running");
});


// test session is vallid or expired
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    userId: req.user.userId,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});