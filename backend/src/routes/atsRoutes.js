const express = require('express');
const router = express.Router();
const atsController = require('../controllers/atsController');

router.post('/analyze', atsController.analyze);
router.get('/target-roles', atsController.getTargetRoles);

module.exports = router;
