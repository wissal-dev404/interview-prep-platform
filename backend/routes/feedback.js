const express = require('express');
const router = express.Router();
const { submitAnswer } = require('../controllers/feedbackController');
const protect = require('../middleware/authMiddleware');

router.post('/submit', protect, submitAnswer);

module.exports = router;