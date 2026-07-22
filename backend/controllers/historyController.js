const pool = require('../config/db');

const getAllInterviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const interviews = await pool.query(
      'SELECT id, job_role, created_at FROM interviews WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    res.status(200).json({
      message: 'Interviews fetched ✅',
      interviews: interviews.rows
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const interview = await pool.query(
      'SELECT * FROM interviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (interview.rows.length === 0) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const answers = await pool.query(
      'SELECT * FROM answers WHERE interview_id = $1',
      [id]
    );

    res.status(200).json({
      message: 'Interview fetched ✅',
      interview: {
        ...interview.rows[0],
        answers: answers.rows
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllInterviews, getInterviewById };