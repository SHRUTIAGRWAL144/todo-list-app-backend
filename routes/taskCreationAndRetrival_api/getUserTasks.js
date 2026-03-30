const express = require("express");
const router = express.Router();

const Task = require("../../models/Task");
const authMiddleware = require("../../middleware/authMiddleware");

// GET ALL TASKS OF LOGGED-IN USER
router.get("/my-tasks", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const tasks = await Task.find({ userId })
      .select("taskName dueDate status createdAt userId")
      .sort({ createdAt: -1 })
      .lean(); //   PERFORMANCE BOOST (returns plain JS objects)

    // Return empty array if no tasks
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks.map(task => ({
        taskId: task._id,
        taskName: task.taskName,
        assignedTo: task.userId,
        dueDate: task.dueDate,
        status: task.status,
        createdAt: task.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
});

module.exports = router;