import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Auth from '@pages/auth';
import Main from '@pages/secretData';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="auth*" element={<Auth />} />
                <Route path='/' element={<Main />}></Route>
            </Routes>
        </Router>
    );
}