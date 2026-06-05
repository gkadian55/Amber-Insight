import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import { styles } from '../styles/ResultPageCSS.js';

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

                {/* LEFT PANEL: Markdown Core */}
                <div style={styles.summaryPane}>
                    <div style={styles.paneHeader}>
                        <h3 style={styles.paneTitle}>Core Analysis</h3>
                        <button
                            onClick={handleCopy}
                            style={{
                                ...styles.copyButton,
                                borderColor: copied ? '#ffb300' : '#242736',
                                color: copied ? '#ffb300' : '#94a3b8',
                                backgroundColor: copied ? 'rgba(255, 179, 0, 0.05)' : '#1e293b',
                                width: '170px'
                            }}
                        >
                            {copied ? '✓ Copied' : '📋 Copy Summary'}
                        </button>
                    </div>

                    <div style={styles.markdownContent}>
                        <ReactMarkdown
                            components={{
                                h3: ({ node, ...props }) => <h3 style={{ color: '#ffffff', margin: '16px 0 8px 0' }} {...props} />
                            }}
                        >
                            {documentData.summary}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* RIGHT PANEL: Tactical Chat Engine */}
                <div style={styles.chatPane}>
                    <h3 style={styles.chatTitle}>💬 Ask Amber</h3>

                    {/* Message Bubble Field */}
                    <div ref={chatContainerRef} style={styles.chatMessageWindow} className="no-scrollbar">
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

export default ResultsPage;