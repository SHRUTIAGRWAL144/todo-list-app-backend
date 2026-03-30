const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    taskName: {
      type: String,
      required: true,
      trim: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["BACKLOG", "PENDING", "DONE"],
      default: "PENDING",
    },
  },
  { 
    timestamps: true ,
    optimisticConcurrency: true, //  Enables safe concurrent updates
    versionKey: "__v",           //  Explicitly use version key (default but good practice)
  }
);

/* ==============================
   PERFORMANCE INDEXES
   ============================== */

// Speed up fetching tasks by user
taskSchema.index({ userId: 1 });

// Speed up filtering by status
taskSchema.index({ status: 1 });

// Speed up sorting by dueDate
taskSchema.index({ dueDate: 1 });

// Compound index for user + status queries
taskSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model("Task", taskSchema);