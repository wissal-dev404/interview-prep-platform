require('./config/db');
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const interviewRoutes = require('./routes/interview');
const feedbackRoutes = require('./routes/feedback');
const historyRoutes = require('./routes/history');

app.use('/auth', authRoutes);
app.use('/interview', interviewRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/history', historyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Interview Prep API is running! 🚀' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});