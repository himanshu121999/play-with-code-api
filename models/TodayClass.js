const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const todayClassSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  batch: { type: String, required: true },
  mentor: { type: String, required: true },
  time: { type: String, required: true },
  zoomLink: { type: String, required: true },
  date: { type: Date, required: true },
});


module.exports = mongoose.model("TodayClass", todayClassSchema);
