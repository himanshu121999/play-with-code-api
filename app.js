const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");
const todayClassRoutes = require("./routes/todayClassRoutes");
const courseClassRoutes = require("./routes/classRoutes");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/students", studentRoutes);
app.use("/api/todays-classes", todayClassRoutes);
app.use("/api/classes", courseClassRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
