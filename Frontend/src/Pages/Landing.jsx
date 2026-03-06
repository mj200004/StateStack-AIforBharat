import { useNavigate } from 'react-router-dom';
import { clearCurrentUser } from '../utils/api';
import './Landing.css';

function Landing({ user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearCurrentUser();
    window.location.href = '/';
  };

  return (
    <div className="landing-container">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>

      <div className="landing-card">
        <h1>🎉 Welcome, {user?.name}!</h1>
        <p className="welcome-message">
          Ready to continue your coding journey? Let's make programming concepts simple and fun!
        </p>

        <div className="features-grid">
          <div className="feature-card" onClick={() => navigate('/chat')}>
            <div className="feature-icon">💬</div>
            <h3>AI Chat</h3>
            <p>Ask any programming question and get clear explanations</p>
          </div>

          <div className="feature-card" onClick={() => navigate('/debug')}>
            <div className="feature-icon">🐛</div>
            <h3>Code Debug</h3>
            <p>Get help fixing your code with detailed analysis</p>
          </div>

          <div className="feature-card" onClick={() => navigate('/learning-path')}>
            <div className="feature-icon">📚</div>
            <h3>Learning Path</h3>
            <p>Track your progress and discover what to learn next</p>
          </div>
        </div>

        <button className="start-button" onClick={() => navigate('/chat')}>
          Start Learning 🚀
        </button>
      </div>
    </div>
  );
}

export default Landing;
