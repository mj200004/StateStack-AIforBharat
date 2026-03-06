import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './PublicLanding.css';
import robotLogo from '../assets/robot-logo.png';

function PublicLanding() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="public-landing">
      {/* STICKY NAVBAR */}
      <nav className={`landing-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <img src={robotLogo} alt="AI Robot" className="logo-icon" />
            <span className="logo-text">AI Learning Assistant</span>
          </div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => scrollToSection('features')}>Features</button>
            <button className="nav-link" onClick={() => scrollToSection('how-it-works')}>How It Works</button>
            <button className="nav-link" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-btn-primary" onClick={() => navigate('/login')}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* SECTION 1: HERO */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="badge-icon">✨</span>
              <span>AI-Powered Learning Platform</span>
            </div>
            
            <h1 className="hero-title">AI Learning Assistant</h1>
            <h2 className="hero-subtitle">Your Personalized AI Coding Coach</h2>
            
            <p className="hero-description">
              Learn concepts. Debug errors. Track progress. Powered by intelligent AI guidance.
            </p>
            
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/login')}>
                <span>🚀 Get Started</span>
              </button>
              <button className="btn-secondary" onClick={() => scrollToSection('how-it-works')}>
                <span>🔍 See How It Works</span>
              </button>
            </div>
          </div>

          <div className="hero-right">
            <div className="chat-mock-card">
              <div className="mock-header">
                <div className="mock-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="mock-title">AI Chat</span>
              </div>
              <div className="mock-content">
                <div className="user-message">
                  <div className="message-bubble user">
                    What are variables in JavaScript?
                  </div>
                </div>
                <div className="ai-message">
                  <div className="message-bubble ai">
                    <div className="ai-section">
                      <strong>🧠 Simple Explanation</strong>
                      <p>Variables are containers that store data...</p>
                    </div>
                    <div className="ai-section">
                      <strong>💻 Example</strong>
                      <div className="code-preview">
                        <code>let name = "John";</code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Background */}
        <div className="hero-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </section>

      {/* SECTION 2: SMART AI CHAT */}
      <section id="how-it-works" className="feature-detail-section">
        <div className="feature-detail-container">
          <div className="feature-detail-left">
            <h2>💬 Learn Like You're Talking to a Mentor</h2>
            <p className="feature-description">
              Our AI Chat doesn't just answer questions—it teaches you. Get structured 
              explanations, real code examples, and smart suggestions for what to learn next.
            </p>
            <ul className="feature-list-detailed">
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Structured Explanations</strong>
                  <p>Break down complex concepts into simple, digestible pieces</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Code Examples</strong>
                  <p>See real working code with syntax highlighting</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Voice Input Support</strong>
                  <p>Ask questions hands-free while coding</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Suggested Next Topics</strong>
                  <p>AI recommends what to learn based on your progress</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="feature-detail-right">
            <div className="feature-mock-card">
              <div className="chat-interface-mock">
                <div className="chat-message user-msg">
                  <div className="msg-avatar">👤</div>
                  <div className="msg-content">How do I use async/await?</div>
                </div>
                <div className="chat-message ai-msg">
                  <div className="msg-avatar">🤖</div>
                  <div className="msg-content">
                    <div className="response-section blue">
                      <strong>🧠 Simple Explanation</strong>
                      <p>Async/await makes asynchronous code look synchronous...</p>
                    </div>
                    <div className="response-section yellow">
                      <strong>📌 Key Points</strong>
                      <ul>
                        <li>Use async before function</li>
                        <li>Use await before promises</li>
                      </ul>
                    </div>
                    <div className="response-section dark">
                      <strong>💻 Example</strong>
                      <code>async function getData() {'{'}...{'}'}</code>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CODE DEBUG ASSISTANT */}
      <section className="feature-detail-section alt-bg">
        <div className="feature-detail-container reverse">
          <div className="feature-detail-left">
            <div className="feature-mock-card">
              <div className="debug-interface-mock">
                <div className="debug-header">
                  <span className="debug-lang">JavaScript</span>
                  <button className="debug-btn">🔍 Analyze</button>
                </div>
                <div className="debug-code">
                  <div className="code-line">
                    <span className="line-num">1</span>
                    <code>let x = 5</code>
                    <span className="error-indicator">⚠️</span>
                  </div>
                  <div className="code-line">
                    <span className="line-num">2</span>
                    <code>console.log(x))</code>
                    <span className="error-indicator">❌</span>
                  </div>
                </div>
                <div className="debug-result">
                  <div className="result-section red">
                    <strong>🔴 Issue Found</strong>
                    <p>Extra closing parenthesis</p>
                  </div>
                  <div className="result-section green">
                    <strong>✅ Fixed Code</strong>
                    <code>console.log(x)</code>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="feature-detail-right">
            <h2>🛠 Fix Bugs Instantly</h2>
            <p className="feature-description">
              Paste your buggy code and get instant analysis. Our AI identifies errors, 
              explains why they happen, provides fixed code, and includes learning tips.
            </p>
            <ul className="feature-list-detailed">
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Detect Errors</strong>
                  <p>Real-time analysis of syntax and logic issues</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Explain Root Cause</strong>
                  <p>Understand why the error happened</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Provide Fixed Code</strong>
                  <p>Get corrected code you can copy immediately</p>
                </div>
              </li>
              <li>
                <span className="check-icon">✓</span>
                <div>
                  <strong>Give Learning Tips</strong>
                  <p>Learn best practices to avoid future mistakes</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 4: AI ADAPTIVE LEARNING PATH */}
      <section className="feature-detail-section">
        <div className="feature-detail-container centered">
          <div className="section-header-centered">
            <h2>📈 Personalized Learning Roadmap</h2>
            <p>Track your progress and let AI guide your learning journey</p>
          </div>

          <div className="learning-path-showcase">
            <div className="progress-showcase">
              <div className="progress-header">
                <span className="progress-label">🚀 Beginner → Intermediate</span>
                <span className="progress-percent">65% Complete</span>
              </div>
              <div className="progress-bar-showcase">
                <div className="progress-fill-showcase" style={{ width: '65%' }}></div>
              </div>
              <p className="progress-stats">13 / 20 Topics Finished</p>
            </div>

            <div className="path-cards">
              <div className="path-card completed">
                <div className="card-icon">✅</div>
                <h4>Completed Topics</h4>
                <ul>
                  <li>Variables & Data Types</li>
                  <li>Functions & Parameters</li>
                  <li>Arrays & Objects</li>
                </ul>
              </div>

              <div className="path-card recommended">
                <div className="card-icon">🎯</div>
                <h4>AI Recommended Next</h4>
                <div className="priority-badge high">High Priority</div>
                <p className="card-title">REST APIs & HTTP Requests</p>
                <p className="card-reason">
                  <strong>💡 Why AI recommends this:</strong><br/>
                  You already understand objects, so APIs are the natural next step.
                </p>
                <button className="card-btn" onClick={() => navigate('/login')}>Start Learning →</button>
              </div>

              <div className="path-card locked">
                <div className="card-icon">🔒</div>
                <h4>Locked Topics</h4>
                <ul>
                  <li>Async & Promises</li>
                  <li>Authentication & JWT</li>
                  <li>System Design Basics</li>
                </ul>
                <p className="unlock-text">Unlock at 70% progress</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY WE ARE DIFFERENT */}
      <section id="features" className="comparison-section">
        <div className="comparison-container">
          <h2>🧠 Why Not Just Use Generic AI?</h2>
          <p className="comparison-subtitle">
            We're not just another chatbot. We're a complete learning system.
          </p>

          <div className="comparison-table">
            <div className="comparison-column generic">
              <div className="column-header">
                <h3>Generic AI Tools</h3>
                <p>(ChatGPT, Claude, etc.)</p>
              </div>
              <ul className="comparison-list">
                <li>
                  <span className="icon-cross">✗</span>
                  <span>One-time answers</span>
                </li>
                <li>
                  <span className="icon-cross">✗</span>
                  <span>No progress tracking</span>
                </li>
                <li>
                  <span className="icon-cross">✗</span>
                  <span>No learning roadmap</span>
                </li>
                <li>
                  <span className="icon-cross">✗</span>
                  <span>No skill analysis</span>
                </li>
                <li>
                  <span className="icon-cross">✗</span>
                  <span>Generic responses</span>
                </li>
                <li>
                  <span className="icon-cross">✗</span>
                  <span>No gamification</span>
                </li>
              </ul>
            </div>

            <div className="comparison-column ours">
              <div className="column-header featured">
                <h3>AI Learning Assistant</h3>
                <p>(This Platform)</p>
                <span className="badge-featured">✨ Recommended</span>
              </div>
              <ul className="comparison-list">
                <li>
                  <span className="icon-check">✓</span>
                  <span>Structured learning system</span>
                </li>
                <li>
                  <span className="icon-check">✓</span>
                  <span>Tracks all your progress</span>
                </li>
                <li>
                  <span className="icon-check">✓</span>
                  <span>Builds adaptive roadmap</span>
                </li>
                <li>
                  <span className="icon-check">✓</span>
                  <span>Detects weak areas</span>
                </li>
                <li>
                  <span className="icon-check">✓</span>
                  <span>Personalized responses</span>
                </li>
                <li>
                  <span className="icon-check">✓</span>
                  <span>XP, levels, and streaks</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION - Quizlet Style */}
      <section className="benefits-section">
        <div className="benefits-container">
          <div className="benefits-left">
            <div className="benefits-image-placeholder">
              <div className="student-illustration">
                <div className="illustration-bg">
                  <div className="emoji-wrapper">
                    <span className="student-emoji">👨‍💻</span>
                  </div>
                  <div className="orbit-container">
                    <div className="floating-card card-1">
                      <span>✓ Variables</span>
                    </div>
                    <div className="floating-card card-2">
                      <span>✓ Arrays</span>
                    </div>
                    <div className="floating-card card-3">
                      <span>✓ Functions</span>
                    </div>
                    <div className="floating-card card-4">
                      <span>✓ Loops</span>
                    </div>
                    <div className="floating-card card-5">
                      <span>✓ Objects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="benefits-right">
            <div className="benefits-badge">AI LEARNING ASSISTANT</div>
            <h2>The fastest way to better coding skills</h2>
            <p className="benefits-intro">
              Get complete access to powerful study tools that help you learn faster, 
              remember longer, and stay locked in.
            </p>

            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">📚</div>
                <div className="benefit-content">
                  <h4>100% ad-free</h4>
                  <p>Stay focused and consistent while studying—no ads, no interruptions</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">🎯</div>
                <div className="benefit-content">
                  <h4>All premium study modes</h4>
                  <p>Practice smarter with tools that make learning faster and stick longer</p>
                </div>
              </div>

              <div className="benefit-item">
                <div className="benefit-icon">📸</div>
                <div className="benefit-content">
                  <h4>Create your way</h4>
                  <p>Make and customize flashcard sets for your classes, exams, and goals</p>
                </div>
              </div>
            </div>

            <button className="benefits-cta-btn" onClick={() => navigate('/login')}>
              Try it free
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 6: GAMIFICATION */}
      <section className="gamification-section">
        <div className="gamification-container">
          <h2>🎮 Turn Learning Into Progress</h2>
          <p className="section-subtitle">
            Stay motivated with streaks, levels, and achievements
          </p>

          <div className="gamification-grid">
            <div className="gamification-card">
              <div className="gamification-icon">🔥</div>
              <h3>Learning Streak</h3>
              <div className="gamification-value">7 Days</div>
              <p>Keep your streak alive by learning every day</p>
            </div>

            <div className="gamification-card">
              <div className="gamification-icon">🏆</div>
              <h3>Level & XP</h3>
              <div className="gamification-value">Level 3</div>
              <div className="xp-bar-small">
                <div className="xp-fill-small" style={{ width: '60%' }}></div>
              </div>
              <p>340 / 500 XP to next level</p>
            </div>

            <div className="gamification-card">
              <div className="gamification-icon">📊</div>
              <h3>Skill Progress</h3>
              <div className="skill-bars">
                <div className="skill-item">
                  <span>JavaScript</span>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="skill-item">
                  <span>Python</span>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="gamification-card">
              <div className="gamification-icon">🎯</div>
              <h3>Achievements</h3>
              <div className="badges-showcase">
                <span className="badge-item">🥇 First Topic</span>
                <span className="badge-item">⚡ 5 Day Streak</span>
                <span className="badge-item">🚀 10 Topics</span>
              </div>
              <p>Unlock badges as you progress</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section className="final-cta-section">
        <div className="final-cta-content">
          <h2>Ready to Become a Better Developer?</h2>
          <p>Join thousands of learners mastering programming with AI-powered guidance</p>
          <button className="cta-button-large" onClick={() => navigate('/login')}>
            <span>🚀 Start Learning Now</span>
          </button>
          <p className="cta-note">Free forever • No credit card required • Start in 30 seconds</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <img src={robotLogo} alt="AI Robot" className="logo-icon" />
              <span className="logo-text">AI Learning Assistant</span>
            </div>
            <p className="footer-tagline">
              Your personalized AI coding coach for mastering programming
            </p>
          </div>
          <div className="footer-right">
            <div className="footer-section">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#" onClick={() => navigate('/login')}>Get Started</a>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">Tutorials</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 AI Learning Assistant. Built with ❤️ by Team StateStack.</p>
        </div>
      </footer>
    </div>
  );
}

export default PublicLanding;
