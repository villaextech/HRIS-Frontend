import React, { useState } from 'react';
import './Login.css';
import Logo from '../img/Logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? 'http://54.86.62.130:8882/api/login/'
      : 'http://54.86.62.130:8882/api/signup/';

    const data = isLogin
      ? { email, password }
      : {
          full_name: fullName,
          email,
          password,
          role_id:"2"
        };

    try {
      const response = await axios.post(url, data);

      if (response.status === 200 || response.status === 201) {
        console.log(`${isLogin ? 'Login' : 'Signup'} successful`);
        if (isLogin) {
          onLogin();
          navigate('/dashboard');
        } else {
          console.log('Signup successful. Redirecting to login...');
          setIsLogin(true);
          navigate('/login');
        }
      } else {
        setErrorMessage('Unexpected response from the server.');
      }
    } catch (error) {
      console.error(`Error during ${isLogin ? 'login' : 'signup'}:`, error);
      if (error.response && error.response.data) {
        console.error('Server Response:', error.response.data);
        setErrorMessage(error.response.data.message || 'An error occurred.');
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div className="login-background">
      <div className="login-overlay">
        <div className="login-content">
          <img src={Logo} alt="Background" className="login-logo" />
          <h2 className="login-p1">
            Welcome to <span>HR JSI</span>
          </h2>
          <h2 className="login-p2">{isLogin ? 'Login' : 'Signup'}</h2>
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="login-i1"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              className="login-i1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="login-password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="login-i1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="login-password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {errorMessage && (
              <div className="login-error-message">{errorMessage}</div>
            )}
            <div className="login-options">
              <div className="login-remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember Me</label>
              </div>
              <span className="login-forgot-password">Forgot Password?</span>
            </div>
            <button type="submit" className="login-button">
              <span className="login-l1">{isLogin ? 'Login' : 'Signup'}</span>
            </button>
            <button
              type="button"
              className="login-button"
              onClick={() => setIsLogin(!isLogin)}
            >
              <span className="login-l1">
                {isLogin ? 'Switch to Signup' : 'Switch to Login'}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
