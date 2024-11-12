const mongoose = require("mongoose");

const courseClassSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  batch: { type: String, required: true },
  mentor: { type: String, required: true },
  date: { type: Date, required: true },
  imageUrl: { type: String, required: true },
  notesPdfUrl: { type: String, required: true },
  classLink: { type: String, required: true },
});

module.exports = mongoose.model("CourseClass", courseClassSchema);
