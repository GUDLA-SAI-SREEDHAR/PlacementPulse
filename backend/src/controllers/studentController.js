const StudentProfile = require('../models/StudentProfile');
const { analyzeResumeATS } = require('../utils/atsAnalyzer');
const { isMongoConnected, inMemoryData } = require('../config/dataStore');

// GET /api/students/profile
exports.getProfile = async (req, res, next) => {
  try {
    const email = req.user?.email || 'alex.johnson@university.edu';
    let profile = null;

    if (isMongoConnected()) {
      profile = await StudentProfile.findOne({ email: email.toLowerCase() });
      if (!profile) profile = await StudentProfile.findOne({ studentId: 101 });
    } else {
      profile = inMemoryData.studentProfile;
    }

    if (!profile) {
      return res.status(404).json({ detail: 'Student profile not found' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};

// GET /api/students/:studentId
exports.getStudentById = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    let student = null;

    if (isMongoConnected()) {
      const numId = Number(studentId);
      if (!isNaN(numId)) {
        student = await StudentProfile.findOne({ studentId: numId });
      }
      if (!student && studentId.match(/^[0-9a-fA-F]{24}$/)) {
        student = await StudentProfile.findById(studentId);
      }
    } else {
      const numId = Number(studentId);
      student = inMemoryData.studentsList.find((s) => s.studentId === numId);
      if (!student && inMemoryData.studentProfile && inMemoryData.studentProfile.studentId === numId) {
        student = inMemoryData.studentProfile;
      }
    }

    if (!student) {
      return res.status(404).json({ detail: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    next(error);
  }
};

// GET /api/students
exports.listStudents = async (req, res, next) => {
  try {
    let students = [];
    const { branch, status, search } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (branch) filter.branch = branch;
      if (status) filter.status = status;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { rollNo: { $regex: search, $options: 'i' } },
        ];
      }
      students = await StudentProfile.find(filter).sort({ studentId: 1 });
    } else {
      students = [...inMemoryData.studentsList];
      if (branch) students = students.filter((s) => s.branch === branch);
      if (status) students = students.filter((s) => s.status === status);
      if (search) {
        const q = search.toLowerCase();
        students = students.filter(
          (s) =>
            (s.name && s.name.toLowerCase().includes(q)) ||
            (s.email && s.email.toLowerCase().includes(q)) ||
            (s.rollNo && s.rollNo.toLowerCase().includes(q))
        );
      }
    }

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

    let newStudentId = req.body.studentId;

    if (isMongoConnected()) {
      if (!newStudentId) {
        const lastStudent = await StudentProfile.findOne().sort({ studentId: -1 });
        newStudentId = lastStudent && lastStudent.studentId ? lastStudent.studentId + 1 : 101;
      }

      const existing = await StudentProfile.findOne({
        $or: [{ email: email.toLowerCase() }, { studentId: newStudentId }, { rollNo }],
      });

      if (existing) {
        return res.status(409).json({ detail: 'Student with this email, studentId, or rollNo already exists' });
      }

      const newProfile = await StudentProfile.create({
        studentId: newStudentId,
        rollNo,
        name,
        email: email.toLowerCase(),
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

      return res.status(201).json(newProfile);
    } else {
      if (!newStudentId) {
        const maxId = inMemoryData.studentsList.reduce((max, s) => Math.max(max, s.studentId || 0), 100);
        newStudentId = maxId + 1;
      }

      const existing = inMemoryData.studentsList.find(
        (s) => s.email === email.toLowerCase() || s.studentId === newStudentId || s.rollNo === rollNo
      );

      if (existing) {
        return res.status(409).json({ detail: 'Student with this email, studentId, or rollNo already exists' });
      }

      const newStudent = {
        studentId: newStudentId,
        rollNo,
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        program: program || 'B.Tech',
        branch: branch || 'Computer Science & Engineering',
        cgpa: cgpa !== undefined ? Number(cgpa) : 8.0,
        passingYear: passingYear ? Number(passingYear) : 2026,
        skills: Array.isArray(skills) ? skills : skills ? skills.split(',').map((s) => s.trim()) : [],
        isVerified: req.body.isVerified !== undefined ? req.body.isVerified : false,
        status: req.body.status || 'PENDING',
        offers: req.body.offers || 0,
      };

      inMemoryData.studentsList.push(newStudent);
      return res.status(201).json(newStudent);
    }
  } catch (error) {
    next(error);
  }
};

// PUT /api/students/profile
exports.updateProfile = async (req, res, next) => {
  try {
    const email = req.user?.email || 'alex.johnson@university.edu';
    const profileUpdates = req.body;

    let profile = null;

    if (isMongoConnected()) {
      profile = await StudentProfile.findOneAndUpdate(
        { email: email.toLowerCase() },
        { $set: profileUpdates },
        { new: true, runValidators: true }
      );
    } else {
      Object.assign(inMemoryData.studentProfile, profileUpdates);
      profile = inMemoryData.studentProfile;
    }

    if (!profile) {
      return res.status(404).json({ detail: 'Student profile not found' });
    }

    res.json(profile);
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

    if (isMongoConnected()) {
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
    } else {
      const numId = Number(studentId);
      const index = inMemoryData.studentsList.findIndex((s) => s.studentId === numId);
      if (index !== -1) {
        inMemoryData.studentsList[index] = {
          ...inMemoryData.studentsList[index],
          ...updates,
        };
        updatedStudent = inMemoryData.studentsList[index];
      }

      if (inMemoryData.studentProfile && inMemoryData.studentProfile.studentId === numId) {
        Object.assign(inMemoryData.studentProfile, updates);
        if (!updatedStudent) updatedStudent = inMemoryData.studentProfile;
      }
    }

    if (!updatedStudent) {
      return res.status(404).json({ detail: 'Student not found' });
    }

    res.json(updatedStudent);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/students/:studentId
exports.deleteStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    let deletedStudent = null;

    if (isMongoConnected()) {
      const numId = Number(studentId);
      if (!isNaN(numId)) {
        deletedStudent = await StudentProfile.findOneAndDelete({ studentId: numId });
      }

      if (!deletedStudent && studentId.match(/^[0-9a-fA-F]{24}$/)) {
        deletedStudent = await StudentProfile.findByIdAndDelete(studentId);
      }
    } else {
      const numId = Number(studentId);
      const index = inMemoryData.studentsList.findIndex((s) => s.studentId === numId);
      if (index !== -1) {
        deletedStudent = inMemoryData.studentsList[index];
        inMemoryData.studentsList.splice(index, 1);
      }
    }

    if (!deletedStudent) {
      return res.status(404).json({ detail: 'Student not found' });
    }

    res.json({
      message: 'Student deleted successfully',
      student: deletedStudent,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/students/resume
exports.uploadResume = async (req, res, next) => {
  try {
    const { content, fileName = 'Uploaded_Resume.pdf' } = req.body;
    const email = req.user?.email || 'alex.johnson@university.edu';

    const defaultTargetSkills = ['React', 'Node.js', 'TypeScript', 'SQL', 'Docker', 'System Design'];
    const atsResult = analyzeResumeATS(content, defaultTargetSkills);

    const resumeData = {
      fileName,
      uploadDate: new Date().toISOString().split('T')[0],
      atsScore: atsResult.score,
      content,
    };

    let profile = null;

    if (isMongoConnected()) {
      profile = await StudentProfile.findOneAndUpdate(
        { email: email.toLowerCase() },
        {
          $set: {
            resume: resumeData,
            'readinessBreakdown.resumeQuality': atsResult.score,
          },
        },
        { new: true }
      );
    } else {
      inMemoryData.studentProfile.resume = resumeData;
      inMemoryData.studentProfile.readinessBreakdown.resumeQuality = atsResult.score;
      profile = inMemoryData.studentProfile;
    }

    res.json({
      message: 'Resume uploaded and analyzed successfully',
      resume: resumeData,
      atsAnalysis: atsResult,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/students/:studentId/verify
exports.verifyStudent = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const isVerified = req.query.is_verified === 'true';

    let profile = null;

    if (isMongoConnected()) {
      profile = await StudentProfile.findOneAndUpdate(
        { studentId: Number(studentId) },
        {
          $set: {
            isVerified,
            status: isVerified ? 'VERIFIED' : 'PENDING',
          },
        },
        { new: true }
      );
    } else {
      const st = inMemoryData.studentsList.find((s) => s.studentId === Number(studentId));
      if (st) {
        st.isVerified = isVerified;
        st.status = isVerified ? 'VERIFIED' : 'PENDING';
        profile = st;
      }
    }

    if (!profile) {
      return res.status(404).json({ detail: 'Student not found' });
    }

    res.json(profile);
  } catch (error) {
    next(error);
  }
};
