const express = require("express");
const TodayClass = require("../models/TodayClass");

const router = express.Router();

// Create a new Today Class (POST /api/todays-classes)
router.post("/", async (req, res) => {
  try {
    const newTodayClass = new TodayClass(req.body);
    const savedTodayClass = await newTodayClass.save();
    res.status(201).json(savedTodayClass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Today's Classes (GET /api/todays-classes)
router.get("/", async (req, res) => {
  try {
    // Get the current date at midnight (start of the day)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to 00:00:00

    // Get the ISO string of today's date to ensure it's accurate for comparison
    const isoToday = today.toISOString();

    // Find documents where the `date` matches exactly (ignoring time)
    const todaysClasses = await TodayClass.find({
      date: { $eq: new Date(isoToday) },
    });

    res.status(200).json(todaysClasses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
