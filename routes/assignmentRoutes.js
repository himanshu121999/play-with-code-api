const express = require("express");
const Assignment = require("../models/Assignment");
const { default: mongoose } = require("mongoose");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new assignment (POST /api/assignments)
router.post("/", async (req, res) => {
  try {
    const {} = req?.body;
    const newAssignmentObject = {
      ...req.body,
      submittedBy: [],
    };
    const newAssignment = new Assignment(newAssignmentObject);
    const savedAssignment = await newAssignment.save();
    res.status(201).json(savedAssignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all assignments (GET /api/assignments)
router.get("/", protect, async (req, res) => {
  const {
    student: { id: studentId },
  } = req.body;

  try {
    const assignments = await Assignment.aggregate([
      {
        $addFields: {
          userSubmission: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$submittedBy", // Array to filter
                  as: "submission", // Alias for the array elements
                  cond: {
                    $eq: [
                      "$$submission.studentId",
                      new mongoose.Types.ObjectId(studentId),
                    ],
                  }, // Match studentId
                },
              },
              0, // Get the first (and only) matching element
            ],
          },
        },
      },
      {
        $addFields: {
          isCompleted: {
            $ifNull: ["$userSubmission.isCompleted", false], // Use isCompleted if found; default to false
          },
        },
      },
      {
        $project: {
          submittedBy: 0, // Exclude the submittedBy field
          userSubmission: 0, // Exclude the intermediate userSubmission field
          description: 0,
          files: 0,
          allowOutput: 0,
          __v: 0,
        },
      },
    ]);

    res.status(200).json(assignments);
  } catch (error) {
    console.error("Error fetching assignments with aggregation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:assignmentId", protect, async (req, res) => {
  const { assignmentId } = req.params;
  const { student } = req.body;

  try {
    const assignments = await Assignment.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(assignmentId) }, // Match the specific assignment by ID
      },
      {
        $addFields: {
          userSubmission: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$submittedBy", // Array to filter
                  as: "submission", // Alias for the array elements
                  cond: {
                    $eq: [
                      "$$submission.studentId",
                      new mongoose.Types.ObjectId(student?.id),
                    ],
                  }, // Match studentId
                },
              },
              0, // Get the first (and only) matching element
            ],
          },
        },
      },
      {
        $addFields: {
          isCompleted: {
            $ifNull: ["$userSubmission.isCompleted", false], // Use isCompleted if found; default to false
          },
          submission: {
            $ifNull: [
              "$userSubmission",
              {
                files: "$files",
              },
            ], // Use isCompleted if found; default to false
          },
        },
      },
      {
        $project: {
          submittedBy: 0, // Exclude the submittedBy field
          userSubmission: 0, // Exclude the intermediate userSubmission field
          __v: 0,
        },
      },
    ]);

    if (!assignments.length) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assignments[0]);
  } catch (error) {
    console.error("Error fetching assignments with aggregation:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/submit/:assignmentId", protect, async (req, res) => {
  const { assignmentId } = req.params;
  const {
    student: { id: studentId },
    files,
  } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(assignmentId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid assignmentId or studentId" });
    }

    // Validate required fields
    if (!files) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if the student has already submitted
    const existingSubmissionIndex = assignment.submittedBy.findIndex(
      (submission) => submission.studentId.toString() === studentId
    );

    if (existingSubmissionIndex !== -1) {
      // Replace existing submission
      assignment.submittedBy[existingSubmissionIndex] = {
        studentId,
        date: new Date(),
        files,
        isCompleted: true,
        checkingStatus: "PENDING",
        comment: "",
      };
    } else {
      // Add new submission
      assignment.submittedBy.push({
        studentId,
        date: new Date(),
        files,
        isCompleted: true,
        checkingStatus: "PENDING",
        comment: "",
      });
    }

    // Save the updated assignment
    await assignment.save();

    res
      .status(200)
      .json({ message: "Submission successfully added or replaced" });
  } catch (error) {
    console.error("Error updating submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
