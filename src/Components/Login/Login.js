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
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://54.86.62.130:8882/api/login/', {
        email,
        password
      });

      if (response.status === 200) {
        console.log('Login successful');
        onLogin();
        navigate('/company');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-background">
      <div className="login-overlay">
        <div className="login-content">
          <img src={Logo} alt="Background" className="login-logo" />
          <h2 className='login-p1'>Welcome to <span>HR JSI</span></h2>
          <h2 className='login-p2'>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="login-i1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="login-password-container">
              <input
                type={showPassword ? "text" : "password"}
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
            {errorMessage && <div className="login-error-message">{errorMessage}</div>}
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
              <span className="login-forgot-password">
                Forgot Password?
              </span>
            </div>
            <button type="submit" className="login-button">
              <span className='login-l1'>Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
