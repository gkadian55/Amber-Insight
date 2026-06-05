import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import our custom context hook

const LoginPage = () => {
    const { login } = useAuth(); // 🟢 Extract the unified context state updater
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

            // 🟢 FIXED: Fire the global auth context login handler. 
            login(data.user, data.token);

            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>

            {/* ⬅️ SLEEK INLINE BACK BUTTON */}
            <div style={styles.backNavContainer}>
                <button onClick={() => navigate('/')} style={styles.inlineBackButton}>
                    ← Back to Home
                </button>
            </div>

            <div style={styles.card}>
                <h1 style={styles.brand}>AMBER INSIGHT</h1>
                <h2 style={styles.subtitle}>Log into your ecosystem</h2>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
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
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={loading} style={styles.button}>
                        {loading ? 'Authenticating...' : 'Log In'}
                    </button>
                </form>

                <p style={styles.footerText}>
                    New to the platform? <Link to="/signup" style={styles.link}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

// Layout style tokens
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column', // Stack navigation container over the form card
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0d0e12',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    backNavContainer: {
        width: '100%',
        maxWidth: '440px', // Adjusted to match larger card width
        display: 'flex',
        justifyContent: 'flex-start',
        marginBottom: '14px',
        padding: '0 4px',
        boxSizing: 'border-box'
    },
    inlineBackButton: {
        background: 'none',
        border: 'none',
        color: '#94a3b8',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '6px 0',
        transition: 'color 0.2s ease',
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        padding: '44px',
        backgroundColor: '#161822',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
        textAlign: 'center',
        border: '1px solid #242736',
        boxSizing: 'border-box'
    },
    brand: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#ffb300',
        letterSpacing: '2px',
        margin: '0 0 10px 0',
    },
    subtitle: {
        fontSize: '16px',
        color: '#94a3b8',
        margin: '0 0 34px 0',
        fontWeight: '400',
    },
    form: {
        textAlign: 'left',
    },
    inputGroup: {
        marginBottom: '22px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '600',
        color: '#94a3b8',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    input: {
        width: '100%',
        padding: '14px 18px',
        backgroundColor: '#0d0e12',
        border: '1px solid #242736',
        borderRadius: '6px',
        color: '#ffffff',
        fontSize: '17px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    button: {
        width: '100%',
        padding: '16px',
        backgroundColor: '#ffb300',
        border: 'none',
        borderRadius: '6px',
        color: '#0d0e12',
        fontSize: '18px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '12px',
    },
    errorBox: {
        padding: '14px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        borderRadius: '6px',
        color: '#ef4444',
        fontSize: '16px',
        marginBottom: '22px',
        textAlign: 'left',
    },
    footerText: {
        color: '#94a3b8',
        fontSize: '16px',
        marginTop: '26px',
        marginBottom: '0',
    },
    link: {
        color: '#ffb300',
        textDecoration: 'none',
        fontWeight: '600',
    }
};

export default LoginPage;