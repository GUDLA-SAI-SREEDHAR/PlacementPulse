const Application = require('../models/Application');
const Job = require('../models/Job');
const StudentProfile = require('../models/StudentProfile');
const Notification = require('../models/Notification');
const { isMongoConnected, inMemoryData } = require('../config/dataStore');

exports.listApplications = async (req, res, next) => {
  try {
    const { student_id, job_id } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (student_id) filter.studentId = Number(student_id);
      if (job_id) filter.jobId = job_id;
      const apps = await Application.find(filter).sort({ createdAt: -1 });
      return res.json(apps);
    }

    let apps = [...inMemoryData.applications];
    if (student_id) apps = apps.filter((a) => a.studentId === Number(student_id));
    if (job_id) apps = apps.filter((a) => a.jobId === job_id);

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
    let job = null;

    if (isMongoConnected()) {
      student = await StudentProfile.findOne({ studentId: 101 });
      job = await Job.findOne({ id: jobId });
    } else {
      student = inMemoryData.studentProfile;
      job = inMemoryData.jobs.find((j) => j.id === jobId);
    }

    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    const existingApp = isMongoConnected()
      ? await Application.findOne({ studentId: student.studentId, jobId: job.id })
      : inMemoryData.applications.find((a) => a.studentId === student.studentId && a.jobId === job.id);

    if (existingApp) {
      return res.status(400).json({ detail: 'Already applied for this job opportunity' });
    }

    const newAppId = `APP-${1000 + inMemoryData.applications.length + 1}`;
    const newApp = {
      id: newAppId,
      studentId: student.studentId,
      studentName: student.name,
      rollNo: student.rollNo,
      branch: student.branch,
      cgpa: student.cgpa,
      atsScore: student.resume?.atsScore || 85,
      jobId: job.id,
      jobTitle: job.title,
      companyName: job.companyName,
      applyDate: new Date().toISOString().split('T')[0],
      status: 'APPLIED',
    };

    if (isMongoConnected()) {
      await Application.create(newApp);
    } else {
      inMemoryData.applications.unshift(newApp);
    }

    res.status(201).json(newApp);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { appId } = req.params;
    const { status, interviewDetails } = req.body;

    let application = null;

    if (isMongoConnected()) {
      const updateDoc = { status };
      if (interviewDetails) updateDoc.interviewDetails = interviewDetails;
      application = await Application.findOneAndUpdate(
        { id: appId },
        { $set: updateDoc },
        { new: true }
      );
    } else {
      application = inMemoryData.applications.find((a) => a.id === appId);
      if (application) {
        application.status = status;
        if (interviewDetails) application.interviewDetails = interviewDetails;
      }
    }

    if (!application) {
      return res.status(404).json({ detail: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    next(error);
  }
};
