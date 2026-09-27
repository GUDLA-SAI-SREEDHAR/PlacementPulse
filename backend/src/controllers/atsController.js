const TargetRole = require('../models/TargetRole');
const StudentProfile = require('../models/StudentProfile');
const { analyzeResumeATS } = require('../utils/atsAnalyzer');

const DEFAULT_TARGET_ROLE = {
  id: 'fullstack',
  title: 'Full-Stack Software Engineer',
  requiredSkills: ['React', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'System Design', 'CI/CD', 'GraphQL'],
  avgSalary: '14.5 LPA',
};

exports.analyze = async (req, res, next) => {
  try {
    const { resumeText, targetRoleId = 'fullstack' } = req.body;

    let role = await TargetRole.findOne({ id: targetRoleId });
    if (!role) {
      role = (await TargetRole.findOne()) || DEFAULT_TARGET_ROLE;
    }

    let textToAnalyze = resumeText;
    if (!textToAnalyze) {
      const email = req.user?.email;
      let student = null;
      if (email) {
        student = await StudentProfile.findOne({ email: email.toLowerCase().trim() });
      }
      if (!student) {
        student = (await StudentProfile.findOne({ studentId: 101 })) || (await StudentProfile.findOne());
      }
      textToAnalyze = student?.resume?.content || '';
    }

    const analysis = analyzeResumeATS(textToAnalyze, role.requiredSkills || DEFAULT_TARGET_ROLE.requiredSkills);

    res.json({
      targetRole: role,
      ...analysis,
      atsResult: analysis,
    });
  } catch (error) {
    next(error);
  }
};

exports.getTargetRoles = async (req, res, next) => {
  try {
    let roles = await TargetRole.find();
    if (!roles || roles.length === 0) {
      roles = [DEFAULT_TARGET_ROLE];
    }
    res.json(roles);
  } catch (error) {
    next(error);
  }
};
