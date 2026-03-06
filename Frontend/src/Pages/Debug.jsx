import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/constants';
import './Debug.css';

function Debug({ user, setUser }) {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showFollowupModal, setShowFollowupModal] = useState(false);
  const [followupQuestion, setFollowupQuestion] = useState('');
  const navigate = useNavigate();

  // Load starter code from localStorage if coming from lesson page
  useEffect(() => {
    const starterCode = localStorage.getItem('debugStarterCode');
    if (starterCode) {
      setCode(starterCode);
      // Clear it after loading so it doesn't persist
      localStorage.removeItem('debugStarterCode');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  // Simple syntax error detection - CONSERVATIVE approach
  const detectErrors = (code) => {
    const detectedErrors = [];
    
    // Only detect very obvious issues, don't hallucinate
    // We'll let the AI handle most analysis
    
    // Count total braces in entire code (not per line)
    const openBraces = (code.match(/\{/g) || []).length;
    const closeBraces = (code.match(/\}/g) || []).length;
    const openParens = (code.match(/\(/g) || []).length;
    const closeParens = (code.match(/\)/g) || []).length;
    
    // Only report if there's a clear mismatch in the ENTIRE code
    if (openBraces !== closeBraces) {
      detectedErrors.push({
        line: 0,
        type: 'error',
        message: `Unmatched braces: ${openBraces} opening, ${closeBraces} closing`
      });
    }
    
    if (openParens !== closeParens) {
      detectedErrors.push({
        line: 0,
        type: 'error',
        message: `Unmatched parentheses: ${openParens} opening, ${closeParens} closing`
      });
    }

    setErrors(detectedErrors);
  };

  useEffect(() => {
    if (code) {
      detectErrors(code);
    } else {
      setErrors([]);
    }
  }, [code]);

  const handleAnalyze = async () => {
    if (!code.trim()) {
      setAnalysis({
        type: 'error',
        message: 'Please enter some code to analyze!'
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch(`${API_URL}/debug`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code: code,
          language: language
        })
      });

      const data = await response.json();
      console.log('Debug API Response:', data);
      
      if (data.debug) {
        const debugData = data.debug;
        
        // Check if there are actual errors
        if (debugData.hasError === false) {
          // No errors found - show success state
          setAnalysis({
            type: 'success',
            data: {
              analysis: debugData.analysis || 'Your code looks good! No issues detected.',
              tip: debugData.tip || 'Keep writing clean code!'
            }
          });
        } else {
          // Errors found - show structured debug info
          setAnalysis({
            type: 'structured',
            data: {
              hasError: true,
              issues: debugData.issues || [],
              issue: debugData.analysis || 'Issues detected in your code',
              why: debugData.issues?.map(i => `Line ${i.line}: ${i.message}`) || ['Check the issues above'],
              fixedCode: debugData.fixedCode || code,
              tip: debugData.tip || 'Review the fixes and learn from them'
            }
          });
        }
      } else {
        // Fallback to old chat endpoint behavior
        setAnalysis({
          type: 'error',
          message: 'Unable to analyze code. Please try again.'
        });
      }

    } catch (error) {
      console.error('Error calling backend:', error);
      setAnalysis({
        type: 'error',
        message: 'Could not connect to the backend. Please check your connection.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasteCode = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setCode(text);
        setAnalysis(null);
      }
    } catch (error) {
      // Fallback: just focus the textarea
      alert('Please paste your code directly into the editor (Ctrl+V or Cmd+V)');
    }
  };

  const handleUploadFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.js,.jsx,.py,.java,.cpp,.c,.html,.css';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setCode(event.target.result);
          setAnalysis(null);
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleAskFollowup = () => {
    setShowFollowupModal(true);
  };

  const handleSendFollowup = () => {
    if (!followupQuestion.trim()) return;
    
    // Store context for chat page
    localStorage.setItem('pendingQuestion', `About this code:\n\`\`\`${language}\n${code}\n\`\`\`\n\nQuestion: ${followupQuestion}`);
    
    // Close modal and navigate
    setShowFollowupModal(false);
    setFollowupQuestion('');
    navigate('/chat');
  };

  const handleCloseModal = () => {
    setShowFollowupModal(false);
    setFollowupQuestion('');
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showFollowupModal) {
        handleCloseModal();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [showFollowupModal]);

  const loadExample = (type) => {
    const examples = {
      bug: `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i <= items.length; i++) {
    total += items[i].price;
  }
  return total;
}

const cart = [
  { name: 'Book', price: 10 },
  { name: 'Pen', price: 2 }
];

console.log(calculateTotal(cart));`,
      
      clean: `function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

const cart = [
  { name: 'Book', price: 10 },
  { name: 'Pen', price: 2 }
];

console.log('Total:', calculateTotal(cart));`,

      async: `async function fetchUserData(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();
  return data;
}

fetchUserData(123)
  .then(user => console.log(user))
  .catch(error => console.error(error));`
    };

    setCode(examples[type] || examples.clean);
    setAnalysis(null);
  };

  const clearCode = () => {
    setCode('');
    setAnalysis(null);
    setErrors([]);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    // Show success feedback
    const btn = document.activeElement;
    if (btn && btn.classList.contains('icon-btn')) {
      const originalContent = btn.innerHTML;
      btn.innerHTML = '✅';
      setTimeout(() => {
        btn.innerHTML = originalContent;
      }, 1500);
    }
  };

  // Trigger Prism highlighting
  useEffect(() => {
    if (window.Prism) {
      window.Prism.highlightAll();
    }
  }, [code, analysis]);

  return (
    <div className="debug-container">
      <nav className="navbar">
        <h2>🤖 AI Learning Assistant</h2>
        <div className="nav-links">
          <button onClick={() => navigate('/dashboard')}>Home</button>
          <button onClick={() => navigate('/chat')}>Chat</button>
          <button onClick={() => navigate('/debug')} className="active">Debug</button>
          <button onClick={() => navigate('/learning-path')}>Learning Path</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="debug-content">
        <div className="debug-header">
          <div className="header-content">
            <h1>🐛 AI Code Debugger</h1>
            <p>Paste your code and get instant AI-powered analysis, bug detection, and improvement suggestions</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">{code.split('\n').length}</span>
              <span className="stat-label">Lines</span>
            </div>
            <div className="stat-item">
              <span 
                className="stat-value" 
                style={{
                  color: analysis?.type === 'structured' && analysis?.data?.issues?.length > 0 
                    ? '#ef4444' 
                    : analysis?.type === 'success' 
                    ? '#10b981' 
                    : '#94a3b8'
                }}
              >
                {analysis?.type === 'structured' && analysis?.data?.issues 
                  ? analysis.data.issues.length 
                  : errors.length}
              </span>
              <span className="stat-label">Issues</span>
            </div>
          </div>
        </div>

        <div className="debug-layout">
          {/* Left Panel - Code Editor */}
          <div className="code-panel">
            <div className="panel-header">
              <div className="header-left">
                <span className="panel-title">📝 Code Editor</span>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="language-select"
                >
                  <option value="bash">Bash</option>
                  <option value="c">C</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="css">CSS</option>
                  <option value="go">Go</option>
                  <option value="html">HTML</option>
                  <option value="java">Java</option>
                  <option value="javascript">JavaScript</option>
                  <option value="php">PHP</option>
                  <option value="python">Python</option>
                  <option value="rust">Rust</option>
                  <option value="sql">SQL</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>
              <div className="header-actions">
                <button onClick={copyCode} className="icon-btn" title="Copy code">
                  📋
                </button>
                <button onClick={clearCode} className="icon-btn" title="Clear code">
                  🗑️
                </button>
              </div>
            </div>

            <div className="code-editor-wrapper">
              <div className="line-numbers">
                {code.split('\n').map((_, i) => (
                  <div key={i} className="line-number">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="// Paste your code here...
// Example:
function greet(name) {
  console.log('Hello ' + name);
}
greet('World');"
                className="code-textarea"
                spellCheck="false"
              />
            </div>

            <div className="code-actions">
              <div className="action-buttons-left">
                <button onClick={handlePasteCode} className="action-btn secondary">
                  📋 Paste Code
                </button>
                <button onClick={handleUploadFile} className="action-btn secondary">
                  📁 Upload File
                </button>
              </div>
              <div className="action-buttons-right">
                <button 
                  onClick={handleAnalyze} 
                  disabled={loading || !code.trim()}
                  className="action-btn primary"
                >
                  {loading ? '⏳ Analyzing...' : '🔍 Analyze'}
                </button>
                <button 
                  onClick={handleAskFollowup}
                  disabled={!analysis}
                  className="action-btn secondary"
                >
                  💬 Ask Follow-up
                </button>
              </div>
            </div>

            {/* Example Code Buttons */}
            <div className="example-section">
              <span className="example-label">Quick Examples:</span>
              <div className="example-buttons">
                <button onClick={() => loadExample('bug')} className="example-btn">
                  🐛 Buggy Code
                </button>
                <button onClick={() => loadExample('clean')} className="example-btn">
                  ✨ Clean Code
                </button>
                <button onClick={() => loadExample('async')} className="example-btn">
                  ⚡ Async Example
                </button>
              </div>
            </div>

            {/* Error Panel */}
            {errors.length > 0 && (
              <div className="errors-panel">
                <h4>⚠️ Detected Issues ({errors.length})</h4>
                <div className="errors-list">
                  {errors.map((error, index) => (
                    <div key={index} className={`error-item ${error.type}`}>
                      <span className="error-icon">
                        {error.type === 'error' ? '❌' : error.type === 'warning' ? '⚠️' : '💡'}
                      </span>
                      <div className="error-details">
                        <span className="error-line">Line {error.line}</span>
                        <span className="error-message">{error.message}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Analysis Results */}
          <div className="analysis-panel">
            <div className="panel-header">
              <span className="panel-title">📊 AI Analysis</span>
            </div>

            <div className="analysis-content-wrapper">
              {!analysis && !loading && (
                <div className="empty-state">
                  <div className="empty-icon">🤖</div>
                  <h3>Ready to Analyze Your Code</h3>
                  <p>Paste your code, upload a file, or try an example to get started</p>
                  <div className="features-list">
                    <div className="feature-item">✅ Bug Detection</div>
                    <div className="feature-item">✅ Code Review</div>
                    <div className="feature-item">✅ Best Practices</div>
                    <div className="feature-item">✅ Performance Tips</div>
                  </div>
                  <div className="keyboard-hint">
                    💡 Tip: Use <kbd>Ctrl+V</kbd> to paste code directly into the editor
                  </div>
                </div>
              )}

              {loading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Analyzing your code...</p>
                </div>
              )}

              {/* Success State - No Errors Found */}
              {analysis && analysis.type === 'success' && (
                <div className="success-analysis">
                  <div className="success-icon-large">✅</div>
                  <h3>No Issues Found!</h3>
                  <div className="success-message">
                    <p>{analysis.data.analysis}</p>
                  </div>
                  <div className="debug-section tip-section" style={{marginTop: '2rem'}}>
                    <div className="section-header-debug">
                      <span className="section-icon">🚀</span>
                      <h4>Learning Tip</h4>
                    </div>
                    <div className="section-content">
                      <p>{analysis.data.tip}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State - Issues Found */}
              {analysis && analysis.type === 'structured' && analysis.data.hasError && (
                <div className="structured-analysis-debug">
                  {/* Issue Found Section */}
                  <div className="debug-section issue-section">
                    <div className="section-header-debug">
                      <span className="section-icon">🔴</span>
                      <h4>Issues Found</h4>
                    </div>
                    <div className="section-content">
                      {analysis.data.analysis && (
                        <p style={{marginBottom: '1rem'}}>{analysis.data.analysis}</p>
                      )}
                      
                      {/* Render issues array dynamically */}
                      {analysis.data.issues && analysis.data.issues.length > 0 && (
                        <div className="issues-list-detailed">
                          {analysis.data.issues.map((issue, idx) => (
                            <div key={idx} className="issue-item-detailed">
                              <div className="issue-header">
                                <span className="issue-badge">{issue.type || 'Error'}</span>
                                {issue.line && <span className="issue-line">Line {issue.line}</span>}
                              </div>
                              <div className="issue-message">{issue.message}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Why This Happens Section */}
                  <div className="debug-section why-section">
                    <div className="section-header-debug">
                      <span className="section-icon">💡</span>
                      <h4>Why This Happens</h4>
                    </div>
                    <div className="section-content">
                      {analysis.data.why && analysis.data.why.length > 0 ? (
                        <ul>
                          {Array.isArray(analysis.data.why) ? (
                            analysis.data.why.map((point, idx) => (
                              <li key={idx}>{point}</li>
                            ))
                          ) : (
                            <li>{analysis.data.why}</li>
                          )}
                        </ul>
                      ) : analysis.data.issues && analysis.data.issues.length > 0 ? (
                        <ul>
                          {analysis.data.issues.map((issue, idx) => (
                            <li key={idx}>
                              <strong>{issue.type}:</strong> {issue.message}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p>Check the issues above for details.</p>
                      )}
                    </div>
                  </div>

                  {/* Fixed Code Section - Only show if fixedCode exists and is different */}
                  {analysis.data.fixedCode && analysis.data.fixedCode !== code && (
                    <div className="debug-section fixed-section">
                      <div className="section-header-debug">
                        <span className="section-icon">✅</span>
                        <h4>Fixed Code</h4>
                        <button 
                          className="copy-fixed-btn"
                          onClick={() => {
                            navigator.clipboard.writeText(analysis.data.fixedCode);
                            const btn = document.activeElement;
                            const originalText = btn.textContent;
                            btn.textContent = '✅ Copied!';
                            btn.style.background = 'rgba(72, 187, 120, 0.3)';
                            setTimeout(() => {
                              btn.textContent = originalText;
                              btn.style.background = '';
                            }, 2000);
                          }}
                        >
                          📋 Copy
                        </button>
                      </div>
                      <div className="section-content">
                        <pre><code className="language-javascript">{analysis.data.fixedCode}</code></pre>
                      </div>
                    </div>
                  )}

                  {/* Learning Tip Section */}
                  {analysis.data.tip && (
                    <div className="debug-section tip-section">
                      <div className="section-header-debug">
                        <span className="section-icon">🚀</span>
                        <h4>Learning Tip</h4>
                      </div>
                      <div className="section-content">
                        <p>{analysis.data.tip}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {analysis && analysis.type === 'text' && (
                <div className="text-analysis">
                  <div className="analysis-result">
                    {analysis.message}
                  </div>
                </div>
              )}

              {analysis && analysis.type === 'error' && (
                <div className="error-analysis">
                  <div className="error-icon-large">❌</div>
                  <p>{analysis.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Question Modal */}
      {showFollowupModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✨ Ask a Follow-up About This Code</h3>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            
            <div className="modal-body">
              <p className="modal-context">Regarding your last debug analysis</p>
              <textarea
                value={followupQuestion}
                onChange={(e) => setFollowupQuestion(e.target.value)}
                placeholder="What would you like to understand better about this code?"
                maxLength={300}
                autoFocus
                className="modal-textarea"
              />
              <div className="modal-char-count">
                {followupQuestion.length} / 300 characters
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={handleCloseModal} className="modal-btn secondary">
                Cancel
              </button>
              <button 
                onClick={handleSendFollowup} 
                disabled={!followupQuestion.trim()}
                className="modal-btn primary"
              >
                Send 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Debug;
