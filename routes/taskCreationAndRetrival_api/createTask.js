const express = require("express");
const router = express.Router();

const Task = require("../../models/Task");
const authMiddleware = require("../../middleware/authMiddleware");
const taskValidation = require("../../middleware/taskValidation");

// CREATE TASK API
//router.post("/create-task", authMiddleware, async (req, res) => {
    router.post(
    "/create-task",
    authMiddleware,
    taskValidation,
    async (req, res) => {
    try {
      const { taskName, dueDate } = req.body;

      // 1. Validate input
      if (!taskName || !dueDate) {
        return res.status(400).json({
          success: false,
          message: "Task name and due date are required",
        });
      }
      

      // 2. Create task
      const task = await Task.create({
        userId: req.user.userId, // coming from authMiddleware
        taskName,
        dueDate,
        status: "PENDING",
      });

      // 3. Send response
      res.status(201).json({
        success: true,
        message: "Task created successfully",
        data: task,
      });
    } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
});

module.exports = router;