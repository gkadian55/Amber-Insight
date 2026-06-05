import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import our new identity hook

const UploadPage = () => {
    const { user, token, isAuthenticated, logout } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    // Fetch user-specific logs automatically if they are logged in
    useEffect(() => {
        if (isAuthenticated) {
            fetch('http://localhost:5000/api/documents', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => res.json())
                .then(data => { if (Array.isArray(data)) setHistory(data); })
                .catch(err => console.error("History retrieval error:", err));
        }
    }, [isAuthenticated, token]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const headers = {};
            if (isAuthenticated) {
                headers['Authorization'] = `Bearer ${token}`; // Inject security context token dynamically
            }

            const response = await fetch('http://localhost:5000/api/documents/upload', {
                method: 'POST',
                headers: headers,
                body: formData
            });

            const data = await response.json();
            if (response.ok && data.documentId) {
                navigate(`/results/${data.documentId}`);
            } else {
                alert(data.error || "Processing failed");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.widescreenContainer}>
            {/* 🟢 SIDEBAR: Only displays for logged-in user accounts */}
            {isAuthenticated && (
                <div style={styles.sidebar}>
                    <h3 style={styles.sidebarTitle}>Analysis Archives</h3>
                    <div style={styles.historyList} className="no-scrollbar">
                        {history.length === 0 ? (
                            <p style={styles.emptyText}>No previous scans logged yet.</p>
                        ) : (
                            history.map(doc => (
                                <div
                                    key={doc._id}
                                    onClick={() => navigate(`/results/${doc._id}`)}
                                    style={styles.historyItem}
                                >
                                    📄 {doc.fileName.length > 22 ? `${doc.fileName.substring(0, 22)}...` : doc.fileName}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* MAIN CONTENT REGION */}
            <div style={styles.mainContent}>
                {/* 🛡️ STATE BANNER CONTROL DECK */}
                <div style={styles.authBanner}>
                    {isAuthenticated ? (
                        <>
                            <span style={styles.welcomeMessage}>⚡ Active Space: <strong style={{ color: '#ffb300', fontWeight: '800' }}>{user?.name}</strong></span>
                            <button onClick={logout} style={styles.secondaryBtn}>Log Out</button>
                        </>
                    ) : (
                        <>
                            <span style={styles.guestNotice}>🌐 Public Mode: Scans won't be saved to a history profile.</span>
                            <div>
                                <button onClick={() => navigate('/login')} style={styles.authBtn}>Log In</button>
                                <button onClick={() => navigate('/signup')} style={styles.authBtnPrimary}>Sign Up</button>
                            </div>
                        </>
                    )}
                </div>

                {/* THE CORE DROP ZONE ARCHITECTURE */}
                <div style={styles.uploaderCenter}>
                    <h1 style={styles.titleHead}>AMBER INSIGHT</h1>
                    <p style={styles.tagline}>Drop any PDF or Image layout here for direct Gemini Multimodal Analysis</p>

                    <form onSubmit={handleUpload} style={styles.uploadForm}>
                        <input type="file" onChange={handleFileChange} accept=".pdf,.png,.jpg,.jpeg,.txt" style={styles.fileInput} id="fileDrop" />
                        <label htmlFor="fileDrop" style={styles.dropZone}>
                            {file ? `Selected: ${file.name}` : "Click to select or drop an asset file"}
                        </label>
                        <button type="submit" disabled={!file || loading} style={styles.submitBtn}>
                            {loading ? "Parsing Layout & Querying Gemini Core..." : "Begin Deep Analysis"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// Fluid, Edge-to-Edge Widescreen Styling Sheet
const styles = {
    widescreenContainer: {
        display: 'flex',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0d0e12',
        color: '#ffffff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        overflow: 'hidden'
    },
    sidebar: {
        width: '320px',
        height: '100%',
        backgroundColor: '#161822',
        borderRight: '1px solid #242736',
        padding: '28px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column'
    },
    sidebarTitle: {
        fontSize: '20px',
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        color: '#ffffff',
        marginBottom: '24px'
    },
    historyList: {
        flex: 1,
        overflowY: 'auto'
    },
    historyItem: {
        padding: '14px 16px',
        backgroundColor: '#0d0e12',
        border: '1px solid #242736',
        borderRadius: '8px',
        marginBottom: '12px',
        cursor: 'pointer',
        fontSize: '16px',
        color: '#e2e8f0',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    emptyText: { color: '#64748b', fontSize: '16px' },
    mainContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    },
    authBanner: {
        display: 'flex',
        alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid #242736',
        backgroundColor: '#161822',
        justifyContent: 'space-between'
    },
    guestNotice: { color: '#cbd5e1', fontSize: '20px', fontWeight: '500' },
    welcomeMessage: { color: '#ffffff', fontSize: '20px', fontWeight: '500' },
    authBtn: {
        backgroundColor: 'transparent',
        border: 'none',
        color: '#ffffff',
        marginRight: '15px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '16px'
    },
    authBtnPrimary: {
        backgroundColor: '#ffb300',
        border: 'none',
        color: '#0d0e12',
        padding: '10px 20px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '16px'
    },
    secondaryBtn: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid #ef4444',
        color: '#ef4444',
        padding: '8px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '15px'
    },
    uploaderCenter: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px'
    },
    titleHead: { fontSize: '38px', fontWeight: '800', letterSpacing: '3px', color: '#ffb300', margin: '0 0 10px 0' },
    tagline: { color: '#94a3b8', fontSize: '17px', margin: '0 0 45px 0', textAlign: 'center' },
    uploadForm: { width: '100%', maxWidth: '550px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
    fileInput: { display: 'none' },
    dropZone: {
        width: '100%',
        height: '220px',
        border: '2px dashed #242736',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#94a3b8',
        cursor: 'pointer',
        boxSizing: 'border-box',
        padding: '24px',
        textAlign: 'center',
        marginBottom: '28px',
        fontSize: '17px'
    },
    submitBtn: {
        width: '100%',
        padding: '16px',
        backgroundColor: '#ffb300',
        color: '#0d0e12',
        border: 'none',
        borderRadius: '6px',
        fontWeight: '700',
        fontSize: '18px',
        cursor: 'pointer'
    }
};

export default UploadPage;