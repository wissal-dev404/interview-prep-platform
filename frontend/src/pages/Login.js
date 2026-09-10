import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back 👋</h1>
        <p style={styles.subtitle}>Login to continue your interview prep</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.link}>
          Don't have an account? <Link to="/register" style={styles.linkText}>Register</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '40px',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #333',
  },
  title: {
    color: '#ffffff',
    fontSize: '24px',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#888',
    marginBottom: '24px',
  },
  error: {
    color: '#ff4444',
    backgroundColor: '#ff444422',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  label: {
    color: '#888',
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#6366f1',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  link: {
    color: '#888',
    textAlign: 'center',
    marginTop: '24px',
  },
  linkText: {
    color: '#6366f1',
  }
};

export default Login;