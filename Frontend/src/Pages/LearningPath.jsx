import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';
import { STORAGE_KEY } from '../utils/constants';
import { saveProgress, getUserProgress, getCurrentUser } from '../utils/api';
import './LearningPath.css';

// Hardcoded topic list - Simple and stable
const TOPICS = [
  { id: 1, title: "Variables & Data Types", xp: 100, description: "Learn how to store and use data in JavaScript" },
  { id: 2, title: "Operators & Expressions", xp: 80, description: "Perform calculations and comparisons" },
  { id: 3, title: "Conditionals (if/else)", xp: 90, description: "Make decisions in your code" },
  { id: 4, title: "Loops (for/while)", xp: 100, description: "Repeat actions efficiently" },
  { id: 5, title: "Functions Basics", xp: 120, description: "Create reusable blocks of code" },
  { id: 6, title: "Arrays & Array Methods", xp: 130, description: "Work with lists of data" },
  { id: 7, title: "Objects & Properties", xp: 130, description: "Organize data with key-value pairs" },
  { id: 8, title: "String Manipulation", xp: 90, description: "Work with text and formatting" },
  { id: 9, title: "DOM Manipulation", xp: 140, description: "Interact with HTML elements" },
  { id: 10, title: "Event Handling", xp: 120, description: "Respond to user interactions" },
  { id: 11, title: "Arrow Functions & Scope", xp: 110, description: "Modern function syntax and variable scope" },
  { id: 12, title: "Array Destructuring & Spread", xp: 100, description: "ES6 syntax for working with arrays" },
  { id: 13, title: "Async/Await & Promises", xp: 160, description: "Handle asynchronous operations" },
  { id: 14, title: "Fetch API & HTTP Requests", xp: 150, description: "Communicate with servers" },
  { id: 15, title: "Error Handling (try/catch)", xp: 100, description: "Manage errors gracefully" },
  { id: 16, title: "Local Storage & Session", xp: 110, description: "Store data in the browser" },
  { id: 17, title: "JSON & Data Parsing", xp: 90, description: "Work with JSON data format" },
  { id: 18, title: "Modules & Imports", xp: 120, description: "Organize code into modules" },
  { id: 19, title: "Debugging Techniques", xp: 100, description: "Find and fix bugs effectively" },
  { id: 20, title: "Best Practices & Clean Code", xp: 130, description: "Write maintainable, professional code" }
];

