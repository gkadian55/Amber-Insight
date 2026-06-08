import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { styles, getDocIconStyle } from '../styles/ResultsPageCSS';

const ResultsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const chatContainerRef = useRef(null);

    // Clipboard state
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);

    // Document and library lists states
    const [documentsList, setDocumentsList] = useState([]);
    const [activeDocument, setActiveDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Sidebar Filters
    const [searchQuery, setSearchQuery] = useState('');

    // Middle column Tab Pane State
    const [activeContentTab, setActiveContentTab] = useState('Summary');

    // Chat States
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    // Fetch documents list from the database for the current user
    const fetchDocuments = async (activeIdToLoad) => {
        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const response = await axios.get('http://localhost:5000/api/documents', config);
            const dbDocs = (response.data || []).map(doc => ({
                ...doc,
                chatHistory: doc.chatHistory || []
            }));

            setDocumentsList(dbDocs);

            const targetId = activeIdToLoad || id;
            let targetedDoc = null;

            if (targetId && targetId !== 'list') {
                targetedDoc = dbDocs.find(doc => doc._id === targetId);
            }

            // Default to the first document if no specific target
            if (!targetedDoc && dbDocs.length > 0) {
                targetedDoc = dbDocs[0];
            }

            if (targetedDoc) {
                loadDocument(targetedDoc);
            }
        } catch (err) {
            console.error('Failed to load documents:', err);
            setDocumentsList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [id]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    const loadDocument = (doc) => {
        setActiveDocument(doc);

        if (doc.chatHistory && doc.chatHistory.length > 0) {
            setMessages(doc.chatHistory);
        } else {
            setMessages([
                {
                    sender: 'ai',
                    text: `👋 Intelligence stream synchronized. I have fully indexed **${doc.fileName}**. Ask me any clarifying questions or target metrics you'd like extracted!`
                }
            ]);
        }

        setUserInput('');
        setActiveContentTab('Summary');
    };

    const handleSelectDocument = (doc) => {
        navigate(`/results/${doc._id}`);
    };

    const filteredDocs = documentsList.filter(doc =>
        doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // File icon helper based on file extension
    const getFileIconProps = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();
        if (ext === 'pdf') return { text: 'PDF', bg: '#ef4444' };
        if (['docx', 'doc'].includes(ext)) return { text: 'W', bg: '#2563eb' };
        if (['pptx', 'ppt'].includes(ext)) return { text: 'P', bg: '#ea580c' };
        return { text: 'IMG', bg: '#4b5563' };
    };

    // Date/Time Formatter
    const formatRelativeTime = (isoString) => {
        if (!isoString) return 'summarized recently';
        const date = new Date(isoString);
        const diffMs = Date.now() - date.getTime();
        const diffMins = Math.floor(diffMs / (60 * 1000));

        if (diffMins < 60) return `Summarized ${diffMins}m ago`;

        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `Summarized ${diffHours}h ago`;

        if (diffHours < 48) return 'Summarized Yesterday';
        return `Summarized ${Math.floor(diffHours / 24)} days ago`;
    };

    // Chat Message Handlers
    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!userInput.trim() || isChatLoading || !activeDocument) return;

        const text = userInput;
        const updatedMessages = [...messages, { sender: 'user', text }];
        setMessages(updatedMessages);
        setUserInput('');
        setIsChatLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const response = await axios.post(`http://localhost:5000/api/documents/${activeDocument._id}/chat`, {
                question: text
            }, config);

            setMessages([...updatedMessages, {
                sender: 'ai',
                text: response.data.answer,
                citations: response.data.citations || []
            }]);
        } catch (err) {
            console.error('Chat failure:', err);
            setMessages([...updatedMessages, {
                sender: 'ai',
                text: '⚠️ *Unable to reach the Amber AI backend. Please check your connection and try again.*'
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    // Sidebar upload trigger handler
    const handleNewUpload = async (e) => {
        if (e.target.files && e.target.files[0]) {
            setUploading(true);
            const selectedFile = e.target.files[0];
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const token = localStorage.getItem('token');
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch('http://localhost:5000/api/documents/upload', {
                    method: 'POST',
                    headers: headers,
                    body: formData
                });

                const data = await response.json();
                if (response.ok && data.documentId) {
                    // Refetch documents list and automatically select the newly uploaded file
                    await fetchDocuments(data.documentId);
                    navigate(`/results/${data.documentId}`);
                } else {
                    alert(data.error || "Failed to process the uploaded file.");
                }
            } catch (err) {
                console.error("Upload error:", err);
                alert("Upload failed.");
            } finally {
                setUploading(false);
            }
        }
    };

    const triggerUploadClick = () => {
        fileInputRef.current.click();
    };

    if (loading) {
        return (
            <div style={styles.loadingScreen}>
                <div style={styles.loadingSpinner} />
                <span style={styles.loadingText}>Initializing Amber Dashboard Workspace...</span>
            </div>
        );
    }

    return (
        <div className="workspace-container">
            {/* LEFT SIDEBAR */}
            <aside className="workspace-sidebar">
                <div className="sidebar-logo" onClick={() => navigate('/')}>
                    <div style={styles.logoIconBox}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.657 16.657L13.414 20.9M9.879 17.364l-4.243-4.243m12.021-3.535A8 8 0 114 12a8.001 8.001 0 0113.657-5.657l-1.414 1.414" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <span style={styles.logoText}>Amber Insight</span>
                </div>

                {/* Document Search Bar */}
                <div className="sidebar-search-container">
                    <svg className="sidebar-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        className="sidebar-search-input"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Documents List */}
                <div className="sidebar-doc-list no-scrollbar">
                    {documentsList.length === 0 ? (
                        <div style={styles.emptyStateBox}>
                            <span style={styles.emptyStateIcon}>📂</span>
                            <span style={styles.emptyStateTitle}>No documents yet</span>
                            <span style={styles.emptyStateSub}>Upload a file to get started</span>
                        </div>
                    ) : filteredDocs.length === 0 ? (
                        <div style={styles.noMatchText}>No matches found.</div>
                    ) : (
                        filteredDocs.map(doc => {
                            const iconProps = getFileIconProps(doc.fileName);
                            const isActive = activeDocument?._id === doc._id;
                            return (
                                <div
                                    key={doc._id}
                                    onClick={() => handleSelectDocument(doc)}
                                    className={`sidebar-doc-item ${isActive ? 'active' : ''}`}
                                >
                                    <div style={getDocIconStyle(iconProps.bg)}>
                                        {iconProps.text}
                                    </div>
                                    <div style={styles.docInfoFlex}>
                                        <div className="sidebar-doc-name">{doc.fileName}</div>
                                        <div className="sidebar-doc-meta">
                                            <span>{formatRelativeTime(doc.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* New upload button & file input */}
                <div style={styles.uploadFooterWrapper}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleNewUpload}
                        accept=".pdf,.docx,.pptx,.txt,.png,.jpg,.jpeg"
                        style={styles.fileInputHidden}
                    />
                    <button
                        onClick={triggerUploadClick}
                        className="btn-premium"
                        disabled={uploading}
                        style={styles.uploadBtn}
                    >
                        {uploading ? "Analyzing Influx..." : "+ New upload"}
                    </button>

                    {/* Profile Panel */}
                    <div className="sidebar-user-profile">
                        <div style={styles.userProfileRow}>
                            <div style={styles.userAvatarBox}>
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                            </div>
                            <div>
                                <div style={styles.userName}>
                                    {user?.name || 'Guest Mode'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* MIDDLE CONTENT PANE */}
            <main className="workspace-content-pane">
                <div className="content-header">
                    <div className="content-breadcrumb" style={styles.breadcrumb}>
                        Library / <span className="content-breadcrumb-active">{activeDocument?.fileName}</span>
                    </div>
                    <div className="content-header-actions">
                        <button
                            className="btn-outline"
                            style={styles.copyBtn}
                            onClick={() => {
                                if (!activeDocument?.summary) return;
                                navigator.clipboard.writeText(activeDocument.summary).then(() => {
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2000);
                                });
                            }}
                        >
                            <span>{copied ? '✅' : '📋'}</span>
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                    </div>
                </div>

                <div className="content-scroll-area">
                    {activeDocument && (
                        <>
                            {/* Document Info Card */}
                            <div className="content-doc-card">
                                <div className="doc-card-header">
                                    <div className="doc-card-icon" style={{ backgroundColor: getFileIconProps(activeDocument.fileName).bg }}>
                                        {getFileIconProps(activeDocument.fileName).text}
                                    </div>
                                    <div>
                                        <h2 className="doc-card-title">{activeDocument.fileName}</h2>
                                        <div className="doc-card-meta">
                                            {getFileIconProps(activeDocument.fileName).text} {formatRelativeTime(activeDocument.createdAt).toLowerCase()}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Selection Tabs */}
                                <div className="content-tab-nav">
                                    {['Summary', 'Key Takeaways'].map(tab => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveContentTab(tab)}
                                            className={`content-tab-btn ${activeContentTab === tab ? 'active' : ''}`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Active Tab Contents */}
                                {(() => {
                                    // AI response into Summary and Key Takeaways sections
                                    const fullText = activeDocument.summary || '';
                                    const insightsMarker = /###\s*⚡\s*Target Insights Matrix/i;
                                    const markerMatch = insightsMarker.exec(fullText);
                                    const summaryText = markerMatch
                                        ? fullText.slice(0, markerMatch.index).replace(/###\s*🧠\s*Comprehensive AI Summary/i, '').trim()
                                        : fullText.replace(/###\s*🧠\s*Comprehensive AI Summary/i, '').trim();
                                    const keyTakeawaysText = markerMatch
                                        ? fullText.slice(markerMatch.index + markerMatch[0].length).trim()
                                        : '';

                                    return (
                                        <>
                                            {activeContentTab === 'Summary' && (
                                                <div style={styles.markdownContent}>
                                                    <ReactMarkdown>{summaryText}</ReactMarkdown>
                                                </div>
                                            )}
                                            {activeContentTab === 'Key Takeaways' && (
                                                <div>
                                                    {keyTakeawaysText ? (
                                                        <div style={styles.markdownContent}>
                                                            <ReactMarkdown>{keyTakeawaysText}</ReactMarkdown>
                                                        </div>
                                                    ) : (
                                                        <ul className="takeaways-list">
                                                            {activeDocument.extractedInsights.map((insight, idx) => (
                                                                <li key={idx} className="takeaways-item">{insight}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>
                        </>
                    )}
                </div>
            </main>

            {/* RIGHT CHAT PANE */}
            <section className="workspace-chat-pane">
                <div className="chat-header">
                    <span className="chat-header-title" style={styles.chatHeaderTitle}>Ask Amber</span>
                    <div style={styles.chatHeaderStatusRow}>
                        <span style={styles.chatStatusDot}></span>
                        <span style={styles.chatStatusText}>Amber AI Active</span>
                    </div>
                </div>

                {/* Messages Panel */}
                <div ref={chatContainerRef} className="chat-message-window no-scrollbar">
                    {messages.map((msg, index) => {
                        const isUser = msg.sender === 'user';
                        return (
                            <div key={index} className={`chat-msg-row ${isUser ? 'user' : 'ai'}`}>
                                {!isUser && (
                                    <div className="chat-msg-avatar" style={styles.chatAiAvatarStyle}>🔥</div>
                                )}
                                <div className={`chat-msg-bubble ${isUser ? 'user' : 'ai'}`}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>

                                    {/* Citations badges */}
                                    {!isUser && msg.citations && msg.citations.length > 0 && (
                                        <div className="chat-msg-citations">
                                            {msg.citations.map((cit, idx) => (
                                                <button key={idx} className="chat-msg-citation-btn">
                                                    📄 {cit}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {isUser && (
                                    <div className="chat-msg-avatar" style={styles.chatUserAvatarStyle}>👤</div>
                                )}
                            </div>
                        );
                    })}

                    {isChatLoading && (
                        <div style={styles.chatLoadingRow}>
                            <span style={styles.chatLoadingDot} />
                            <span>Amber is thinking...</span>
                        </div>
                    )}
                </div>

                {/* Chat Input Deck */}
                <div className="chat-input-container">
                    <form onSubmit={handleSendMessage} className="chat-input-form">
                        <textarea
                            className="chat-input-field no-scrollbar"
                            placeholder="Got a query?"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            rows={1}
                        />
                        <button
                            type="submit"
                            className="chat-send-btn"
                            disabled={!userInput.trim() || isChatLoading}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ResultsPage;