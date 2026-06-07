import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/LoginPageCSS';

const LoginPage = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            login(data.user, data.token);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container bg-dot-grid">
            {/* Glowing blur background shapes */}
            <div className="glow-orb" style={styles.glowOrbLeft} />
            <div className="glow-orb" style={styles.glowOrbRight} />

            {/* Glass Login Card */}
            <div className="auth-card glass-card">
                <div className="auth-back-btn">
                    <button onClick={() => navigate('/')} className="btn-outline" style={styles.backBtn}>
                        ← Back to Home
                    </button>
                </div>
                <div className="auth-brand" onClick={() => navigate('/')}>
                    <div style={styles.brandIconBox}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.657 16.657L13.414 20.9M9.879 17.364l-4.243-4.243m12.021-3.535A8 8 0 114 12a8.001 8.001 0 0113.657-5.657l-1.414 1.414" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span style={styles.brandText}>Amber Insight</span>
                </div>
                <h2 className="auth-subtitle">Log Into Your Ecosystem</h2>

                {error && <div className="auth-error-box">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="auth-input-group">
                        <label className="auth-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="auth-input"
                            required
                            placeholder="username@email.com"
                        />
                    </div>

                    <div className="auth-input-group">
                        <label className="auth-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="auth-input"
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn-premium auth-submit-btn">
                        {loading ? 'Authenticating...' : 'Log In'}
                    </button>
                </form>

                <p className="auth-footer-text">
                    New to the platform? <Link to="/signup" className="auth-link">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;