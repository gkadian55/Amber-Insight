import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ResultsPage = () => {
    const { id } = useParams(); // Grabs the document ID straight from the URL parameters!
    const navigate = useNavigate();
    const [documentData, setDocumentData] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDocumentAnalysis = async () => {
            try {
                // 🚀 UPGRADE: Query our dedicated backend endpoint for a single document ID
                const response = await axios.get(`http://localhost:5000/api/documents/${id}`);

                // Since our fresh backend route returns the single matched object directly:
                if (response.data) {
                    setDocumentData(response.data);
                } else {
                    setError('Document profile not found inside the database cluster.');
                }
            } catch (err) {
                console.error('Retrieval Error:', err);
                // Extract clean server error if available, otherwise use default fallback
                const backendError = err.response?.data?.error || 'Failed to interface with database records.';
                setError(backendError);
            }
        };

        if (id) fetchDocumentAnalysis();
    }, [id]);

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorCard}>
                    <h3>⚠️ Data Sync Anomaly</h3>
                    <p>{error}</p>
                    <button onClick={() => navigate('/upload')} style={styles.backButton}>Return to Home Base</button>
                </div>
            </div>
        );
    }

    if (!documentData) {
        return <div style={styles.loadingDisplay}>⚡ Syncing Dashboard Analysis Streams...</div>;
    }

    return (
        <div style={styles.panoramicWrapper}>
            {/* Universal Upper Navigation Dock */}
            <div style={styles.actionBar}>
                <button onClick={() => navigate('/upload')} style={styles.backButton}>
                    ← Ingest Another Asset
                </button>
                <div style={styles.pageTitleHeader}>Analysis Intelligence Deck</div>
            </div>

            {/* Meta Identity Banner */}
            <div style={styles.metaHeader}>
                <span style={styles.metaBadge}>📍 Active System Core Target: {documentData.fileName}</span>
                <a href={documentData.fileUrl} target="_blank" rel="noreferrer" style={styles.downloadLink}>
                    View Uploaded Source PDF ↗
                </a>
            </div>

            {/* Panoramic Double-Pane Layout Grid */}
            <div style={styles.paneContainer}>
                {/* Left Wing: AI Comprehensive Summary Block */}
                <div style={styles.summaryPane}>
                    <h3 style={styles.paneTitle}>🧠 Comprehensive AI Summary</h3>
                    <div style={styles.markdownContent}>
                        <ReactMarkdown>{documentData.summary}</ReactMarkdown>
                    </div>
                </div>

                {/* Right Wing: Categorized Target Insights Block */}
                <div style={styles.insightsPane}>
                    <h3 style={styles.paneTitle}>⚡ Target Insights Matrix</h3>
                    <div style={styles.insightsList}>
                        {documentData.extractedInsights.map((insight, index) => (
                            <div key={index} style={styles.insightCard}>
                                <div style={styles.insightIndex}>0{index + 1}</div>
                                <div style={styles.insightText}>
                                    <ReactMarkdown>{insight}</ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    // 🟢 True edge-to-edge widescreen layout wrapper
    panoramicWrapper: {
        width: '100%',
        minHeight: '100vh',
        padding: '30px 40px',
        fontFamily: 'system-ui, sans-serif',
        boxSizing: 'border-box',
        backgroundColor: '#0f172a' // Seamless fluid dark mode background matching App.js
    },
    loadingDisplay: { textAlign: 'center', padding: '100px', color: '#64748b', fontSize: '18px', fontWeight: '600' },
    errorContainer: { display: 'flex', justifyContent: 'center', marginTop: '100px' },
    errorCard: { backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },

    actionBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        borderBottom: '1px solid #334155',
        paddingBottom: '14px',
        width: '100%'
    },
    backButton: { backgroundColor: '#ffffff', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: '600', color: '#334155', cursor: 'pointer' },
    pageTitleHeader: { fontSize: '22px', fontWeight: '700', color: '#f8fafc' },

    metaHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        padding: '18px 24px',
        borderRadius: '10px',
        color: '#f8fafc',
        fontSize: '14px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        boxSizing: 'border-box'
    },
    metaBadge: { fontWeight: '600' },
    downloadLink: { color: '#38bdf8', textDecoration: 'none', fontWeight: '600' },

    // 🟢 Panoramic Grid Structure: Spans 100% width with a beautifully proportioned 55/45 split
    paneContainer: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '30px',
        alignItems: 'start',
        width: '100%',
        boxSizing: 'border-box'
    },
    summaryPane: {
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        padding: '35px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        boxSizing: 'border-box'
    },
    insightsPane: {
        backgroundColor: '#ffffff',
        borderRadius: '14px',
        padding: '35px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        boxSizing: 'border-box'
    },
    paneTitle: { margin: '0 0 24px 0', fontSize: '20px', color: '#0f172a', borderBottom: '2px solid #f1f5f9', paddingBottom: '12px', fontWeight: '700' },
    markdownContent: { color: '#334155', fontSize: '16px', lineHeight: '1.7' },
    insightsList: { display: 'flex', flexDirection: 'column', gap: '20px' },
    insightCard: { display: 'flex', gap: '18px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', borderLeft: '5px solid #2563eb' },
    insightIndex: { fontSize: '20px', fontWeight: '800', color: '#2563eb', lineHeight: '1' },
    insightText: { color: '#334155', fontSize: '15px', lineHeight: '1.6', margin: 0 },
};

export default ResultsPage;