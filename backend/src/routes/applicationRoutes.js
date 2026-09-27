const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.get('/', applicationController.listApplications);
router.post('/', applicationController.applyForJob);
router.patch('/:appId/status', applicationController.updateStatus);

module.exports = router;
