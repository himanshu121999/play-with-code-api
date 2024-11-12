const express = require("express");
const CourseClass = require("../models/CourseClass");

const router = express.Router();

// Create a new Class (POST /api/classes)
router.post("/", async (req, res) => {
  try {
    const newCourseClass = new CourseClass(req.body);
    const savedCourseClass = await newCourseClass.save();
    res.status(201).json(savedCourseClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Classes (GET /api/classes)
router.get("/", async (req, res) => {
  try {
    // Get the current date at midnight (start of the day)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to 00:00:00

    // Get the ISO string of today's date to ensure it's accurate for comparison
    const isoToday = today.toISOString();

    // Find documents where the `date` matches exactly (ignoring time)
    const classes = await CourseClass.find().sort({date: -1});

    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
