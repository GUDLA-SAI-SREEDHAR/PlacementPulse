const mongoose = require('mongoose');

const roundSchema = new mongoose.Schema({
  title: { type: String },
  details: { type: String },
});

const interviewExperienceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    author: { type: String },
    rating: { type: Number, default: 4.5 },
    difficulty: { type: String, default: 'Medium' },
    date: { type: String },
    rounds: [roundSchema],
    tips: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('InterviewExperience', interviewExperienceSchema);
