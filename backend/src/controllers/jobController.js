const Job = require('../models/Job');
const Notification = require('../models/Notification');

exports.listJobs = async (req, res, next) => {
  try {
    const { status, search, branch, recruiter_id, recruiterId } = req.query;

    const filter = {};
    if (status) filter.status = status.toUpperCase();
    if (recruiter_id || recruiterId) {
      filter.recruiterId = Number(recruiter_id || recruiterId);
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (branch) filter.eligibleBranches = { $in: [branch] };

    const jobs = await Job.find(filter).sort({ postedDate: -1, createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    next(error);
  }
};

exports.getJobById = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    let job = await Job.findOne({ id: jobId });
    if (!job && jobId.match(/^[0-9a-fA-F]{24}$/)) {
      job = await Job.findById(jobId);
    }

    if (!job) {
      return res.status(404).json({ detail: 'Job opportunity not found' });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
};

exports.postJob = async (req, res, next) => {
  try {
    const {
      title,
      companyName,
      location,
      ctc,
      minCgpa,
      eligibleBranches,
      skillsRequired,
      description,
      lastDate,
    } = req.body;

    if (!title) {
      return res.status(400).json({ detail: 'Job title is required' });
    }

    // Find highest job index to prevent collisions
    const existingJobs = await Job.find({}, { id: 1 });
    let maxNum = 0;
    for (const j of existingJobs) {
      const match = j.id && j.id.match(/JOB-2026-(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    const newId = `JOB-2026-${String(maxNum + 1).padStart(2, '0')}`;

    const job = await Job.create({
      id: newId,
      recruiterId: req.user?.id || req.body.recruiterId || 501,
      companyName: companyName || req.user?.companyName || 'Campus Partner',
      title,
      location: location || 'Hybrid',
      ctc: ctc || '12.0 LPA',
      minCgpa: minCgpa !== undefined ? Number(minCgpa) : 7.0,
      eligibleBranches: Array.isArray(eligibleBranches)
        ? eligibleBranches
        : eligibleBranches
        ? eligibleBranches.split(',').map((b) => b.trim())
        : ['Computer Science & Engineering', 'Information Technology'],
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : skillsRequired
        ? skillsRequired.split(',').map((s) => s.trim())
        : ['JavaScript', 'React', 'Node.js'],
      description: description || 'Exciting graduate engineering role.',
      lastDate: lastDate || '2026-10-30',
      status: req.user?.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
      postedDate: new Date().toISOString().split('T')[0],
    });

    // Create notification
    try {
      await Notification.create({
        id: `NOTIF-${Date.now()}`,
        title: 'New Job Drive Posted',
        message: `${job.companyName} posted a new position: ${job.title}`,
        type: 'JOB',
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        isRead: false,
      });
    } catch (notifErr) {
      console.warn('[Job Notification Warning]', notifErr.message);
    }

    const jobObj = job.toObject ? job.toObject() : job;

    res.status(201).json({
      ...jobObj,
      job: jobObj,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

exports.approveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status = 'APPROVED' } = req.body;

    const job = await Job.findOneAndUpdate(
      { $or: [{ id: jobId }, ...(jobId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: jobId }] : [])] },
      { $set: { status } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    const jobObj = job.toObject ? job.toObject() : job;

    res.json({
      ...jobObj,
      job: jobObj,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
