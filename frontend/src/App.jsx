import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import UploadPage from './components/UploadPage';
import ResultsPage from './components/ResultsPage';

function App() {
    return (
        <Router>
            <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#0f172a' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/upload" replace />} />
                    <Route path="/upload" element={<UploadPage />} />
                    <Route path="/results/:id" element={<ResultsPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;