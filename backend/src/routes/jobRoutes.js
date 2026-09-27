const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');

router.get('/', jobController.listJobs);
router.post('/', jobController.postJob);
router.patch('/:jobId/approve', jobController.approveJob);

module.exports = router;
