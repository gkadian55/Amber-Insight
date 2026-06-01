import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ResultsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const chatEndRef = useRef(null);

    // Core Data States
    const [documentData, setDocumentData] = useState(null);
    const [error, setError] = useState('');

    // Conversational Q&A States
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    // Initial Sync: Fetch Document Profile
    useEffect(() => {
        const fetchDocumentAnalysis = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/documents/${id}`);
                if (response.data) {
                    setDocumentData(response.data);
                    // Seed the conversation with a welcome message from the engine
                    setMessages([
                        {
                            sender: 'ai',
                            text: `👋 Intelligence stream synchronized. I have fully indexed **${response.data.fileName}**. Ask me any clarifying questions or target metrics you'd like extracted!`
                        }
                    ]);
                } else {
                    setError('Document profile not found inside the database cluster.');
                }
            } catch (err) {
                console.error('Retrieval Error:', err);
                setError(err.response?.data?.error || 'Failed to interface with database records.');
            }
        };

        if (id) fetchDocumentAnalysis();
    }, [id]);

    // Auto-scroll chat to latest message bubble
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Core Chat Submission Handler
    const handleSendMessage = async (textToSend) => {
        const query = textToSend || userInput;
        if (!query.trim() || isChatLoading) return;

        // Push user message directly into UI thread
        const updatedMessages = [...messages, { sender: 'user', text: query }];
        setMessages(updatedMessages);
        if (!textToSend) setUserInput(''); // Clear input box if typed manually
        setIsChatLoading(true);

        try {
            // Securely grab the authorization token from LocalStorage
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            // POST query straight to our upcoming interactive backend gateway
            const response = await axios.post(`http://localhost:5000/api/documents/${id}/chat`, {
                question: query
            }, config);

            // Append AI's targeted answer stream
            setMessages([...updatedMessages, { sender: 'ai', text: response.data.answer }]);
        } catch (err) {
            console.error('Chat Session Error:', err);
            setMessages([...updatedMessages, { sender: 'ai', text: '⚠️ *System Core Error: Unable to extract data from the model cluster.*' }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorCard}>
                    <h3>⚠️ Data Sync Anomaly</h3>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} style={styles.backButton}>Return to Home Base</button>
                </div>
            </div>
        );
    }

    if (!documentData) {
        return <div style={styles.loadingDisplay}>⚡ Syncing Dashboard Analysis Streams...</div>;
    }

    return (
        <div style={styles.panoramicWrapper}>
            {/* Upper Action/Navigation Dock */}
            <div style={styles.actionBar}>
                <button onClick={() => navigate('/')} style={styles.backButton}>
                    ← Ingest Another Asset
                </button>
                <div style={styles.pageTitleHeader}>Analysis Intelligence Deck</div>
            </div>

            {/* Document Target Information Bar */}
            <div style={styles.metaHeader}>
                <span style={styles.metaBadge}>📍 Active System Core Target: {documentData.fileName}</span>
                <a href={documentData.fileUrl} target="_blank" rel="noreferrer" style={styles.downloadLink}>
                    View Source Asset ↗
                </a>
            </div>

            {/* 64/36 Panoramic Grid Layout */}
            <div style={styles.paneContainer}>

                {/* LEFT PANEL (64% width): Solid Analytical Core */}
                <div style={styles.summaryPane}>
                    <div style={styles.markdownContent}>
                        <ReactMarkdown>{documentData.summary}</ReactMarkdown>
                    </div>
                </div>

                {/* RIGHT PANEL (36% width): Dynamic Q&A Interactive Console */}
                <div style={styles.chatPane}>
                    <h3 style={styles.chatTitle}>💬 Document Intelligence Chat</h3>

                    {/* Message Bubble Field */}
                    <div style={styles.chatMessageWindow}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    ...styles.messageRow,
                                    justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                <div style={{
                                    ...styles.messageBubble,
                                    backgroundColor: msg.sender === 'user' ? '#2563eb' : '#f1f5f9',
                                    color: msg.sender === 'user' ? '#ffffff' : '#1e293b',
                                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px'
                                }}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div style={styles.chatSystemNotice}>
                                <span style={styles.pulseDot}>⚡</span> AI Core compiling response...
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Context Suggestion Pills */}
                    <div style={styles.pillsContainer}>
                        <button onClick={() => handleSendMessage("Extract key action items and deadlines")} style={styles.pillButton} disabled={isChatLoading}>
                            📋 Action Items
                        </button>
                        <button onClick={() => handleSendMessage("Are there any suspicious figures or hidden costs?")} style={styles.pillButton} disabled={isChatLoading}>
                            🔍 Audit Data
                        </button>
                    </div>

                    {/* Input Entry Console */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                        style={styles.chatInputForm}
                    >
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask a question about this asset..."
                            style={styles.chatInputField}
                            disabled={isChatLoading}
                        />
                        <button
                            type="submit"
                            style={styles.chatSendButton}
                            disabled={isChatLoading || !userInput.trim()}
                        >
                            Send
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

// Custom Stylesheet Architecture
const styles = {
    panoramicWrapper: { width: '100%', minHeight: '100vh', padding: '30px 40px', fontFamily: 'system-ui, sans-serif', boxSizing: 'border-box', backgroundColor: '#0f172a' },
    loadingDisplay: { textAlign: 'center', padding: '100px', color: '#64748b', fontSize: '18px', fontWeight: '600' },
    errorContainer: { display: 'flex', justifyContent: 'center', marginTop: '100px' },
    errorCard: { backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
    actionBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #334155', paddingBottom: '14px', width: '100%' },
    backButton: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#334155', cursor: 'pointer' },
    pageTitleHeader: { fontSize: '22px', fontWeight: '700', color: '#f8fafc' },
    metaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '18px 24px', borderRadius: '10px', color: '#f8fafc', fontSize: '14px', marginBottom: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '100%', boxSizing: 'border-box' },
    metaBadge: { fontWeight: '600' },
    downloadLink: { color: '#38bdf8', textDecoration: 'none', fontWeight: '600' },

    // 🟢 CRITICAL: Pure 64% / 36% Grid Split Framework
    paneContainer: {
        display: 'grid',
        gridTemplateColumns: '70fr 30fr',
        gap: '24px',
        alignItems: 'stretch',
        width: '100%',
        boxSizing: 'border-box'
    },
    summaryPane: { backgroundColor: '#ffffff', borderRadius: '14px', padding: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', boxSizing: 'border-box', height: 'fit-content' },
    markdownContent: { color: '#334155', fontSize: '16px', lineHeight: '1.7' },

    // Interactive Chat UI Styles
    chatPane: { backgroundColor: '#ffffff', borderRadius: '14px', padding: '25px', display: 'flex', flexDirection: 'column', height: '600px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', boxSizing: 'border-box' },
    chatTitle: { margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
    chatMessageWindow: { flex: 1, overflowY: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '15px' },
    messageRow: { display: 'flex', width: '100%' },
    messageBubble: { padding: '12px 16px', maxWidth: '85%', fontSize: '15px', lineHeight: '1.5', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    chatSystemNotice: { color: '#64748b', fontSize: '13px', fontStyle: 'italic', paddingLeft: '5px' },
    pillsContainer: { display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' },
    pillButton: { backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', color: '#475569', cursor: 'pointer', transition: 'all 0.2s' },
    chatInputForm: { display: 'flex', gap: '10px', width: '100%' },
    chatInputField: { flex: 1, border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', outline: 'none' },
    chatSendButton: { backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0 20px', fontWeight: '600', cursor: 'pointer' }
};

export default ResultsPage;