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

    // 🟢 New State: Clipboard Feedback
    const [copied, setCopied] = useState(false);

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

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 🟢 New Logic: Clipboard Handler
    const handleCopy = () => {
        if (!documentData?.summary) return;
        navigator.clipboard.writeText(documentData.summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendMessage = async (textToSend) => {
        const query = textToSend || userInput;
        if (!query.trim() || isChatLoading) return;

        const updatedMessages = [...messages, { sender: 'user', text: query }];
        setMessages(updatedMessages);
        if (!textToSend) setUserInput('');
        setIsChatLoading(true);

        try {
            const token = localStorage.getItem('token');
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

            const response = await axios.post(`http://localhost:5000/api/documents/${id}/chat`, {
                question: query
            }, config);

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
            <div style={styles.actionBar}>
                <button onClick={() => navigate('/')} style={styles.backButton}>
                    ← Ingest Another Asset
                </button>
                <div style={styles.pageTitleHeader}>Analysis Intelligence Deck</div>
            </div>

            <div style={styles.metaHeader}>
                <span style={styles.metaBadge}>📍 Active System Core Target: {documentData.fileName}</span>
                <a href={documentData.fileUrl} target="_blank" rel="noreferrer" style={styles.downloadLink}>
                    View Source Asset ↗
                </a>
            </div>

            <div style={styles.paneContainer}>

                {/* LEFT PANEL: Solid Analytical Core */}
                <div style={styles.summaryPane}>
                    {/* 🟢 NEW: Pane Header with Copy Button */}
                    <div style={styles.paneHeader}>
                        <h3 style={styles.paneTitle}>Core Analysis</h3>
                        <button
                            onClick={handleCopy}
                            style={{
                                ...styles.copyButton,
                                borderColor: copied ? '#ffb300' : '#cbd5e1',
                                color: copied ? '#ffb300' : '#64748b',
                                backgroundColor: copied ? 'rgba(255, 179, 0, 0.05)' : '#ffffff'
                            }}
                        >
                            {copied ? '✓ Copied to Clipboard' : '📋 Copy Summary'}
                        </button>
                    </div>

                    <div style={styles.markdownContent}>
                        <ReactMarkdown>{documentData.summary}</ReactMarkdown>
                    </div>
                </div>

                {/* RIGHT PANEL: Dynamic Q&A Interactive Console */}
                <div style={styles.chatPane}>
                    <h3 style={styles.chatTitle}>💬 Document Intelligence Chat</h3>

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

    paneContainer: {
        display: 'grid',
        gridTemplateColumns: '70fr 30fr',
        gap: '24px',
        alignItems: 'stretch',
        width: '100%',
        boxSizing: 'border-box'
    },
    summaryPane: { backgroundColor: '#ffffff', borderRadius: '14px', padding: '35px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', boxSizing: 'border-box', height: 'fit-content' },

    // 🟢 NEW: Header layout for the summary pane
    paneHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '15px' },
    paneTitle: { margin: 0, fontSize: '18px', color: '#0f172a', fontWeight: '700' },
    copyButton: { padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', border: '1px solid', transition: 'all 0.2s ease' },

    markdownContent: { color: '#334155', fontSize: '16px', lineHeight: '1.7' },

    chatPane: { backgroundColor: '#ffffff', borderRadius: '14px', padding: '25px', display: 'flex', flexDirection: 'column', height: '600px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', boxSizing: 'border-box' },
    chatTitle: { margin: '0 0 16px 0', fontSize: '18px', color: '#0f172a', fontWeight: '700', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
    chatMessageWindow: { flex: 1, overflowY: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '15px' },
    messageRow: { display: 'flex', width: '100%' },
    messageBubble: { padding: '12px 16px', maxWidth: '85%', fontSize: '15px', lineHeight: '1.5', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
    chatSystemNotice: { color: '#64748b', fontSize: '13px', fontStyle: 'italic', paddingLeft: '5px' },
    chatInputForm: { display: 'flex', gap: '10px', width: '100%' },
    chatInputField: { flex: 1, border: '1px solid #cbd5e1', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', outline: 'none' },
    chatSendButton: { backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '0 20px', fontWeight: '600', cursor: 'pointer' }
};

export default ResultsPage;