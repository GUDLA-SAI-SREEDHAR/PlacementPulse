const StudentProfile = require('../models/StudentProfile');
const { analyzeResumeATS } = require('../utils/atsAnalyzer');

const formatStudent = (student) => {
  if (!student) return null;
  const s = student.toObject ? student.toObject() : { ...student };
  s.id = s.studentId || s.id || 101;
  return s;
};

// GET /api/students/profile
exports.getProfile = async (req, res, next) => {
  try {
    const email = req.user?.email;
    let profile = null;

    if (email) {
      profile = await StudentProfile.findOne({ email: email.toLowerCase().trim() });
    }
    if (!profile && req.user?.id) {
      const numId = Number(req.user.id);
      if (!isNaN(numId)) {
        profile = await StudentProfile.findOne({ studentId: numId });
      }
    }
    if (!profile) {
      profile = (await StudentProfile.findOne({ studentId: 101 })) || (await StudentProfile.findOne());
    }

    if (!profile) {
      return res.status(404).json({ detail: 'Student profile not found' });
    }

    res.json(formatStudent(profile));
  } catch (error) {
    next(error);
  }
};

// GET /api/students/:studentId
exports.getStudentById = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    let student = null;

    const numId = Number(studentId);
    if (!isNaN(numId)) {
      student = await StudentProfile.findOne({ studentId: numId });
    }
    if (!student && studentId.match(/^[0-9a-fA-F]{24}$/)) {
      student = await StudentProfile.findById(studentId);
    }

    if (!student) {
      return res.status(404).json({ detail: 'Student not found' });
    }

    res.json(formatStudent(student));
  } catch (error) {
    next(error);
  }
};

// GET /api/students
exports.listStudents = async (req, res, next) => {
  try {
    const { branch, status, search } = req.query;

    const filter = {};
    if (branch) filter.branch = branch;
    if (status) filter.status = status.toUpperCase();
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } },
      ];
    }

    const rawStudents = await StudentProfile.find(filter).sort({ studentId: 1 });
    const students = rawStudents.map(formatStudent);

    res.json(students);
  } catch (error) {
    next(error);
  }
};

// POST /api/students
exports.createStudent = async (req, res, next) => {
  try {
    const { name, email, rollNo, branch, cgpa, program, passingYear, phone, skills } = req.body;

    if (!name || !email || !rollNo) {
      return res.status(400).json({ detail: 'Name, email, and rollNo are required fields' });
    }

    let newStudentId = req.body.studentId ? Number(req.body.studentId) : null;
    if (!newStudentId || isNaN(newStudentId)) {
      const lastStudent = await StudentProfile.findOne().sort({ studentId: -1 });
      newStudentId = lastStudent && typeof lastStudent.studentId === 'number' ? Math.max(lastStudent.studentId + 1, 101) : 101;
    }

    const existing = await StudentProfile.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { studentId: newStudentId }, { rollNo }],
    });

    if (existing) {
      return res.status(409).json({ detail: 'Student with this email, studentId, or rollNo already exists' });
    }

    const newProfile = await StudentProfile.create({
      studentId: newStudentId,
      rollNo,
      name,
      email: email.toLowerCase().trim(),
      phone: phone || '',
      program: program || 'B.Tech',
      branch: branch || 'Computer Science & Engineering',
      cgpa: cgpa !== undefined ? Number(cgpa) : 8.0,
      passingYear: passingYear ? Number(passingYear) : 2026,
      skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s) => s.trim()) : [],
      isVerified: req.body.isVerified !== undefined ? req.body.isVerified : false,
      status: req.body.status || 'PENDING',
      offers: req.body.offers || 0,
    });

    return res.status(201).json(formatStudent(newProfile));
  } catch (error) {
    next(error);
  }
};

