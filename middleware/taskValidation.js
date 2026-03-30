const taskValidation = (req, res, next) => {
  const { taskName, dueDate } = req.body;

  // Reject empty or missing task name
  if (!taskName || typeof taskName !== "string" || taskName.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Task name is required and cannot be empty",
    });
  }

  // Reject missing due date
  if (!dueDate) {
    return res.status(400).json({
      success: false,
      message: "Due date is required",
    });
  }

  // Reject invalid date format
  const parsedDate = new Date(dueDate);
  if (isNaN(parsedDate.getTime())) {
    return res.status(400).json({
      success: false,
      message: "Invalid due date format",
    });
  }

  next(); // validation passed
};

module.exports = taskValidation;