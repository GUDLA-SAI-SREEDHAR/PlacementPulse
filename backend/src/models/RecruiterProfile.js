const mongoose = require('mongoose');

const recruiterProfileSchema = new mongoose.Schema(
  {
    recruiterId: { type: Number, required: true, unique: true },
    companyId: { type: String },
    companyName: { type: String, required: true },
    industry: { type: String },
    contactPerson: { type: String },
    email: { type: String, required: true },
    mobile: { type: String },
    location: { type: String },
    website: { type: String },
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RecruiterProfile', recruiterProfileSchema);
