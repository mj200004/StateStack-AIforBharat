import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import robotHello from '../assets/robot-hello.png';
import { registerUser, loginUser, saveCurrentUser } from '../utils/api';

function AuthPage({ setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      // Call API to login
      const user = await loginUser(formData.email, formData.password);
      
      // Save user to localStorage
      saveCurrentUser(user);
      
      // Update app state
      const userData = {
        name: user.name,
        email: user.email,
        userId: user.userId,
        isAuthenticated: true
      };
      setUser(userData);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Call API to register
      const user = await registerUser(formData.name, formData.email, formData.password);
      
      // Save user to localStorage
      saveCurrentUser(user);
      
      // Update app state
      const userData = {
        name: user.name,
        email: user.email,
        userId: user.userId,
        isAuthenticated: true
      };
      setUser(userData);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="auth-page">
      <div className={`auth-main-container ${isSignUp ? 'sign-up-mode' : ''}`}>
        <div className="forms-container">
          <div className="signin-signup">
            {/* Sign In Form */}
            <form onSubmit={handleSignIn} className="sign-in-form">
              <div className="form-header">
                <div className="logo-container">
                  <h1 className="main-title">AI Learning Assistant</h1>
                  <img src={robotHello} alt="Hello Robot" className="hello-robot" />
                </div>
                <h2 className="subtitle">Your AI Coding Companion</h2>
                <p className="description">Personalized learning. Smart debugging. Faster growth.</p>
                
              </div>
              
              {error && !isSignUp && <div className="error-msg">{error}</div>}
              
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="input-field password-field">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <i 
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              
              <button type="submit" className="auth-btn solid" disabled={loading}>
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="sign-up-form">
              <div className="form-header">
                <div className="logo-container">
                  <h1 className="main-title">AI Learning Assistant</h1>
                  <img src={robotHello} alt="Hello Robot" className="hello-robot" />
                </div>
                <h2 className="subtitle">Your AI Coding Companion</h2>
                <p className="description">Personalized learning. Smart debugging. Faster growth.</p>
                <p className="tagline">Powered by Intelligent AI Assistance</p>
              </div>
              
              {error && isSignUp && <div className="error-msg">{error}</div>}
              
              <div className="input-field">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="input-field">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="input-field password-field">
                <i className="fas fa-lock"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <i 
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
              
              <button type="submit" className="auth-btn solid" disabled={loading}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          </div>
        </div>

        {/* Toggle Panels */}
        <div className="panels-container">
          <div className="panel left-panel">
            <div className="panel-content">
              <h3>Hello, Friend!</h3>
              <p>Register with your personal details to use all of site features</p>
              <button className="auth-btn transparent" onClick={toggleMode}>
                Sign Up
              </button>
            </div>
          </div>

          <div className="panel right-panel">
            <div className="panel-content">
              <h3>Welcome Back!</h3>
              <p>Enter your personal details to use all of site features</p>
              <button className="auth-btn transparent" onClick={toggleMode}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
