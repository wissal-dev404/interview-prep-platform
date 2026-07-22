require('./config/db');
const express = require('express');
const app = express();

app.use(express.json());

const interviewRoutes = require('./routes/interview');

const feedbackRoutes = require('./routes/feedback');
app.use('/feedback', feedbackRoutes);

app.use('/interview', interviewRoutes);

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const historyRoutes = require('./routes/history');
app.use('/history', historyRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Interview Prep API is running! 🚀' });
});

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the backend! 👋' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
