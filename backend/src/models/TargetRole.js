const mongoose = require('mongoose');

const targetRoleSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    requiredSkills: [{ type: String }],
    avgSalary: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TargetRole', targetRoleSchema);
