import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ResultsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const chatContainerRef = useRef(null);

    // Core Data States
    const [documentData, setDocumentData] = useState(null);
    const [error, setError] = useState('');

    // Clipboard Feedback State
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
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages]);

    // Clipboard Handler
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
                    <h3 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>⚠️ Data Sync Anomaly</h3>
                    <p style={{ color: '#94a3b8', margin: '0 0 20px 0' }}>{error}</p>
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
                    ← Console Dashboard
                </button>
                <div style={styles.pageTitleHeader}>Amber Insight Console</div>
            </div>

            {/* Document Target Information Bar */}
            <div style={styles.metaHeader}>
                <span style={styles.metaBadge}>📍 Active Core Target: {documentData.fileName}</span>
                <a href={documentData.fileUrl} target="_blank" rel="noreferrer" style={styles.downloadLink}>
                    View Source Asset ↗
                </a>
            </div>

            <div style={styles.paneContainer}>

                {/* LEFT PANEL (70% width): Premium Markdown Core */}
                <div style={styles.summaryPane}>
                    <div style={styles.paneHeader}>
                        <h3 style={styles.paneTitle}>Core Analysis</h3>
                        <button
                            onClick={handleCopy}
                            style={{
                                ...styles.copyButton,
                                borderColor: copied ? '#ffb300' : '#242736',
                                color: copied ? '#ffb300' : '#94a3b8',
                                backgroundColor: copied ? 'rgba(255, 179, 0, 0.05)' : '#1e293b'
                            }}
                        >
                            {copied ? '✓ Copied' : '📋 Copy Summary'}
                        </button>
                    </div>

                    <div style={styles.markdownContent}>
                        <ReactMarkdown>{documentData.summary}</ReactMarkdown>
                    </div>
                </div>

                {/* RIGHT PANEL (30% width): Tactical Chat Engine */}
                <div style={styles.chatPane}>
                    <h3 style={styles.chatTitle}>💬 Ask Amber</h3>

                    {/* Message Bubble Field */}
                    <div ref={chatContainerRef} style={styles.chatMessageWindow}>
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
                                    backgroundColor: msg.sender === 'user' ? '#ffb300' : '#242736',
                                    color: msg.sender === 'user' ? '#0d0e12' : '#ffffff',
                                    borderRadius: msg.sender === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px'
                                }}>
                                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                        {isChatLoading && (
                            <div style={styles.chatSystemNotice}>
                                <span style={{ color: '#ffb300' }}>⚡</span> Amber is thinking...
                            </div>
                        )}
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
                            placeholder="Ask a clarifying question..."
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
    panoramicWrapper: { width: '100%', minHeight: '100vh', padding: '30px 40px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', boxSizing: 'border-box', backgroundColor: '#0d0e12' },
    loadingDisplay: { textAlign: 'center', padding: '100px', color: '#ffb300', backgroundColor: '#0d0e12', minHeight: '100vh', fontSize: '18px', fontWeight: '600', letterSpacing: '1px' },
    errorContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#0d0e12' },
    errorCard: { backgroundColor: '#161822', padding: '30px', borderRadius: '12px', textAlign: 'center', border: '1px solid #ef4444', boxShadow: '0 8px 24px rgba(0,0,0,0.4)', maxWidth: '400px' },
    actionBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #242736', paddingBottom: '14px', width: '100%' },
    backButton: { backgroundColor: '#161822', border: '1px solid #242736', padding: '10px 18px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s ease' },
    pageTitleHeader: { fontSize: '20px', fontWeight: '800', color: '#ffb300', letterSpacing: '1px', textTransform: 'uppercase' },
    metaHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#161822', padding: '16px 24px', borderRadius: '10px', color: '#ffffff', fontSize: '14px', marginBottom: '30px', border: '1px solid #242736', width: '100%', boxSizing: 'border-box' },
    metaBadge: { fontWeight: '600', color: '#cbd5e1' },
    downloadLink: { color: '#ffb300', textDecoration: 'none', fontWeight: '600' },

    // 🟢 Dynamic Grid Engine
    paneContainer: {
        display: 'grid',
        gridTemplateColumns: '70fr 30fr',
        gap: '24px',
        alignItems: 'stretch',
        width: '100%',
        boxSizing: 'border-box'
    },

    // Left Summary Pane Structure
    summaryPane: { backgroundColor: '#161822', borderRadius: '12px', padding: '35px', border: '1px solid #242736', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', boxSizing: 'border-box', height: 'fit-content' },
    paneHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #242736', paddingBottom: '15px' },
    paneTitle: { margin: 0, fontSize: '18px', color: '#ffffff', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' },
    copyButton: { padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: '1px solid', transition: 'all 0.2s ease' },
    markdownContent: { color: '#cbd5e1', fontSize: '15px', lineHeight: '1.7' },

    // Right Companion Pane Structure
    chatPane: { backgroundColor: '#161822', borderRadius: '12px', padding: '25px', display: 'flex', flexDirection: 'column', height: '650px', border: '1px solid #242736', boxShadow: '0 4px 20px rgba(0,0,0,0.2)', boxSizing: 'border-box', position: 'sticky', top: '24px', alignSelf: 'start' },
    chatTitle: { margin: '0 0 16px 0', fontSize: '16px', color: '#ffffff', fontWeight: '700', textTransform: 'uppercase', borderBottom: '1px solid #242736', paddingBottom: '12px', letterSpacing: '0.5px' },
    chatMessageWindow: { flex: 1, overflowY: 'auto', paddingRight: '5px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '15px' },
    messageRow: { display: 'flex', width: '100%' },
    messageBubble: { padding: '12px 16px', maxWidth: '85%', fontSize: '14px', lineHeight: '1.5', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' },
    chatSystemNotice: { color: '#94a3b8', fontSize: '13px', fontStyle: 'italic', paddingLeft: '5px' },
    chatInputForm: { display: 'flex', gap: '10px', width: '100%' },
    chatInputField: { flex: 1, backgroundColor: '#0d0e12', border: '1px solid #242736', borderRadius: '8px', padding: '12px 16px', fontSize: '14px', color: '#ffffff', outline: 'none', transition: 'border-color 0.2s ease' },
    chatSendButton: { backgroundColor: '#ffb300', color: '#0d0e12', border: 'none', borderRadius: '8px', padding: '0 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.2s ease' }
};

export default ResultsPage;