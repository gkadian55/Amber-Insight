import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import our custom context hook

const SignupPage = () => {
    const { login } = useAuth(); // 🟢 Extract the unified context state updater
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // 🟢 FIXED: Swap raw localStorage setItem commands for the context engine.
            // This syncs memory structures and triggers layout mutations instantly.
            login(data.user, data.token);

            // Redirect straight back to dashboard landing pad
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.brand}>AMBER INSIGHT</h1>
                <h2 style={styles.subtitle}>Create your analytical profile</h2>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                            placeholder="John Doe"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                            placeholder="name@company.com"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            required
                            minLength="6"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Registering Account...' : 'Sign Up'}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Already have an account? <Link to="/login" style={styles.link}>Log In</Link>
                </p>
            </div>
        </div>
    );
};

// Clean styling object matching your fluid core setup
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0d0e12',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    card: {
        width: '100%',
        maxWidth: '420px',
        padding: '40px',
        backgroundColor: '#161822',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        textAlign: 'center',
        border: '1px solid #242736',
    },
    brand: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#ffb300',
        letterSpacing: '2px',
        margin: '0 0 8px 0',
    },
    subtitle: {
        fontSize: '14px',
        color: '#94a3b8',
        margin: '0 0 32px 0',
        fontWeight: '400',
    },
    form: {
        textAlign: 'left',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontSize: '12px',
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: '6px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    input: {
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#0d0e12',
        border: '1px solid #242736',
        borderRadius: '6px',
        color: '#ffffff',
        fontSize: '15px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease',
    },
    button: {
        width: '100%',
        padding: '14px',
        backgroundColor: '#ffb300',
        border: 'none',
        borderRadius: '6px',
        color: '#0d0e12',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'opacity 0.2s ease',
    },
    errorBox: {
        padding: '12px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        borderRadius: '6px',
        color: '#ef4444',
        fontSize: '14px',
        marginBottom: '20px',
        textAlign: 'left',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: '14px',
        marginTop: '24px',
        marginBottom: '0',
    },
    link: {
        color: '#ffb300',
        textDecoration: 'none',
        fontWeight: '600',
    }
};

export default SignupPage;