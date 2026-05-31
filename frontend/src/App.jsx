import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // 🟢 Import Provider
import UploadPage from './components/UploadPage';
import ResultsPage from './components/ResultsPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';

function App() {
    return (
        <AuthProvider> {/* 🟢 Wrap Core Ecosystem */}
            <Router>
                <Routes>
                    <Route path="/" element={<UploadPage />} />
                    <Route path="/results/:id" element={<ResultsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;