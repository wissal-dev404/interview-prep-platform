const Groq = require('groq-sdk');
const pool = require('../config/db');
require('dotenv').config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const submitAnswer = async (req, res) => {
  try {
    const { interviewId, question, answer } = req.body;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'user',
          content: `You are an expert technical interviewer.
          Evaluate this interview answer:
          
          Question: ${question}
          Answer: ${answer}
          
          Return ONLY a JSON object like this, nothing else:
          {
            "feedback": "detailed feedback here",
            "strengths": "what was good",
            "weaknesses": "what needs improvement",
            "score": 7
          }
          
          Score should be between 1-10.`
        }
      ]
    });

    const text = completion.choices[0].message.content;
    const cleanText = text.replace(/```json|```/g, '').trim();
    const response = JSON.parse(cleanText);

    // Save answer + feedback to database
    const savedAnswer = await pool.query(
      'INSERT INTO answers (interview_id, question, answer, feedback, score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [interviewId, question, answer, response.feedback, response.score]
    );

    res.status(200).json({
      message: 'Answer evaluated ✅',
      result: {
        id: savedAnswer.rows[0].id,
        question,
        answer,
        feedback: response.feedback,
        strengths: response.strengths,
        weaknesses: response.weaknesses,
        score: response.score
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { submitAnswer };