const express = require("express");
const router = express.Router();
const Task = require("../../models/Task");
const authMiddleware = require("../../middleware/authMiddleware");

/*
  API: Automatically move overdue tasks to BACKLOG
  Method: PUT
  Access: Protected
*/

router.put("/auto-move-overdue", authMiddleware, async (req, res) => {
  try {
    const today = new Date();

    const result = await Task.updateMany(
      {
        assignedTo: req.user.userId,
        dueDate: { $lt: today },

        //Explicit protection for completed tasks
        //status: { $nin: ["DONE", "BACKLOG"] },
        status: { $ne: "DONE" },
      },
      {
        $set: { status: "BACKLOG" },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Overdue tasks moved to BACKLOG successfully",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Auto Move Overdue Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while moving overdue tasks",
    });
  }
});

module.exports = router;