const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ["CODING", "TASK"] },
  title: { type: String, required: true },
  description: { type: String, required: true },
  files: {
    type: [
      {
        fileName: { type: String, required: true },
        language: { type: String, required: true, enum: ["html", "css", "javascript"] },
        value: { type: String, default: "" },
      },
    ],
    required: true,
  },
  allowOutput: { type: Boolean, required: true },
  submittedBy: {
    type: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Student",
        }, // Reference to Student model
        date: { type: Date, required: true }, // Ensure valid date format
        files: [
          {
            fileName: { type: String, required: true },
            language: { type: String, required: true, enum: ["html", "css"] },
            value: { type: String, required: true },
          },
        ],
        isCompleted: { type: Boolean, required: true },
        checkingStatus: {
          type: String,
          required: true,
          enum: ["PENDING", "APPROVED", "REJECTED"],
        }, // Limited to specific statuses
        comment: { type: String, default: "" }, // Optional comment field with default empty string
      },
    ],
    required: true,
  },
});

module.exports = mongoose.model("Assignment", assignmentSchema);
