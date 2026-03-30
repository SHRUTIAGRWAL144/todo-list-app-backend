const express = require("express");
const router = express.Router();

const Task = require("../../models/Task");
const authMiddleware = require("../../middleware/authMiddleware");

// UPDATE TASK STATUS TO DONE
router.patch("/mark-done/:taskId", authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    // 1. Find task that belongs to logged-in user
    const task = await Task.findOne({ _id: taskId, userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or access denied",
      });
    }


    // 2. Prevent invalid transition FROM COMPLETED
    if (task.status === "DONE") {
      return res.status(400).json({
        success: false,
        message: "Task is already completed. Status cannot be changed.",
      });
    }

    // 3. Allow only BACKLOG or PENDING → COMPLETED
    if (!["BACKLOG", "PENDING"].includes(task.status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${task.status} to COMPLETED`,
      });
    }


    // 4. Update status
    task.status = "DONE";
    await task.save();
    

   /*4. Update status using single DB call
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId },
      { status: "DONE" },
      { new: true }
    );*/



    // 5. Return updated task
    res.status(200).json({
      success: true,
      message: "Task marked as DONE",
      data: {
        taskId: task._id,
        taskName: task.taskName,
        status: task.status,
        updatedAt: task.updatedAt,
      },
    });
  } catch (error) {
    //  Handle concurrent update conflict
    if (error.name === "VersionError") {
      return res.status(409).json({
        success: false,
        message: "Task was updated by another request. Please try again.",
      });
    }


    res.status(500).json({
      success: false,
      message: "Error updating task status",
      error: error.message,
    });
  }
});

module.exports = router;