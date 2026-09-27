const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');

exports.listApplications = async (req, res, next) => {
  try {
    const student_id = req.query.student_id || req.query.studentId;
    const job_id = req.query.job_id || req.query.jobId;

    const filter = {};
    if (student_id) {
      const numId = Number(student_id);
      filter.studentId = !isNaN(numId) ? numId : student_id;
    }
    if (job_id) {
      filter.jobId = job_id;
    }

    const apps = await Application.find(filter).sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    next(error);
  }
};

exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ detail: 'jobId is required' });
    }

    let student = null;

    // 1. Resolve student by authenticated user or parameter
    if (req.user?.email) {
      student = await StudentProfile.findOne({ email: req.user.email.toLowerCase().trim() });
    }
    if (!student && req.body.studentId) {
      const num = Number(req.body.studentId);
      student = await StudentProfile.findOne({ studentId: isNaN(num) ? req.body.studentId : num });
    }
    if (!student) {
      student = (await StudentProfile.findOne({ studentId: 101 })) || (await StudentProfile.findOne());
    }

    // 2. Resolve job
    let job = await Job.findOne({ id: jobId });
    if (!job && jobId.match(/^[0-9a-fA-F]{24}$/)) {
      job = await Job.findById(jobId);
    }

    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    if (!student) {
      return res.status(400).json({ detail: 'Student profile not found. Please register or create your student profile first.' });
    }

    const currentStudentId = student.studentId || student.id || 101;

    // Check if already applied
    const existingApp = await Application.findOne({ studentId: currentStudentId, jobId: job.id });
    if (existingApp) {
      return res.status(400).json({ detail: 'Already applied for this job opportunity' });
    }

    // Generate safe unique Application ID
    const appCount = await Application.countDocuments();
    const candidateId = `APP-${1000 + appCount + 1}`;
    const duplicate = await Application.findOne({ id: candidateId });
    const newAppId = duplicate ? `APP-${Date.now().toString().slice(-4)}` : candidateId;

    const newApp = {
      id: newAppId,
      studentId: currentStudentId,
      studentName: student.name || 'Student Candidate',
      rollNo: student.rollNo || `2026CS${currentStudentId}`,
      branch: student.branch || 'Computer Science & Engineering',
      cgpa: student.cgpa || 8.5,
      atsScore: student.resume?.atsScore || 85,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      applyDate: new Date().toISOString().split('T')[0],
      status: 'APPLIED',
    };

    await Application.create(newApp);

    // Create notification for student
    try {
      await Notification.create({
        id: `NOTIF-${Date.now()}`,
        studentId: currentStudentId,
        title: 'Application Submitted',
        message: `You successfully applied for ${job.title} at ${job.companyName}.`,
        type: 'APPLICATION',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        isRead: false,
      });
    } catch (notifErr) {
      console.warn('[Application Notification Warning]', notifErr.message);
    }

    res.status(201).json({
      ...newApp,
      application: newApp,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { appId } = req.params;
    const { status, interviewDetails } = req.body;

    if (!status) {
      return res.status(400).json({ detail: 'Status is required' });
    }

    const updateDoc = { status };
    if (interviewDetails) updateDoc.interviewDetails = interviewDetails;

    const application = await Application.findOneAndUpdate(
      { $or: [{ id: appId }, ...(appId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: appId }] : [])] },
      { $set: updateDoc },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ detail: 'Application not found' });
    }

    // Create notification for candidate
    try {
      await Notification.create({
        id: `NOTIF-${Date.now()}`,
        studentId: application.studentId,
        title: `Application Status: ${status.replace('_', ' ')}`,
        message: `Your application for ${application.jobTitle} at ${application.companyName} is now ${status.replace('_', ' ')}.`,
        type: status === 'INTERVIEW_SCHEDULED' ? 'INTERVIEW' : 'STATUS',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        isRead: false,
      });
    } catch (notifErr) {
      console.warn('[Status Notification Warning]', notifErr.message);
    }

    const appObj = application.toObject ? application.toObject() : application;

    res.json({
      ...appObj,
      application: appObj,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
