import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import AuthPage from './pages/AuthPage';
import PublicLanding from './pages/PublicLanding';
import Landing from './pages/Landing';
import Chat from './pages/Chat';
import Debug from './pages/Debug';
import LearningPath from './pages/LearningPath';
import Lesson from './pages/Lesson';
import { getCurrentUser } from './utils/api';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in from DynamoDB/API
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser({
        name: currentUser.name,
        email: currentUser.email,
        userId: currentUser.userId,
        isAuthenticated: true
      });
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <PublicLanding />} 
        />
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage setUser={setUser} />} 
        />
        <Route 
          path="/signup" 
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage setUser={setUser} />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Landing user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/debug"
          element={
            <ProtectedRoute>
              <Debug user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learning-path"
          element={
            <ProtectedRoute>
              <LearningPath user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:topicId"
          element={
            <ProtectedRoute>
              <Lesson user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
