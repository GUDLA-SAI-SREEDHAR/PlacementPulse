const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// GET routes
router.get('/', studentController.listStudents);
router.get('/profile', studentController.getProfile);
router.get('/:studentId', studentController.getStudentById);

// POST routes
router.post('/', studentController.createStudent);
router.post('/resume', studentController.uploadResume);

// PUT routes
router.put('/profile', studentController.updateProfile);
router.put('/:studentId', studentController.updateStudent);

// PATCH routes
router.patch('/:studentId/verify', studentController.verifyStudent);

// DELETE routes
router.delete('/:studentId', studentController.deleteStudent);

module.exports = router;
