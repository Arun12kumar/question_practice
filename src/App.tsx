import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TestProvider } from './context/TestContext';
import Header from './components/Header';
import Home from './components/Home';
import ExamConduct from './components/ExamConduct';
import Analytics from './components/Analytics';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <TestProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/question_practice/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/exam" 
                element={
                  <ProtectedRoute>
                    <ExamConduct />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/analytics" 
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </TestProvider>
    </AuthProvider>
  );
}

export default App;