// PUT /api/students/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const email = req.user?.email;
    const profileUpdates = req.body;

    let profile = null;

    if (email) {
      profile = await StudentProfile.findOneAndUpdate(
        { email: email.toLowerCase().trim() },
        { $set: profileUpdates },
        { new: true, runValidators: true }
      );
    }

    if (!profile && profileUpdates.studentId) {
      profile = await StudentProfile.findOneAndUpdate(
        { studentId: Number(profileUpdates.studentId) },
        { $set: profileUpdates },
        { new: true, runValidators: true }
      );
    }

    if (!profile) {
      const first = await StudentProfile.findOne();
      if (first) {
        profile = await StudentProfile.findByIdAndUpdate(
          first._id,
          { $set: profileUpdates },
          { new: true, runValidators: true }
        );
      }
    }

    if (!profile) {
      return res.status(404).json({ detail: 'Student profile not found' });
    }

    res.json(formatStudent(profile));
  } catch (error) {
    next(error);
  }
};

// PUT /api/students/:studentId
exports.updateStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const updates = req.body;
    let updatedStudent = null;

    const numId = Number(studentId);
    if (!isNaN(numId)) {
      updatedStudent = await StudentProfile.findOneAndUpdate(
        { studentId: numId },
        { $set: updates },
        { new: true, runValidators: true }
      );
    }

    if (!updatedStudent && studentId.match(/^[0-9a-fA-F]{24}$/)) {
      updatedStudent = await StudentProfile.findByIdAndUpdate(
        studentId,
        { $set: updates },
        { new: true, runValidators: true }
      );
    }

    if (!updatedStudent) {
      return res.status(404).json({ detail: 'Student not found' });
    }

    res.json(formatStudent(updatedStudent));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/students/:studentId
exports.deleteStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    let deletedStudent = null;

    const numId = Number(studentId);
    if (!isNaN(numId)) {
      deletedStudent = await StudentProfile.findOneAndDelete({ studentId: numId });
    }

    if (!deletedStudent && studentId.match(/^[0-9a-fA-F]{24}$/)) {
      deletedStudent = await StudentProfile.findByIdAndDelete(studentId);
    }

    if (!deletedStudent) {
      return res.status(404).json({ detail: 'Student not found' });
    }

    res.json({
      message: 'Student deleted successfully',
      student: formatStudent(deletedStudent),
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/students/resume
exports.uploadResume = async (req, res, next) => {
  try {
    const { content, fileName = 'Uploaded_Resume.pdf' } = req.body;
    const email = req.user?.email;

    const defaultTargetSkills = ['React', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'System Design'];
    const atsResult = analyzeResumeATS(content, defaultTargetSkills);

    const resumeData = {
      fileName,
      uploadDate: new Date().toISOString().split('T')[0],
      atsScore: atsResult.score,
      content,
    };

    let query = {};
    if (email) {
      query = { email: email.toLowerCase().trim() };
    } else if (req.body.studentId) {
      query = { studentId: Number(req.body.studentId) };
    }

    let profile = await StudentProfile.findOneAndUpdate(
      query,
      {
        $set: {
          resume: resumeData,
          'readinessBreakdown.resumeQuality': atsResult.score,
        },
      },
      { new: true }
    );

    if (!profile) {
      const first = await StudentProfile.findOne();
      if (first) {
        profile = await StudentProfile.findByIdAndUpdate(
          first._id,
          {
            $set: {
              resume: resumeData,
              'readinessBreakdown.resumeQuality': atsResult.score,
            },
          },
          { new: true }
        );
      }
    }

    res.json({
      message: 'Resume uploaded and analyzed successfully',
      resume: resumeData,
      atsAnalysis: atsResult,
      atsResult: { atsScore: atsResult.score, ...atsResult },
      score: atsResult.score,
      studentProfile: formatStudent(profile),
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/students/:studentId/verify
exports.verifyStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const isVerified = req.query.is_verified === 'true' || req.query.is_verified === true || req.body.isVerified === true;

    const numId = Number(studentId);
    const query = !isNaN(numId) ? { studentId: numId } : { _id: studentId };

    const profile = await StudentProfile.findOneAndUpdate(
      query,
      {
        $set: {
          isVerified,
          status: isVerified ? 'VERIFIED' : 'PENDING',
        },
      },
      { new: true }
    );

    if (!profile) {
      return res.status(404).json({ detail: 'Student not found' });
    }

    res.json(formatStudent(profile));
  } catch (error) {
    next(error);
  }
};
