import React, { useState } from 'react';

const FileUploader = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            console.log(`📁 File selected: ${selectedFile.name}`);
        } else {
            alert('Please select a valid PDF file.');
            e.target.value = null;
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
            />

            <label
                htmlFor="pdf-upload"
                style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    display: 'inline-block'
                }}
            >
                Choose PDF File
            </label>

            {file && (
                <div style={{ marginTop: '1.5rem', color: '#10b981', fontSize: '0.875rem' }}>
                    ✅ Ready: <strong>{file.name}</strong> ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                </div>
            )}
        </div>
    );
};

export default FileUploader;