import React, { useState } from 'react';
import axios from 'axios';

const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setStatusMessage('');
            console.log(`📁 File selected: ${selectedFile.name}`);
        } else {
            alert('Please select a valid PDF file.');
            e.target.value = null;
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file); // 'file' matches upload.single('file') on the backend

        try {
            setUploading(true);
            setStatusMessage('Uploading document to engine...');

            const response = await axios.post('http://localhost:5000/api/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUploading(false);
            setStatusMessage(`🎉 Success! Server saved: ${response.data.filename}`);
            setFile(null); // Reset the input state after successful upload
        } catch (error) {
            setUploading(false);
            setStatusMessage(`❌ Upload failed: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <div style={{
            border: '2px dashed #374151',
            borderRadius: '12px',
            padding: '2.5rem',
            textAlign: 'center',
            backgroundColor: '#111827',
        }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#f3f4f6' }}>Upload Document</h3>
            <p style={{ color: '#9ca3af', fontSize: '0.875rem', margin: '0 0 1.5rem 0' }}>
                Select any PDF file to extract core insights
            </p>

            <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="pdf-upload"
                disabled={uploading}
            />

            <label
                htmlFor="pdf-upload"
                style={{
                    backgroundColor: uploading ? '#4b5563' : '#2563eb',
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    display: 'inline-block',
                    marginBottom: '1rem'
                }}
            >
                {uploading ? 'Processing...' : 'Choose PDF File'}
            </label>

            {file && !uploading && (
                <div style={{ margin: '0.5rem 0 1.5rem 0' }}>
                    <div style={{ color: '#10b981', fontSize: '0.875rem', marginBottom: '1rem' }}>
                        📁 Ready: <strong>{file.name}</strong>
                    </div>
                    <button
                        onClick={handleUpload}
                        style={{
                            backgroundColor: '#10b981',
                            color: '#ffffff',
                            border: 'none',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        Analyze Document
                    </button>
                </div>
            )}

            {statusMessage && (
                <div style={{
                    marginTop: '1.5rem',
                    fontSize: '0.875rem',
                    color: statusMessage.includes('❌') ? '#ef4444' : '#3b82f6'
                }}>
                    {statusMessage}
                </div>
            )}
        </div>
    );
};

export default FileUploader;