const InterviewExperience = require('../models/InterviewExperience');
const { isMongoConnected, inMemoryData } = require('../config/dataStore');

exports.listExperiences = async (req, res, next) => {
  try {
    let experiences = [];
    if (isMongoConnected()) {
      experiences = await InterviewExperience.find().sort({ createdAt: -1 });
    } else {
      experiences = inMemoryData.experiences;
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

    const newId = `EXP-${inMemoryData.experiences.length + 1}`;
    const expObj = {
      id: newId,
      company,
      role,
      author: author || 'Anonymous Student',
      rating: rating || 4.5,
      difficulty: difficulty || 'Medium',
      date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      rounds: rounds || [],
      tips: tips || '',
    };

    if (isMongoConnected()) {
      await InterviewExperience.create(expObj);
    } else {
      inMemoryData.experiences.unshift(expObj);
    }

    res.status(201).json(expObj);
  } catch (error) {
    next(error);
  }
};
