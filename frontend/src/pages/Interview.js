import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Interview() {
  const [jobRole, setJobRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [interviewId, setInterviewId] = useState(null);
  const [phase, setPhase] = useState('setup'); // setup, interview, done
  const navigate = useNavigate();

  const jobRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Analyst',
    'Data Scientist',
    'DevOps Engineer',
    'UI/UX Designer',
  ];

  const generateInterview = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/interview/generate',
        { jobRole, cvText: '' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestions(response.data.interview.questions);
      setInterviewId(response.data.interview.id);
      setPhase('interview');
    } catch (err) {
      alert('Error generating questions. Make sure backend is running!');
    }
    setLoading(false);
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/feedback/submit',
        {
          interviewId,
          question: questions[currentQuestion],
          answer
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
      } else {
        setPhase('done');
      }
    } catch (err) {
      alert('Error submitting answer!');
    }
    setSubmitting(false);
  };

  if (phase === 'done') {
    return (
      <div style={styles.container}>
        <div style={styles.doneCard}>
          <h1 style={styles.doneTitle}>Interview Complete! 🎉</h1>
          <p style={styles.doneSubtitle}>Great job! Your answers have been evaluated.</p>
          <button style={styles.primaryBtn}
            onClick={() => navigate(`/results/${interviewId}`)}>
            See My Results
          </button>
          <button style={styles.secondaryBtn}
            onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'interview') {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            ← Dashboard
          </button>
          <span style={styles.progress}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>

        <div style={styles.interviewCard}>
          <div style={styles.progressBar}>
            <div style={{
              ...styles.progressFill,
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }} />
          </div>

          <h2 style={styles.question}>{questions[currentQuestion]}</h2>

          <textarea
            style={styles.textarea}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
          />

          <button
            style={styles.primaryBtn}
            onClick={submitAnswer}
            disabled={submitting || !answer.trim()}
          >
            {submitting ? 'Evaluating...' :
              currentQuestion < questions.length - 1 ? 'Next Question →' : 'Finish Interview ✓'}
          </button>
        </div>
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

      <div style={styles.setupCard}>
        <h1 style={styles.title}>Start New Interview 🚀</h1>
        <p style={styles.subtitle}>Select your job role to get personalized questions</p>

        <div style={styles.rolesGrid}>
          {jobRoles.map((role) => (
            <button
              key={role}
              style={{
                ...styles.roleBtn,
                ...(jobRole === role ? styles.roleBtnActive : {})
              }}
              onClick={() => setJobRole(role)}
            >
              {role}
            </button>
          ))}
        </div>

        <button
          style={{
            ...styles.primaryBtn,
            opacity: !jobRole ? 0.5 : 1
          }}
          onClick={generateInterview}
          disabled={!jobRole || loading}
        >
          {loading ? 'Generating Questions...' : 'Generate Interview Questions'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a', padding: '20px' },
  header: { maxWidth: '800px', margin: '0 auto 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { backgroundColor: 'transparent', border: '1px solid #333', color: '#888', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' },
  progress: { color: '#888' },
  setupCard: { maxWidth: '800px', margin: '0 auto', backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '40px', border: '1px solid #333' },
  title: { color: '#ffffff', fontSize: '28px', marginBottom: '8px' },
  subtitle: { color: '#888', marginBottom: '32px' },
  rolesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '32px' },
  roleBtn: { padding: '12px', backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#888', cursor: 'pointer', fontSize: '14px' },
  roleBtnActive: { backgroundColor: '#6366f122', border: '1px solid #6366f1', color: '#6366f1' },
  primaryBtn: { width: '100%', padding: '14px', backgroundColor: '#6366f1', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', marginBottom: '12px' },
  secondaryBtn: { width: '100%', padding: '14px', backgroundColor: 'transparent', color: '#888', border: '1px solid #333', borderRadius: '8px', fontSize: '16px', cursor: 'pointer' },
  interviewCard: { maxWidth: '800px', margin: '0 auto', backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '40px', border: '1px solid #333' },
  progressBar: { height: '4px', backgroundColor: '#333', borderRadius: '2px', marginBottom: '32px' },
  progressFill: { height: '100%', backgroundColor: '#6366f1', borderRadius: '2px', transition: 'width 0.3s' },
  question: { color: '#ffffff', fontSize: '20px', marginBottom: '24px', lineHeight: '1.6' },
  textarea: { width: '100%', padding: '16px', backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '8px', color: '#ffffff', fontSize: '16px', resize: 'vertical', boxSizing: 'border-box', marginBottom: '16px' },
  doneCard: { maxWidth: '500px', margin: '100px auto', backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '40px', border: '1px solid #333', textAlign: 'center' },
  doneTitle: { color: '#ffffff', fontSize: '28px', marginBottom: '8px' },
  doneSubtitle: { color: '#888', marginBottom: '32px' },
};

export default Interview;