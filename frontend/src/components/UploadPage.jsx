import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { styles, getUploadBtnStyle } from '../styles/UploadPageCSS';
import { API_BASE_URL } from '../config';

const UploadPage = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [showSavedSidebar, setShowSavedSidebar] = useState(false);
    const [savedDocs, setSavedDocs] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

    const triggerToast = (message, type = 'error') => {
        setToast({ show: true, message, type });
    };

    React.useEffect(() => {
        if (!toast.show) return;
        const timer = setTimeout(() => {
            setToast(prev => ({ ...prev, show: false }));
        }, 6000);
        return () => clearTimeout(timer);
    }, [toast.show, toast.message]);

    React.useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('token');
            const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
            fetch(`${API_BASE_URL}/api/documents`, { headers })
                .then(res => res.json())
                .then(data => { if (Array.isArray(data)) setSavedDocs(data); })
                .catch(err => console.error("Error fetching documents:", err));
        }
    }, [isAuthenticated]);

    const handleUploadFile = async (selectedFile) => {
        if (!selectedFile) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const token = localStorage.getItem('token');
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
                method: 'POST',
                headers: headers,
                body: formData
            });

            const data = await response.json();
            if (response.ok && data.documentId) {
                navigate(`/results/${data.documentId}`);
            } else {
                triggerToast(data.error || "Failed to process the document.");
            }
        } catch (err) {
            console.error("Upload error:", err);
            triggerToast("An error occurred during file upload. Please check your backend.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleUploadFile(e.target.files[0]);
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current.click();
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUploadFile(e.dataTransfer.files[0]);
        }
    };

    return (
        <div style={styles.pageWrapper} className="bg-dot-grid">
            <div className="glow-orb" style={styles.glowOrbTop} />
            <div className="glow-orb" style={styles.glowOrbBottom} />

            {/* Navigation Header */}
            <header style={styles.header} className="upload-header">
                <div style={styles.logoLink} className="logo-link" onClick={() => navigate('/')}>
                    <div style={styles.logoIconBox}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.657 16.657L13.414 20.9M9.879 17.364l-4.243-4.243m12.021-3.535A8 8 0 114 12a8.001 8.001 0 0113.657-5.657l-1.414 1.414" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 8c.5 1.5 1.5 2.5 3 3-1.5.5-2.5 1.5-3 3-.5-1.5-1.5-2.5-3-3 1.5-.5 2.5-1.5 3-3z" fill="white" />
                        </svg>
                    </div>
                    <span style={styles.logoText}>Amber Insight</span>
                </div>

                <div>
                    {isAuthenticated ? (
                        <div style={styles.navAuthRow}>
                            <button onClick={() => setShowSavedSidebar(true)} className="btn-outline" style={styles.navDashboardBtn}>Dashboard</button>
                            <button
                                onClick={logout}
                                className="btn-outline"
                                style={styles.navLogoutBtn}
                                onMouseOver={(e) => { e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'; }}
                                onMouseOut={(e) => { e.target.style.backgroundColor = 'transparent'; }}
                            >Log Out</button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className="btn-outline" style={styles.navSignInBtn}>Sign in</button>
                    )}
                </div>
            </header>

            {/* MainContainer */}
            <main style={styles.mainHero} className="main-hero">

                {/* LEFT DECK */}
                <div style={styles.mockupDeck} className="mockup-deck">
                    <div style={styles.mockupGlow} />

                    <div className="animate-float-1 mockup-card mockup-card-1" style={{ ...styles.floatCard, ...styles.floatCard1 }}>
                        <div style={styles.floatCardHeader}>
                            <div style={styles.fileIconPdf}>PDF</div>
                            <div>
                                <div style={styles.floatCardFileName} className="mockup-card-filename">Q4 Financial Report.pdf</div>
                                <div style={styles.floatCardFileMeta} className="mockup-card-filemeta">1.2 MB • 24 pages</div>
                            </div>
                        </div>
                        <div style={styles.floatCardLines}>
                            <div style={styles.linePdf1} />
                            <div style={styles.linePdf2} />
                            <div style={styles.linePdf3} />
                        </div>
                    </div>

                    <div style={{ ...styles.floatCard, ...styles.floatCard2 }} className="animate-float-2 mockup-card mockup-card-2">
                        <div style={styles.floatCardHeader}>
                            <div style={styles.fileIconDocx}>W</div>
                            <div>
                                <div style={styles.floatCardFileName} className="mockup-card-filename">Product Strategy.docx</div>
                                <div style={styles.floatCardFileMeta} className="mockup-card-filemeta">860 KB • 18 pages</div>
                            </div>
                        </div>
                        <div style={styles.floatCardLines}>
                            <div style={styles.lineDocx1} />
                            <div style={styles.lineDocx2} />
                        </div>
                    </div>

                    <div style={{ ...styles.floatCard, ...styles.floatCard3 }} className="animate-float-3 mockup-card mockup-card-3">
                        <div style={styles.floatCardHeader}>
                            <div style={styles.fileIconPptx}>P</div>
                            <div>
                                <div style={styles.floatCardFileName} className="mockup-card-filename">Market Analysis.pptx</div>
                                <div style={styles.floatCardFileMeta} className="mockup-card-filemeta">2.1 MB • 32 slides</div>
                            </div>
                        </div>
                        <div style={styles.pptxChartRow}>
                            <div style={styles.pptxDonut} />
                            <div style={styles.pptxLinesWrap}>
                                <div style={styles.linePptx1} />
                                <div style={styles.linePptx2} />
                            </div>
                        </div>
                    </div>

                    <div style={styles.summaryCard} className="animate-float-2 mockup-card mockup-summary-card">
                        <div style={styles.summaryCardHeader}>
                            <span style={{ fontSize: '16px' }}>✨</span>
                            <span style={styles.summaryCardTitle} className="mockup-summary-title">Summary</span>
                        </div>
                        <div style={styles.summaryLines}>
                            <div style={styles.summaryLineHighlight} />
                            <div style={styles.summaryLine1} />
                            <div style={styles.summaryLine2} />
                            <div style={styles.summaryLine3} />
                        </div>
                        <div style={styles.summaryTagsRow}>
                            <span style={styles.tagKeyTakeaways}>Key takeaways</span>
                            <span style={styles.tagRisks}>Risks</span>
                            <span style={styles.tagOpportunities}>Opportunities</span>
                        </div>
                    </div>

                    <div style={styles.chatCard} className="animate-float-3 mockup-card mockup-chat-card">
                        <div style={styles.chatUserTurn}>
                            <div style={styles.chatUserBubble}>
                                What were the main revenue drivers?
                            </div>
                            <div style={styles.chatAvatar}>👤</div>
                        </div>

                        <div style={styles.chatAiTurn}>
                            <div style={styles.chatAiAvatar}>🔥</div>
                            <div style={styles.chatAiBubble}>
                                The main revenue drivers were strong subscription growth and expansion in enterprise accounts.
                                <div style={styles.chatCitations} className="mockup-chat-citations">
                                    <span style={styles.chatCitation} className="mockup-chat-citation">
                                        <span style={{ color: 'var(--color-pdf)' }}>📄</span> Q4 Report p.7
                                    </span>
                                    <span style={styles.chatCitation} className="mockup-chat-citation">
                                        <span style={{ color: 'var(--color-docx)' }}>📄</span> Product Strategy p.14
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.chatInput}>
                            <span style={styles.chatInputPlaceholder}>Ask a follow-up...</span>
                            <span style={styles.chatInputSend}>➔</span>
                        </div>
                    </div>
                </div>


                {/* RIGHT DECK */}
                <div style={styles.heroTextCol} className="hero-text-col">

                    {isAuthenticated && user?.name && (
                        <p style={styles.greetingText}>
                            Hey, <span style={styles.greetingNameGradient}>{user.name}</span> 👋
                        </p>
                    )}

                    <h1 style={styles.heroH1} className="hero-h1">
                        Summarize anything. <br />
                        <span style={styles.heroH1Gradient}>Chat with it.</span>
                    </h1>

                    <p style={styles.heroSubtitle} className="hero-subtitle">
                        Upload a document, get instant insights, and have smart conversations grounded in your content.
                    </p>

                    <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        onClick={triggerFileSelect}
                        style={styles.uploadZoneWrapper}
                        className="upload-zone-wrapper"
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg"
                            style={styles.fileInputHidden}
                        />

                        <div className="btn-premium" style={getUploadBtnStyle(dragActive)}>
                            <span style={styles.fireIconSpan} className="animate-fire">🔥</span>
                            <span>Upload Document</span>
                        </div>
                    </div>

                    <div style={styles.checkmarksRow} className="checkmarks-row">
                        <span style={styles.checkItem}>
                            <span style={styles.checkTick}>✓</span> PDF, PPTX, Images
                        </span>
                        <span style={styles.checkItem}>
                            <span style={styles.checkTick}>✓</span> Secure &amp; Private
                        </span>
                        <span style={styles.checkItem}>
                            <span style={styles.checkTick}>✓</span> Contextual
                        </span>
                    </div>
                </div>
            </main>

            {/* Feature Cards */}
            <section id="features" style={styles.featuresSection} className="features-section">
                <div style={styles.featuresGrid} className="features-grid">

                    <div className="premium-card" style={styles.featureCard}>
                        <div style={styles.featureIcon}>⚡</div>
                        <h3 style={styles.featureTitle}>Instant Summaries</h3>
                        <p style={styles.featureDesc}>
                            Get concise, accurate summaries in seconds. Extract key points, actions, and insights effortlessly.
                        </p>
                    </div>

                    <div className="premium-card" style={styles.featureCard}>
                        <div style={styles.featureIcon}>🕒</div>
                        <h3 style={styles.featureTitle}>Document History</h3>
                        <p style={styles.featureDesc}>
                            Revisit your past uploads and summaries. Everything is saved, organized, and easy to find.
                        </p>
                    </div>

                    <div className="premium-card" style={styles.featureCard}>
                        <div style={styles.featureIcon}>💬</div>
                        <h3 style={styles.featureTitle}>Contextual Chat</h3>
                        <p style={styles.featureDesc}>
                            Ask questions, get answers, and dive deeper—grounded in your documents with citations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.footerInner}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'var(--color-text-muted)' }}>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>AMBER INSIGHT 2.6.0</span>
                </div>
            </footer>

            {loading && (
                <div style={styles.loadingOverlay}>
                    <div style={styles.loadingSpinnerWrap}>
                        <div style={styles.loadingRing} />
                        <svg className="animate-fire" width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1.5-3-1 1-2 2.18-2 3.5a2.5 2.5 0 001 2z" fill="var(--amber-orange)" />
                            <path d="M17.66 9.53a9 9 0 01-5.66 11.13c-4.42 1.34-9.1-1.12-10.43-5.54A9 9 0 0110.15 3.32c.3-.09.61.1.61.41a6.6 6.6 0 001.32 3.91 3.5 3.5 0 012.75 1.57c.56.76.88 1.66.88 2.59 0 .23-.17.43-.4.43h-.01c-.24 0-.44-.2-.43-.44a3.1 3.1 0 00-.54-1.74A4.5 4.5 0 0011.66 8.5c-.32.06-.52-.3-.32-.57a7.02 7.02 0 013.9-2.73c.3-.08.57.17.47.46a5.55 5.55 0 002.95 3.87z" fill="var(--amber-orange)" />
                        </svg>
                    </div>
                    <div style={styles.loadingTextWrap}>
                        <h2 style={styles.loadingTitle}>Analyzing Document...</h2>
                        <p style={styles.loadingSubtitle}>Amber is extracting summaries and topics grounding analysis.</p>
                    </div>
                </div>
            )}

            {/* Sidebar backdrop overlay */}
            {showSavedSidebar && (
                <div
                    onClick={() => setShowSavedSidebar(false)}
                    style={styles.sidebarBackdrop}
                />
            )}

            {/* Slide-out Saved Files Sidebar */}
            {showSavedSidebar && (
                <div style={styles.savedSidebarPanel} className="saved-sidebar-panel">
                    <div style={styles.savedSidebarHeader}>
                        <span style={styles.savedSidebarTitle}>Saved Summaries</span>
                        <button
                            onClick={() => setShowSavedSidebar(false)}
                            style={styles.savedSidebarClose}
                            onMouseOver={(e) => e.target.style.color = 'var(--color-text-dark)'}
                            onMouseOut={(e) => e.target.style.color = 'var(--color-text-muted)'}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={styles.savedSidebarList} className="no-scrollbar">
                        {savedDocs.length === 0 ? (
                            <div style={styles.savedSidebarEmpty}>
                                No documents summarized yet. Upload a document to begin!
                            </div>
                        ) : (
                            savedDocs.map(doc => {
                                const ext = doc.fileName.split('.').pop().toLowerCase();
                                let fileIcon = '📄';
                                let iconBg = '#4b5563';
                                if (ext === 'pdf') { fileIcon = 'PDF'; iconBg = '#ef4444'; }
                                else if (['docx', 'doc'].includes(ext)) { fileIcon = 'W'; iconBg = '#2563eb'; }
                                else if (['pptx', 'ppt'].includes(ext)) { fileIcon = 'P'; iconBg = '#ea580c'; }

                                return (
                                    <div
                                        key={doc._id}
                                        onClick={() => navigate(`/results/${doc._id}`)}
                                        style={styles.savedDocCard}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--amber-orange)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.borderColor = 'var(--color-border)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div style={{ ...styles.savedDocIconBase, backgroundColor: iconBg }}>
                                            {fileIcon}
                                        </div>
                                        <div style={styles.savedDocInfo}>
                                            <div style={styles.savedDocName}>{doc.fileName}</div>
                                            <div style={styles.savedDocDate}>
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}

            {/* Notification System */}
            {toast.show && (
                <div className="toast-container">
                    <div className={`toast-card ${toast.type}`}>
                        <div className="toast-icon-box">
                            {toast.type === 'error' && '⚠️'}
                            {toast.type === 'warning' && '⚡'}
                            {toast.type === 'success' && '✓'}
                        </div>
                        <div className="toast-content">
                            <h4 className="toast-title">
                                {toast.type === 'error' && 'System Error'}
                                {toast.type === 'warning' && 'Warning'}
                                {toast.type === 'success' && 'Success'}
                            </h4>
                            <p className="toast-message">{toast.message}</p>
                        </div>
                        <button className="toast-close-btn" onClick={() => setToast({ ...toast, show: false })}>✕</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadPage;