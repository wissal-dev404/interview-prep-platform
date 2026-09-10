import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Results() {
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchResults(token);
  }, []);

  const fetchResults = async (token) => {
    try {
      const response = await axios.get(`http://localhost:5000/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterview(response.data.interview);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#22c55e';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const averageScore = interview?.answers?.length > 0
    ? Math.round(interview.answers.reduce((sum, a) => sum + a.score, 0) / interview.answers.length)
    : 0;

  if (loading) {
    return (
      <div style={styles.container}>
        <p style={styles.loading}>Loading results...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          ← Dashboard
        </button>
      </div>

      <div style={styles.main}>
        <div style={styles.scoreCard}>
          <h1 style={styles.title}>Interview Results 🎯</h1>
          <p style={styles.jobRole}>{interview?.job_role}</p>
          <div style={styles.scoreCircle}>
            <span style={{
              ...styles.scoreNumber,
              color: getScoreColor(averageScore)
            }}>
              {averageScore}
            </span>
            <span style={styles.scoreMax}>/10</span>
          </div>
          <p style={styles.scoreLabel}>Average Score</p>
        </div>

        <div style={styles.answersSection}>
          <h2 style={styles.sectionTitle}>Detailed Feedback</h2>
          {interview?.answers?.map((answer, index) => (
            <div key={answer.id} style={styles.answerCard}>
              <div style={styles.questionHeader}>
                <span style={styles.questionNumber}>Q{index + 1}</span>
                <div style={{
                  ...styles.scoreBadge,
                  backgroundColor: getScoreColor(answer.score) + '22',
                  color: getScoreColor(answer.score)
                }}>
                  {answer.score}/10
                </div>
              </div>

              <h3 style={styles.question}>{answer.question}</h3>

              <div style={styles.section}>
                <h4 style={styles.sectionLabel}>Your Answer:</h4>
                <p style={styles.answerText}>{answer.answer}</p>
              </div>

              <div style={styles.section}>
                <h4 style={styles.sectionLabel}>AI Feedback:</h4>
                <p style={styles.feedbackText}>{answer.feedback}</p>
              </div>

              {answer.strengths && (
                <div style={styles.strengthSection}>
                  <h4 style={styles.strengthLabel}>✅ Strengths:</h4>
                  <p style={styles.strengthText}>{answer.strengths}</p>
                </div>
              )}

              {answer.weaknesses && (
                <div style={styles.weaknessSection}>
                  <h4 style={styles.weaknessLabel}>⚠️ Weaknesses:</h4>
                  <p style={styles.weaknessText}>{answer.weaknesses}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <button style={styles.newInterviewBtn} onClick={() => navigate('/interview')}>
          Start New Interview 🚀
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a' },
  loading: { color: '#888', textAlign: 'center', padding: '100px' },
  header: { padding: '20px 40px', borderBottom: '1px solid #333', backgroundColor: '#1a1a1a' },
  backBtn: { backgroundColor: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  main: { maxWidth: '800px', margin: '0 auto', padding: '40px 20px' },
  scoreCard: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '40px', border: '1px solid #333', textAlign: 'center', marginBottom: '32px' },
  title: { color: '#ffffff', fontSize: '28px', marginBottom: '8px' },
  jobRole: { color: '#6366f1', marginBottom: '24px' },
  scoreCircle: { display: 'inline-flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' },
  scoreNumber: { fontSize: '72px', fontWeight: 'bold' },
  scoreMax: { color: '#888', fontSize: '24px' },
  scoreLabel: { color: '#888' },
  answersSection: { marginBottom: '32px' },
  sectionTitle: { color: '#ffffff', marginBottom: '16px' },
  answerCard: { backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '24px', border: '1px solid #333', marginBottom: '16px' },
  questionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  questionNumber: { color: '#6366f1', fontWeight: 'bold' },
  scoreBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' },
  question: { color: '#ffffff', marginBottom: '16px', lineHeight: '1.6' },
  section: { marginBottom: '12px' },
  sectionLabel: { color: '#888', fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' },
  answerText: { color: '#cccccc', lineHeight: '1.6' },
  feedbackText: { color: '#cccccc', lineHeight: '1.6' },
  strengthSection: { backgroundColor: '#22c55e11', borderRadius: '8px', padding: '12px', marginBottom: '8px' },
  strengthLabel: { color: '#22c55e', fontSize: '12px', marginBottom: '4px' },
  strengthText: { color: '#cccccc', fontSize: '14px' },
  weaknessSection: { backgroundColor: '#ef444411', borderRadius: '8px', padding: '12px' },
  weaknessLabel: { color: '#ef4444', fontSize: '12px', marginBottom: '4px' },
  weaknessText: { color: '#cccccc', fontSize: '14px' },
  newInterviewBtn: { width: '100%', padding: '14px', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
};

export default Results;