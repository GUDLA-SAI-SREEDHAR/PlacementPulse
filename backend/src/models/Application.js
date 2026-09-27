const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    studentId: { type: Number, required: true },
    studentName: { type: String },
    rollNo: { type: String },
    branch: { type: String },
    cgpa: { type: Number },
    atsScore: { type: Number },
    jobId: { type: String, required: true },
    jobTitle: { type: String },
    companyName: { type: String },
    applyDate: { type: String },
    status: {
      type: String,
      enum: ['APPLIED', 'SHORTLISTED', 'INTERVIEW_SCHEDULED', 'SELECTED', 'REJECTED'],
      default: 'APPLIED',
    },
    interviewDetails: {
      date: { type: String },
      time: { type: String },
      mode: { type: String },
      link: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Application', applicationSchema);
