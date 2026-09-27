const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const RecruiterProfile = require('../models/RecruiterProfile');
const { isMongoConnected, inMemoryData } = require('../config/dataStore');

const JWT_SECRET = process.env.JWT_SECRET || 'placement_pulse_jwt_secret_key_2026';

const HARDCODED_CREDENTIALS = {
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

    let user = null;
    let profile = null;

    if (isMongoConnected()) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch && password !== user.password) {
          return res.status(401).json({ detail: 'Invalid email or password' });
        }
      }
    }

    if (!user) {
      const demoUser = Object.values(HARDCODED_CREDENTIALS).find(
        (c) => c.email.toLowerCase() === email.toLowerCase() && c.password === password
      );

      if (demoUser) {
        user = {
          _id: demoUser.id,
          email: demoUser.email,
          role: demoUser.role,
          name: demoUser.name,
        };
      } else {
        return res.status(401).json({ detail: 'Invalid email or password' });
      }
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role || role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    if (isMongoConnected()) {
      if ((user.role || role) === 'STUDENT') {
        profile = await StudentProfile.findOne({ email: user.email });
      } else if ((user.role || role) === 'RECRUITER') {
        profile = await RecruiterProfile.findOne({ email: user.email });
      }
    } else {
      profile = (user.role || role) === 'STUDENT' ? inMemoryData.studentProfile : null;
    }

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role || role,
        name: user.name || profile?.name || 'User',
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, role, name, rollNo, companyName, branch, phone } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ detail: 'Email, password, and role are required' });
    }

    let newUser = null;
    let profile = null;

    if (isMongoConnected()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ detail: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      newUser = await User.create({
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        name,
        rollNo,
        companyName,
      });

      if (role === 'STUDENT') {
        const studentId = Math.floor(100 + Math.random() * 900);
        profile = await StudentProfile.create({
          studentId,
          rollNo: rollNo || `2026CS${studentId}`,
          name: name || 'Registered Student',
          email: newUser.email,
          phone: phone || '',
          branch: branch || 'Computer Science & Engineering',
          cgpa: 8.5,
          skills: ['JavaScript', 'HTML5', 'CSS3', 'Node.js'],
          isVerified: false,
          status: 'PENDING',
        });
      } else if (role === 'RECRUITER') {
        const recruiterId = Math.floor(500 + Math.random() * 500);
        profile = await RecruiterProfile.create({
          recruiterId,
          companyName: companyName || 'New Enterprise',
          contactPerson: name || 'Recruiter',
          email: newUser.email,
        });
      }
    } else {
      const id = Date.now();
      newUser = { _id: id, email, role, name };
      inMemoryData.users.push(newUser);
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};