function LearningPath({ user, setUser }) {
  const navigate = useNavigate();

  // Simple user progress state
  // completedTopics structure: [{ id: 1, completedAt: "Mar 3, 2026" }, ...]
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    completedTopics: []
  });
  
  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedTopicData, setCompletedTopicData] = useState(null);

  // Load progress from DynamoDB on mount AND when page becomes visible
  useEffect(() => {
    const loadProgress = async () => {
      const currentUser = getCurrentUser();
      
      if (currentUser && currentUser.userId) {
        try {
          // Load from DynamoDB
          const progressData = await getUserProgress(currentUser.userId);
          
          // Convert DynamoDB format to app format
          const completedTopics = progressData
            .filter(p => p.completed)
            .map(p => ({
              id: parseInt(p.lessonId.replace('topic-', '')),
              completedAt: new Date(p.completedAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })
            }));
          
          const totalXP = progressData.reduce((sum, p) => sum + (p.xpEarned || 0), 0);
          
          setUserProgress({
            xp: totalXP,
            completedTopics
          });
          
          console.log('✅ Progress loaded from DynamoDB:', completedTopics.length, 'topics completed');
        } catch (err) {
          console.error('Failed to load progress from DynamoDB:', err);
          // Fallback to localStorage
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              setUserProgress({
                xp: parsed.xp || 0,
                completedTopics: parsed.completedTopics || []
              });
            } catch (error) {
              console.error('Failed to load progress from localStorage:', error);
            }
          }
        }
      } else {
        // No user logged in, use localStorage
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setUserProgress({
              xp: parsed.xp || 0,
              completedTopics: parsed.completedTopics || []
            });
          } catch (error) {
            console.error('Failed to load progress:', error);
          }
        }
      }
    };
    
    // Load on mount
    loadProgress();
    
    // Also reload when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadProgress();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (userProgress.xp > 0 || userProgress.completedTopics.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProgress));
    }
  }, [userProgress]);

  // Calculate progress percentage
  const progressPercent = Math.round((userProgress.completedTopics.length / TOPICS.length) * 100);

  // Mark topic as completed with date
  const completeTopic = async (topic) => {
    // Check if already completed
    if (!userProgress.completedTopics.some(t => t.id === topic.id)) {
      const newEntry = {
        id: topic.id,
        completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      
      // Use functional update to avoid stale state
      setUserProgress(prev => ({
        xp: prev.xp + topic.xp,
        completedTopics: [...prev.completedTopics, newEntry]
      }));
      
      // Save to DynamoDB
      const currentUser = getCurrentUser();
      if (currentUser && currentUser.userId) {
        try {
          await saveProgress(currentUser.userId, `topic-${topic.id}`, {
            completed: true,
            xpEarned: topic.xp,
            practiceAttempts: 1
          });
        } catch (err) {
          console.error('Failed to save progress to DynamoDB:', err);
        }
      }
      
      // Also save to localStorage as backup
      const updatedProgress = {
        xp: userProgress.xp + topic.xp,
        completedTopics: [...userProgress.completedTopics, newEntry]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProgress));
    }
  };

  // Check if topic is completed
  const isCompleted = (topicId) => {
    return userProgress.completedTopics.some(t => t.id === topicId);
  };

  // Check if topic is unlocked (sequential unlock logic)
  const isUnlocked = (topic) => {
    // First topic is always unlocked
    if (topic.id === 1) return true;
    
    // Check if previous topic is completed
    return userProgress.completedTopics.some(t => t.id === topic.id - 1);
  };

  // Get completion date for a topic
  const getCompletionDate = (topicId) => {
    const completed = userProgress.completedTopics.find(t => t.id === topicId);
    return completed ? completed.completedAt : null;
  };

  // Start learning a topic
  const handleStartLearning = (topic) => {
    navigate(`/lesson/${topic.id}`);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Reset progress (for testing)
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress?')) {
      setUserProgress({
        xp: 0,
        completedTopics: []
      });
    }
  };

  return (
    <div className="learning-path-container">
      <nav className="navbar">
        <h2>🤖 AI Learning Assistant</h2>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')}>Home</button>
          <button onClick={() => navigate('/chat')}>Chat</button>
          <button onClick={() => navigate('/debug')}>Debug</button>
          <button onClick={() => navigate('/learning-path')} className="active">Learning Path</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="learning-path-content">
        {/* Header */}
        <div className="lp-header">
          <div className="header-left">
            <h1>📚 Learning Path</h1>
            {user?.name && <p className="user-greeting">Welcome back, {user.name}! 👋</p>}
          </div>
          <div className="header-right">
            <div className="xp-badge">
              ⚡ {userProgress.xp} XP
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="progress-container">
          <div className="progress-info">
            <span className="progress-text">🚀 Your Progress</span>
            <span className="progress-stats">
              {progressPercent}% Complete • {userProgress.completedTopics.length} / {TOPICS.length} Topics
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="topics-section">
          <h2>📖 Available Topics</h2>
          <div className="topics-grid">
            {TOPICS.map((topic) => {
              const completed = isCompleted(topic.id);
              const unlocked = isUnlocked(topic);
              const completionDate = getCompletionDate(topic.id);
              
              return (
                <div 
                  key={topic.id} 
                  className={`topic-card ${completed ? 'completed' : ''} ${!unlocked ? 'locked' : ''}`}
                >
                  <div className="topic-header">
                    <div className="topic-number">#{topic.id}</div>
                    {completed && <div className="completed-badge">✓</div>}
                    {!unlocked && <div className="locked-badge">🔒</div>}
                  </div>
                  
                  <h3 className="topic-title">{topic.title}</h3>
                  <p className="topic-description">{topic.description}</p>
                  
                  {completed && completionDate && (
                    <div className="completion-date">
                      Completed: {completionDate}
                    </div>
                  )}
                  
                  <div className="topic-footer">
                    <div className="topic-xp">⚡ {topic.xp} XP</div>
                    
                    {!unlocked ? (
                      <button 
                        className="topic-btn locked-btn"
                        disabled
                      >
                        Locked 🔒
                      </button>
                    ) : completed ? (
                      <button 
                        className="topic-btn completed-btn"
                        onClick={() => handleStartLearning(topic)}
                      >
                        Review
                      </button>
                    ) : (
                      <button 
                        className="topic-btn start-btn"
                        onClick={() => handleStartLearning(topic)}
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Topics Summary */}
        {userProgress.completedTopics.length > 0 && (
          <div className="completed-summary">
            <h3>✅ Completed Topics</h3>
            <div className="completed-list">
              {userProgress.completedTopics.map((completedTopic) => {
                const topic = TOPICS.find(t => t.id === completedTopic.id);
                if (!topic) return null;
                
                return (
                  <div key={completedTopic.id} className="completed-item">
                    <span className="completed-icon">✓</span>
                    <div className="completed-info">
                      <span className="completed-name">{topic.title}</span>
                      <span className="completed-date-small">{completedTopic.completedAt}</span>
                    </div>
                    <span className="completed-xp">+{topic.xp} XP</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bottom-actions">
          <button 
            className="action-btn demo" 
            onClick={() => {
              const nextTopic = TOPICS.find(t => !isCompleted(t.id));
              if (nextTopic) {
                completeTopic(nextTopic);
                setCompletedTopicData(nextTopic);
                setShowSuccessModal(true);
              } else {
                alert('🎉 All topics completed!');
              }
            }}
          >
            ✨ Complete Next Topic (Demo)
          </button>
          
          <button 
            className="action-btn secondary" 
            onClick={handleResetProgress}
          >
            🔄 Reset Progress
          </button>
        </div>
      </div>

      {/* Success Modal */}
      {completedTopicData && (
        <SuccessModal
          show={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          lessonTitle={completedTopicData.title}
          xpEarned={completedTopicData.xp}
          onContinue={() => {
            setShowSuccessModal(false);
            const nextTopic = TOPICS.find(t => !isCompleted(t.id));
            if (nextTopic) {
              navigate(`/lesson/${nextTopic.id}`);
            }
          }}
          onBackToPath={() => {
            setShowSuccessModal(false);
          }}
        />
      )}
    </div>
  );
}

export default LearningPath;
