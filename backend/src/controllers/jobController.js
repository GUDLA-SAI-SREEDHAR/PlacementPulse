const Job = require('../models/Job');
const { isMongoConnected, inMemoryData } = require('../config/dataStore');

exports.listJobs = async (req, res, next) => {
  try {
    const { status, search, branch } = req.query;

    if (isMongoConnected()) {
      const filter = {};
      if (status) filter.status = status.toUpperCase();
      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { companyName: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      if (branch) filter.eligibleBranches = { $in: [branch] };

      const jobs = await Job.find(filter).sort({ postedDate: -1 });
      return res.json(jobs);
    }

    // In-memory fallback filtering
    let jobs = [...inMemoryData.jobs];
    if (status) {
      jobs = jobs.filter((j) => j.status === status.toUpperCase());
    }
    if (search) {
      const s = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(s) ||
          j.companyName.toLowerCase().includes(s) ||
          j.description.toLowerCase().includes(s)
      );
    }
    if (branch) {
      jobs = jobs.filter((j) => j.eligibleBranches.includes(branch));
    }

    res.json(jobs);
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

    let job = null;

    if (isMongoConnected()) {
      const count = await Job.countDocuments();
      const newId = `JOB-2026-${String(count + 1).padStart(2, '0')}`;
      job = await Job.create({
        id: newId,
        recruiterId: req.user?.id || 501,
        companyName: companyName || 'Nexus AI Tech',
        title,
        location: location || 'Hybrid',
        ctc: ctc || '12.0 LPA',
        minCgpa: minCgpa || 7.0,
        eligibleBranches: eligibleBranches || ['Computer Science & Engineering', 'Information Technology'],
        skillsRequired: skillsRequired || ['React', 'Node.js'],
        description: description || 'Software engineering position.',
        lastDate: lastDate || '2026-09-30',
        status: req.user?.role === 'ADMIN' ? 'APPROVED' : 'PENDING',
        postedDate: new Date().toISOString().split('T')[0],
      });
    } else {
      const newId = `JOB-2026-${String(inMemoryData.jobs.length + 1).padStart(2, '0')}`;
      job = {
        id: newId,
        recruiterId: req.user?.id || 501,
        companyName: companyName || 'Nexus AI Tech',
        title: title || 'Software Engineer',
        location: location || 'Hybrid',
        ctc: ctc || '12.0 LPA',
        minCgpa: minCgpa || 7.0,
        eligibleBranches: eligibleBranches || ['Computer Science & Engineering'],
        skillsRequired: skillsRequired || ['React', 'Node.js'],
        description: description || 'New software job opening.',
        lastDate: lastDate || '2026-09-30',
        status: 'PENDING',
        postedDate: new Date().toISOString().split('T')[0],
      };
      inMemoryData.jobs.unshift(job);
    }

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

exports.approveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status = 'APPROVED' } = req.body;

    let job = null;

    if (isMongoConnected()) {
      job = await Job.findOneAndUpdate(
        { id: jobId },
        { $set: { status } },
        { new: true }
      );
    } else {
      job = inMemoryData.jobs.find((j) => j.id === jobId);
      if (job) job.status = status;
    }

    if (!job) {
      return res.status(404).json({ detail: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
};
