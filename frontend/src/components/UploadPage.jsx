import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styles } from '../styles/UploadPageCSS';

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

export default UploadPage;