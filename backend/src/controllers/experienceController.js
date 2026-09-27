const InterviewExperience = require('../models/InterviewExperience');

const DEFAULT_EXPERIENCES = [
  {
    id: 'EXP-1',
    company: 'Nexus AI Tech',
    role: 'Software Development Engineer - I',
    author: 'Class of 2025 Alumni',
    rating: 4.8,
    difficulty: 'Medium-Hard',
    date: 'July 2025',
    rounds: [
      { title: 'Round 1: Online Coding Assessment', details: '3 DSA questions (Dynamic Programming, Graph Shortest Path, String Manipulation).' },
      { title: 'Round 2: Technical Interview 1', details: 'Deep dive into React virtual DOM, async JavaScript, and architecture design.' },
      { title: 'Round 3: System Design & Culture Fit', details: 'Discussed caching strategies (Redis) and database indexing.' }
    ],
    tips: 'Focus heavily on Tree traversals, System Design basics, and explain your thought process out loud.'
  }
];

exports.listExperiences = async (req, res, next) => {
  try {
    let experiences = await InterviewExperience.find().sort({ createdAt: -1 });

    // Auto-seed default experience into MongoDB if collection is completely empty
    if (!experiences || experiences.length === 0) {
      try {
        await InterviewExperience.insertMany(DEFAULT_EXPERIENCES);
        experiences = await InterviewExperience.find().sort({ createdAt: -1 });
      } catch (seedErr) {
        experiences = DEFAULT_EXPERIENCES;
      }
    }

    res.json(experiences);
  } catch (error) {
    next(error);
  }
};

exports.addExperience = async (req, res, next) => {
  try {
    const { company, role, author, rating, difficulty, rounds, tips } = req.body;

    if (!company || !role) {
      return res.status(400).json({ detail: 'Company and role are required' });
    }

    // Generate safe unique ID
    const allExp = await InterviewExperience.find({}, { id: 1 });
    let maxNum = 0;
    for (const e of allExp) {
      const match = e.id && e.id.match(/EXP-(\d+)/);
      if (match) {
        const n = parseInt(match[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
    const newId = maxNum > 0 ? `EXP-${maxNum + 1}` : `EXP-${Date.now()}`;

    const expObj = {
      id: newId,
      company,
      role,
      author: author || req.user?.name || 'Anonymous Student',
      rating: rating ? Number(rating) : 4.5,
      difficulty: difficulty || 'Medium',
      date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      rounds: Array.isArray(rounds) ? rounds : [],
      tips: tips || '',
    };

    await InterviewExperience.create(expObj);
    res.status(201).json(expObj);
  } catch (error) {
    next(error);
  }
};
