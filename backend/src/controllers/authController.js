const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Server cannot start securely.');
  process.exit(1);
}

// Demo credentials — only available in development mode
const HARDCODED_CREDENTIALS = process.env.NODE_ENV === 'production' ? {} : {
  STUDENT: { email: 'alex.johnson@university.edu', password: 'student123', name: 'Alex Johnson', id: 101, role: 'STUDENT' },
  RECRUITER: { email: 's.jenkins@nexusai.com', password: 'recruiter123', name: 'Sarah Jenkins', id: 501, role: 'RECRUITER', companyName: 'Nexus AI Tech' },
  ADMIN: { email: 'admin@university.edu', password: 'admin123', name: 'Admin Officer', id: 1, role: 'ADMIN' },
};

exports.login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ detail: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const normalizedRole = role ? role.toUpperCase().trim() : null;

    let user = await User.findOne({ email: cleanEmail });
    let profile = null;

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch && password !== user.password) {
        return res.status(401).json({ detail: 'Invalid email or password' });
      }
    } else {
      // Fallback check for demo credentials if not yet explicitly saved in DB
      const demoUser = Object.values(HARDCODED_CREDENTIALS).find(
        (c) => c.email.toLowerCase() === cleanEmail && c.password === password
      );

      if (demoUser) {
        user = {
          _id: demoUser.id,
          id: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
          name: demoUser.name,
        };
      } else {
        return res.status(401).json({ detail: 'Invalid email or password' });
      }
    }

    const effectiveRole = user.role || normalizedRole || 'STUDENT';

    const token = jwt.sign(
      { id: user._id || user.id, email: user.email, role: effectiveRole },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    if (effectiveRole === 'STUDENT') {
      profile = await StudentProfile.findOne({ email: cleanEmail });
      if (!profile) {
        profile = (await StudentProfile.findOne({ studentId: 101 })) || (await StudentProfile.findOne());
      }
    } else if (effectiveRole === 'RECRUITER') {
      profile = await RecruiterProfile.findOne({ email: cleanEmail });
      if (!profile) {
        profile = (await RecruiterProfile.findOne({ recruiterId: 501 })) || (await RecruiterProfile.findOne());
      }
    }

    const profileObj = profile ? (profile.toObject ? profile.toObject() : { ...profile }) : null;
    if (profileObj) {
      profileObj.id = profileObj.studentId || profileObj.recruiterId || user.id || user._id;
    }

    res.json({
      token,
      user: {
        id: user._id || user.id,
        email: user.email,
        role: effectiveRole,
        name: user.name || profileObj?.name || 'User',
      },
      profile: profileObj,
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, role, name, rollNo, companyName, branch, phone, cgpa } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ detail: 'Email, password, and role are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const normalizedRole = role.toUpperCase().trim();

    if (!['STUDENT', 'RECRUITER', 'ADMIN'].includes(normalizedRole)) {
      return res.status(400).json({ detail: 'Invalid role. Must be STUDENT, RECRUITER, or ADMIN' });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ detail: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email: cleanEmail,
      password: hashedPassword,
      role: normalizedRole,
      name: name || '',
      rollNo: rollNo || '',
      companyName: companyName || '',
    });

    let profile = null;

    if (normalizedRole === 'STUDENT') {
      const lastStudent = await StudentProfile.findOne().sort({ studentId: -1 });
      const studentId = lastStudent && typeof lastStudent.studentId === 'number' ? Math.max(lastStudent.studentId + 1, 101) : 101;
      const generatedRoll = rollNo || `2026CS${studentId}`;

      profile = await StudentProfile.create({
        studentId,
        rollNo: generatedRoll,
        name: name || 'Registered Student',
        email: cleanEmail,
        phone: phone || '',
        branch: branch || 'Computer Science & Engineering',
        cgpa: cgpa !== undefined ? Number(cgpa) : 8.5,
        skills: ['JavaScript', 'HTML5', 'CSS3', 'Node.js', 'React'],
        isVerified: false,
        status: 'PENDING',
      });
    } else if (normalizedRole === 'RECRUITER') {
      const lastRecruiter = await RecruiterProfile.findOne().sort({ recruiterId: -1 });
      const recruiterId = lastRecruiter && typeof lastRecruiter.recruiterId === 'number' ? Math.max(lastRecruiter.recruiterId + 1, 501) : 501;

      profile = await RecruiterProfile.create({
        recruiterId,
        companyName: companyName || name || 'New Enterprise',
        contactPerson: name || 'Recruiter',
        email: cleanEmail,
        mobile: phone || '',
      });
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const profileObj = profile ? (profile.toObject ? profile.toObject() : { ...profile }) : null;
    if (profileObj) {
      profileObj.id = profileObj.studentId || profileObj.recruiterId || newUser._id;
    }

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name || profileObj?.name,
      },
      profile: profileObj,
    });
  } catch (error) {
    next(error);
  }
};
