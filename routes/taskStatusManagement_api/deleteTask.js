const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Task = require("../../models/Task");
const authMiddleware = require("../../middleware/authMiddleware");

// DELETE TASK API
// DELETE /api/task/delete/:taskId
router.delete("/delete/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId; // coming from authMiddleware

    // 1. Validate taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }
    

    // 2. Find task & validate ownership
    const task = await Task.findOne({
      _id: taskId,
      userId: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you are not authorized to delete it",
      });
    }

    // 3. Permanently delete task
    await Task.deleteOne({ _id: taskId });

    // 4. Confirmation response
    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      deletedTaskId: taskId,
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting task",
    });
  }
});

module.exports = router;