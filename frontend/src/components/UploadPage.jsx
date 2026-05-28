import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatusMessage('');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setStatusMessage('❌ Please select a physical file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true);
            setStatusMessage('🤖 Ingesting file... Running AI cognitive analysis...');

            const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const savedDoc = response.data.data;

            // 🚀 THE REDIRECT: Changes page entirely to the dedicated results route layout
            navigate(`/results/${savedDoc._id}`);
        } catch (error) {
            console.error('Upload Error:', error);
            setStatusMessage(`❌ Processing Failed: ${error.response?.data?.error || error.message}`);
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.uploadCard}>
                <h2 style={styles.cardTitle}>Ingest New Document</h2>
                <p style={styles.cardSubtitle}>Support PDF formats for native text and structural extraction</p>

                <form onSubmit={handleUpload} style={styles.formLayout}>
                    <div style={styles.uploadZone}>
                        <label htmlFor="file-selector" style={styles.uploadLabel}>
                            <div style={styles.uploadIcon}>📁</div>
                            {file ? (
                                <div style={styles.fileNameDisplay}>
                                    <span style={styles.fileNameLabel}>Selected File:</span>
                                    <div style={styles.fileNameText}>{file.name}</div>
                                </div>
                            ) : (
                                <span style={styles.uploadPlaceholder}>Click to browse or drag your PDF asset here</span>
                            )}
                        </label>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            style={styles.hiddenFileInput}
                            id="file-selector"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.actionButton, backgroundColor: loading ? '#94a3b8' : '#2563eb' }}
                    >
                        {loading ? 'Analyzing Pipeline...' : 'Analyze Document'}
                    </button>
                </form>

                {statusMessage && (
                    <div style={styles.statusBanner}>
                        {statusMessage}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '0 20px', fontFamily: 'system-ui, sans-serif' },
    uploadCard: { width: '100%', maxWidth: '600px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '40px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', textAlign: 'center' },
    cardTitle: { margin: '0 0 8px 0', fontSize: '26px', color: '#0f172a', fontWeight: '700' },
    cardSubtitle: { margin: '0 0 30px 0', color: '#64748b', fontSize: '14px' },
    formLayout: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' },
    uploadZone: { width: '100%', border: '2px dashed #cbd5e1', borderRadius: '12px', backgroundColor: '#f8fafc', padding: '30px 20px', boxSizing: 'border-box' },
    uploadLabel: { cursor: 'pointer', display: 'block' },
    uploadIcon: { fontSize: '32px', marginBottom: '10px' },
    uploadPlaceholder: { color: '#64748b', fontSize: '14px' },
    hiddenFileInput: { display: 'none' },
    fileNameDisplay: { display: 'flex', flexDirection: 'column', gap: '4px' },
    fileNameLabel: { fontSize: '11px', color: '#2563eb', fontWeight: '700' },
    fileNameText: { fontSize: '14px', color: '#0f172a', fontWeight: '600', wordBreak: 'break-all' },
    actionButton: { color: '#ffffff', border: 'none', padding: '14px 40px', borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', width: '100%', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' },
    statusBanner: { marginTop: '24px', padding: '14px', borderRadius: '8px', backgroundColor: '#eff6ff', fontSize: '14px', color: '#1e3a8a', fontWeight: '500', width: '100%', boxSizing: 'border-box' },
};

export default UploadPage;