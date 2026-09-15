import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
    fetchInterviews(token);
  }, []);

  const fetchInterviews = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/history/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviews(response.data.interviews);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Calculate statistics
  const totalInterviews = interviews.length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>Interview Prep 🚀</h1>
        <div style={styles.headerRight}>
          <span style={styles.username}>👋 {user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.main}>
        {/* Stats Section */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>{totalInterviews}</h2>
            <p style={styles.statLabel}>Total Interviews</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>5</h2>
            <p style={styles.statLabel}>Questions Per Interview</p>
          </div>
          <div style={styles.statCard}>
            <h2 style={styles.statNumber}>{totalInterviews * 5}</h2>
            <p style={styles.statLabel}>Total Questions Answered</p>
          </div>
        </div>

        {/* Hero Section */}
        <div style={styles.hero}>
          <h2 style={styles.heroTitle}>Ready to practice? 💪</h2>
          <p style={styles.heroSubtitle}>Generate AI-powered interview questions for your dream job</p>
          <button style={styles.startBtn} onClick={() => navigate('/interview')}>
            Start New Interview
          </button>
        </div>

        {/* History Section */}
        <div style={styles.historySection}>
          <h3 style={styles.sectionTitle}>Your Interview History</h3>
          {loading ? (
            <p style={styles.loading}>Loading...</p>
          ) : interviews.length === 0 ? (
            <p style={styles.empty}>No interviews yet. Start your first one! 🎯</p>
          ) : (
            interviews.map((interview) => (
              <div key={interview.id} style={styles.card}
                onClick={() => navigate(`/results/${interview.id}`)}>
                <div style={styles.cardLeft}>
                  <h4 style={styles.jobRole}>{interview.job_role}</h4>
                  <p style={styles.date}>
                    {new Date(interview.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span style={styles.arrow}>→</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#0a0a0a' },
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', padding: '20px 40px',
    borderBottom: '1px solid #333', backgroundColor: '#1a1a1a'
  },
  logo: { color: '#ffffff', fontSize: '20px', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  username: { color: '#888' },
  logoutBtn: {
    padding: '8px 16px', backgroundColor: 'transparent',
    border: '1px solid #333', borderRadius: '8px',
    color: '#888', cursor: 'pointer'
  },
  main: { maxWidth: '800px', margin: '0 auto', padding: '40px 20px' },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px', marginBottom: '32px'
  },
  statCard: {
    backgroundColor: '#1a1a1a', borderRadius: '12px',
    padding: '24px', border: '1px solid #333', textAlign: 'center'
  },
  statNumber: { color: '#6366f1', fontSize: '36px', margin: '0 0 8px 0' },
  statLabel: { color: '#888', margin: 0, fontSize: '14px' },
  hero: {
    backgroundColor: '#1a1a1a', borderRadius: '12px',
    padding: '40px', textAlign: 'center',
    border: '1px solid #333', marginBottom: '32px'
  },
  heroTitle: { color: '#ffffff', fontSize: '28px', marginBottom: '8px' },
  heroSubtitle: { color: '#888', marginBottom: '24px' },
  startBtn: {
    padding: '12px 32px', backgroundColor: '#6366f1',
    color: '#ffffff', border: 'none', borderRadius: '8px',
    fontSize: '16px', cursor: 'pointer'
  },
  historySection: { marginTop: '20px' },
  sectionTitle: { color: '#ffffff', marginBottom: '16px' },
  loading: { color: '#888' },
  empty: { color: '#888', textAlign: 'center', padding: '40px' },
  card: {
    backgroundColor: '#1a1a1a', borderRadius: '12px',
    padding: '20px', marginBottom: '12px',
    border: '1px solid #333', cursor: 'pointer',
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardLeft: {},
  jobRole: { color: '#ffffff', margin: '0 0 4px 0' },
  date: { color: '#888', margin: 0, fontSize: '14px' },
  arrow: { color: '#6366f1', fontSize: '20px' }
};

export default Dashboard;