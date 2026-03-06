import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import { saveChat, getUserChats, deleteChat as deleteChatAPI, getCurrentUser } from '../utils/api';
import './Chat.css';

function Chat({ user, setUser }) {
  const [messages, setMessages] = useState(() => {
    const currentChatId = localStorage.getItem('currentChatId') || 'chat-1';
    const saved = localStorage.getItem(`chat-${currentChatId}`);
    return saved ? JSON.parse(saved) : [
      {
        type: 'ai',
        messageType: 'text',
        text: `Hi ${user?.name}! 👋 I'm your AI Learning Assistant. Ask me anything about programming!`
      }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [summarizing, setSummarizing] = useState(null); // Track which message is being summarized
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(() => localStorage.getItem('currentChatId') || 'chat-1');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('appSettings');
    return saved ? JSON.parse(saved) : {
      theme: 'light',
      fontSize: 'medium',
      soundEnabled: true,
      autoSave: true
    };
  });
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save current chat to localStorage
  useEffect(() => {
    localStorage.setItem(`chat-${currentChatId}`, JSON.stringify(messages));
    localStorage.setItem('currentChatId', currentChatId);
    updateChatHistory();
  }, [messages, currentChatId]);

  // Save settings
  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    document.body.className = settings.theme === 'dark' ? 'dark-theme' : '';
  }, [settings]);

  // Load chat history list from DynamoDB
  const updateChatHistory = async () => {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.userId) {
      try {
        const chats = await getUserChats(currentUser.userId);
        const formattedChats = chats.map(chat => ({
          id: chat.chatId,
          timestamp: chat.timestamp,
          title: chat.title || 'New Chat',
          createdAt: chat.createdAt
        }));
        setChatHistory(formattedChats);
      } catch (err) {
        console.error('Failed to load chat history:', err);
        // Fallback to localStorage
        const chats = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key.startsWith('chat-')) {
            const chatData = JSON.parse(localStorage.getItem(key));
            const firstUserMsg = chatData.find(m => m.type === 'user');
            chats.push({
              id: key.replace('chat-', ''),
              title: firstUserMsg ? firstUserMsg.text.substring(0, 40) + '...' : 'New Chat',
              timestamp: new Date().toISOString()
            });
          }
        }
        setChatHistory(chats.reverse());
      }
    } else {
      // Fallback to localStorage if no user
      const chats = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('chat-')) {
          const chatData = JSON.parse(localStorage.getItem(key));
          const firstUserMsg = chatData.find(m => m.type === 'user');
          chats.push({
            id: key.replace('chat-', ''),
            title: firstUserMsg ? firstUserMsg.text.substring(0, 40) + '...' : 'New Chat',
            timestamp: new Date().toISOString()
          });
        }
      }
      setChatHistory(chats.reverse());
    }
  };

  useEffect(() => {
    updateChatHistory();
    
    // Check for pending question from Debug page
    const pendingQuestion = localStorage.getItem('pendingQuestion');
    if (pendingQuestion) {
      setInput(pendingQuestion);
      localStorage.removeItem('pendingQuestion');
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + ' ' + transcript);
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        setIsRecording(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const startNewChat = () => {
    const newChatId = `chat-${Date.now()}`;
    setCurrentChatId(newChatId);
    const welcomeMsg = {
      type: 'ai',
      messageType: 'text',
      text: `Hi ${user?.name}! 👋 I'm your AI Learning Assistant. Ask me anything about programming!`
    };
    setMessages([welcomeMsg]);
    setSidebarOpen(false);
  };

  const loadChat = (chatId) => {
    const saved = localStorage.getItem(`chat-${chatId}`);
    if (saved) {
      setMessages(JSON.parse(saved));
      setCurrentChatId(chatId);
      setSidebarOpen(false);
    }
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    
    // Find the chat to get its title
    const chat = chatHistory.find(c => c.id === chatId);
    const chatTitle = chat ? chat.title : 'this chat';
    
    if (window.confirm(`Delete "${chatTitle}"?`)) {
      const currentUser = getCurrentUser();
      
      if (currentUser && currentUser.userId && chat && chat.timestamp) {
        try {
          await deleteChatAPI(currentUser.userId, chat.timestamp);
        } catch (err) {
          console.error('Failed to delete chat from DynamoDB:', err);
        }
      }
      
      // Also remove from localStorage
      localStorage.removeItem(`chat-${chatId}`);
      updateChatHistory();
      
      if (currentChatId === chatId) {
        startNewChat();
      }
    }
  };

  const clearAllChats = async () => {
    if (window.confirm('⚠️ Clear all chat history? This cannot be undone.')) {
      const currentUser = getCurrentUser();
      
      // Delete all chats from DynamoDB
      if (currentUser && currentUser.userId && chatHistory.length > 0) {
        try {
          // Delete each chat from DynamoDB
          for (const chat of chatHistory) {
            if (chat.timestamp) {
              await deleteChatAPI(currentUser.userId, chat.timestamp);
            }
          }
        } catch (err) {
          console.error('Failed to delete chats from DynamoDB:', err);
        }
      }
      
      // Clear all chats from localStorage
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('chat-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Start fresh
      startNewChat();
      await updateChatHistory();
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');

    const newUserMessage = { type: 'user', messageType: 'text', text: userMessage };
    setMessages(prev => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();
      console.log('API Response:', data);

      let aiMessage;
      if (data.structured && data.structured.explanation) {
        aiMessage = { 
          type: 'ai',
          messageType: 'structured',
          data: data.structured
        };
      } else {
        aiMessage = { 
          type: 'ai',
          messageType: 'text',
          text: data.error || 'Sorry, I could not process your request.'
        };
      }

      setMessages(prev => {
        const updatedMessages = [...prev, aiMessage];
        
        // Save to DynamoDB after updating messages
        const currentUser = getCurrentUser();
        if (currentUser && currentUser.userId) {
          const title = updatedMessages.find(m => m.type === 'user')?.text?.substring(0, 40) || 'New Chat';
          saveChat(currentUser.userId, currentChatId, updatedMessages, title)
            .catch(err => console.error('Failed to save chat to DynamoDB:', err));
        }
        
        return updatedMessages;
      });

    } catch (error) {
      console.error('Error calling backend:', error);
      setMessages(prev => [...prev, { 
        type: 'ai',
        messageType: 'text',
        text: '❌ Sorry, I could not connect to the backend. Please check your connection.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTopicClick = (topic) => {
    setInput(topic);
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code).then(() => {
      // Show success feedback
      alert('✅ Code copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
      alert('❌ Failed to copy code. Please try selecting and copying manually.');
    });
  };

  const toggleVoiceRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Summarize AI response
  const summarizeResponse = async (messageIndex) => {
    const message = messages[messageIndex];
    if (message.type !== 'ai' || !message.text) return;

    setSummarizing(messageIndex);
    
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: `Summarize this in 3-4 short sentences: ${message.text}` 
        })
      });

      const data = await response.json();
      const summary = data.structured?.explanation || data.structured || 'Could not generate summary';

      // Update the message with summary
      setMessages(prev => prev.map((msg, idx) => 
        idx === messageIndex 
          ? { ...msg, summary, showingSummary: true }
          : msg
      ));
    } catch (error) {
      console.error('Error summarizing:', error);
      alert('Failed to generate summary');
    } finally {
      setSummarizing(null);
    }
  };

  const toggleSummary = (messageIndex) => {
    setMessages(prev => prev.map((msg, idx) => 
      idx === messageIndex 
        ? { ...msg, showingSummary: !msg.showingSummary }
        : msg
    ));
  };

  useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  }, [messages]);

  const renderMessage = (msg) => {
    if (msg.messageType === 'structured' && msg.data) {
      return (
        <div className="structured-response">
          <div className="response-section explanation-section">
            <h4>🧠 Simple Explanation</h4>
            <p>{msg.data.explanation}</p>
          </div>

          <div className="response-section keypoints-section">
            <h4>📌 Key Points</h4>
            <ul>
              {msg.data.keyPoints.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="response-section example-section">
            <div className="example-header">
              <h4>💻 Example</h4>
              <button 
                className="copy-button"
                onClick={(e) => copyToClipboard(msg.data.example)}
                title="Copy code"
              >
                📋 Copy
              </button>
            </div>
            <pre><code className="language-javascript">{msg.data.example}</code></pre>
          </div>

          <div className="response-section nexttopic-section">
            <h4>🚀 Next Suggested Topic</h4>
            <button 
              className="topic-button"
              onClick={() => handleTopicClick(msg.data.nextTopic)}
            >
              {msg.data.nextTopic}
            </button>
          </div>
        </div>
      );
    } else {
      return <div className="message-text">{msg.text}</div>;
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h3>🤖 AI Assistant</h3>
        </div>

        <button className="new-chat-btn" onClick={startNewChat}>
          <span>📝</span> New Chat
        </button>

        <div className="sidebar-section">
          <h4>Chat History</h4>
          <div className="chat-list">
            {chatHistory.length === 0 ? (
              <p className="no-chats">No chat history yet</p>
            ) : (
              chatHistory.map(chat => (
                <div 
                  key={chat.id} 
                  className={`chat-item ${currentChatId === chat.id ? 'active' : ''}`}
                  onClick={() => loadChat(chat.id)}
                >
                  <span className="chat-title">{chat.title}</span>
                  <button 
                    className="delete-chat-btn"
                    onClick={(e) => deleteChat(chat.id, e)}
                    title="Delete chat"
                  >
                    🗑️
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="sidebar-btn" onClick={() => setShowSettings(true)}>
            <span>⚙️</span> Settings
          </button>
          <button className="sidebar-btn logout" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="settings-modal" onClick={() => setShowSettings(false)}>
          <div className="settings-content" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>⚙️ Settings</h3>
              <button onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="settings-body">
              <div className="setting-item">
                <label>Theme</label>
                <select 
                  value={settings.theme} 
                  onChange={(e) => setSettings({...settings, theme: e.target.value})}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Font Size</label>
                <select 
                  value={settings.fontSize} 
                  onChange={(e) => setSettings({...settings, fontSize: e.target.value})}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="setting-item">
                <label>Sound Effects</label>
                <input 
                  type="checkbox" 
                  checked={settings.soundEnabled}
                  onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
                />
              </div>

              <div className="setting-item">
                <label>Auto-save Chats</label>
                <input 
                  type="checkbox" 
                  checked={settings.autoSave}
                  onChange={(e) => setSettings({...settings, autoSave: e.target.checked})}
                />
              </div>
            </div>

            <div className="settings-footer">
              <button className="save-btn" onClick={() => setShowSettings(false)}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="main-chat-area">
        <nav className="navbar">
          <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
          <h2>🤖 AI Learning Assistant</h2>
          <div className="nav-links">
            <button onClick={() => navigate('/dashboard')}>Home</button>
            <button onClick={() => navigate('/debug')}>Debug</button>
            <button onClick={() => navigate('/learning-path')}>Learning Path</button>
          </div>
        </nav>

        <div className="chat-content">
          <div className="messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-avatar">
                  {msg.type === 'user' ? '👤' : '🤖'}
                </div>
                <div className="message-content-wrapper">
                  {msg.showingSummary && msg.summary ? (
                    <div className="message-text summary">{msg.summary}</div>
                  ) : (
                    renderMessage(msg)
                  )}
                  {msg.type === 'ai' && msg.text && (
                    <div className="message-actions">
                      {msg.summary ? (
                        <button 
                          className="action-btn"
                          onClick={() => toggleSummary(index)}
                          title={msg.showingSummary ? "Show full response" : "Show summary"}
                        >
                          {msg.showingSummary ? '📄 Full' : '📝 Summary'}
                        </button>
                      ) : (
                        <button 
                          className="action-btn"
                          onClick={() => summarizeResponse(index)}
                          disabled={summarizing === index}
                          title="Generate summary"
                        >
                          {summarizing === index ? '⏳' : '📝'} Summarize
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="message ai">
                <div className="message-avatar">🤖</div>
                <div className="message-text typing">Thinking...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about programming..."
              rows="3"
              disabled={loading || isRecording}
            />
            <div className="button-group">
              <button 
                className={`voice-button ${isRecording ? 'recording' : ''}`}
                onClick={toggleVoiceRecording}
                disabled={loading}
                title={isRecording ? 'Stop recording' : 'Start voice input'}
              >
                {isRecording ? '🔴' : '🎤'}
              </button>
              <button 
                className="send-button"
                onClick={handleSend} 
                disabled={loading || !input.trim() || isRecording}
              >
                {loading ? '⏳' : '📤'} Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
