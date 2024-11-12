const express = require("express");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Create a new student (POST /api/students)
router.post("/", async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    const savedStudent = await newStudent.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all students (GET /api/students)
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login student (POST /api/students/login)
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the student by username
    const student = await Student.findOne({ username });
    if (!student)
      return res.status(404).json({ error: "Invalid username or password" });

    // Compare passwords
    const isMatch = await student.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid username or password" });

    // Generate JWT token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      token,
      student: { id: student._id, username: student.username , name: student.name },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
