const express = require('express');
const router = express.Router();
const { generateInterview } = require('../controllers/interviewController');
const protect = require('../middleware/authMiddleware');

router.post('/generate', protect, generateInterview);

module.exports = router;