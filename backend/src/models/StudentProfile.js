const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema(
  {
    studentId: { type: Number, required: true, unique: true },
    rollNo: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    program: { type: String, default: 'B.Tech' },
    branch: { type: String, default: 'Computer Science & Engineering' },
    cgpa: { type: Number, default: 8.5 },
    passingYear: { type: Number, default: 2026 },
    skills: [{ type: String }],
    isVerified: { type: Boolean, default: true },
    status: { type: String, default: 'VERIFIED' },
    offers: { type: Number, default: 0 },
    resume: {
      fileName: { type: String },
      uploadDate: { type: String },
      atsScore: { type: Number, default: 80 },
      content: { type: String },
    },
    readinessBreakdown: {
      overall: { type: Number, default: 85 },
      technical: { type: Number, default: 88 },
      aptitude: { type: Number, default: 82 },
      softSkills: { type: Number, default: 84 },
      resumeQuality: { type: Number, default: 86 },
    },
  },
  { timestamps: true }
);

studentProfileSchema.virtual('id').get(function () {
  return this.studentId;
});

studentProfileSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.studentId;
    return ret;
  },
});

studentProfileSchema.set('toObject', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret.studentId;
    return ret;
  },
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
