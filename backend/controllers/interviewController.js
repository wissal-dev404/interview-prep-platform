const Groq = require('groq-sdk');
const pool = require('../config/db');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const generateInterview = async (req, res) => {
  try {
    const { jobRole, cvText } = req.body;
    const userId = req.user.id;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an expert technical interviewer.
          Generate 5 interview questions for a ${jobRole} position.
          ${cvText ? `Based on this CV: ${cvText}` : ''}
          
          Return ONLY a JSON array like this, nothing else:
          {"questions": ["question1", "question2", "question3", "question4", "question5"]}`
        }
      ]
    });

    const text = completion.choices[0].message.content;
    const cleanText = text.replace(/```json|```/g, '').trim();
    const response = JSON.parse(cleanText);

    // Save interview to database
    const newInterview = await pool.query(
      'INSERT INTO interviews (user_id, job_role, questions) VALUES ($1, $2, $3) RETURNING *',
      [userId, jobRole, JSON.stringify(response.questions)]
    );

    res.status(200).json({
      message: 'Interview questions generated ✅',
      interview: {
        id: newInterview.rows[0].id,
        jobRole,
        userId,
        questions: response.questions,
        createdAt: newInterview.rows[0].created_at
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { generateInterview };