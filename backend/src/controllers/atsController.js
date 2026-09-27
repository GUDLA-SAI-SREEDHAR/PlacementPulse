const TargetRole = require('../models/TargetRole');
const StudentProfile = require('../models/StudentProfile');
const { analyzeResumeATS } = require('../utils/atsAnalyzer');
const { isMongoConnected, inMemoryData } = require('../config/dataStore');

exports.analyze = async (req, res, next) => {
  try {
    const { resumeText, targetRoleId = 'fullstack' } = req.body;

    let role = null;
    if (isMongoConnected()) {
      role = await TargetRole.findOne({ id: targetRoleId });
    } else {
      role = inMemoryData.targetRoles.find((r) => r.id === targetRoleId);
    }

    if (!role) {
      role = {
        id: 'fullstack',
        title: 'Full-Stack Software Engineer',
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'System Design', 'CI/CD', 'GraphQL'],
      };
    }

    let textToAnalyze = resumeText;
    if (!textToAnalyze) {
      const email = req.user?.email || 'alex.johnson@university.edu';
      let student = null;
      if (isMongoConnected()) {
        student = await StudentProfile.findOne({ email: email.toLowerCase() });
      } else {
        student = inMemoryData.studentProfile;
      }
      textToAnalyze = student?.resume?.content || '';
    }

    const analysis = analyzeResumeATS(textToAnalyze, role.requiredSkills);

    res.json({
      targetRole: role,
      ...analysis,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTargetRoles = async (req, res, next) => {
  try {
    let roles = [];
    if (isMongoConnected()) {
      roles = await TargetRole.find();
    } else {
      roles = inMemoryData.targetRoles;
    }
    res.json(roles);
  } catch (error) {
    next(error);
  }
};
