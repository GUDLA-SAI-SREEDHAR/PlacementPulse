const express = require('express');
const router = express.Router();
const experienceController = require('../controllers/experienceController');

router.get('/', experienceController.listExperiences);
router.post('/', experienceController.addExperience);

module.exports = router;
