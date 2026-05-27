import React from 'react';
import FileUploader from './components/FileUploader';

function App() {
    return (
        <main>
            <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <h1 style={{ color: '#3b82f6', margin: '0 0 0.5rem 0', letterSpacing: '-0.025em' }}>
                    Amber Insight
                </h1>
                <p style={{ color: '#9ca3af', margin: 0 }}>
                    Cognitive Document Synthesis Engine
                </p>
            </header>

            <FileUploader />
        </main>
    );
}

export default App;