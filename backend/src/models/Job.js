const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    recruiterId: { type: Number },
    companyName: { type: String, required: true },
    title: { type: String, required: true },
    location: { type: String },
    ctc: { type: String },
    minCgpa: { type: Number, default: 0 },
    eligibleBranches: [{ type: String }],
    skillsRequired: [{ type: String }],
    description: { type: String },
    lastDate: { type: String },
    status: { type: String, enum: ['APPROVED', 'PENDING', 'REJECTED'], default: 'PENDING' },
    postedDate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
