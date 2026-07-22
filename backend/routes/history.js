const express = require('express');
const router = express.Router();
const { getAllInterviews, getInterviewById } = require('../controllers/historyController');
const protect = require('../middleware/authMiddleware');

router.get('/all', protect, getAllInterviews);
router.get('/:id', protect, getInterviewById);

module.exports = router;