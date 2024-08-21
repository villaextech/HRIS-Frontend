import React, { useState } from 'react';
import './Login.css';
import Logo from '../img/Logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios'; // If using axios
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();    
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login/', {
        email,
        password
      });

      if (response.status === 200) {
        console.log('Login successful');
        onLogin(); // Notify parent component about the login
        navigate('/company'); // Redirect to /company
      }   
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Invalid email or password. Please try again.'); // Set error message
    }
  };

  return (
    <div className="background">
      <div className="overlay">
        <div className="content">
          <img src={Logo} alt="Background" className="Logo" />
          <h2 className='p1'>Welcome to <span>HR JSI</span></h2>
          <h2 className='p2'>Login</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="i1"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="i1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Render error message */}
            <div className="options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe">Remember Me </label>
              </div>
              <span className="forgot-password">
                Forgot Password?
              </span>
            </div>
            <button type="submit" className="login-button">
              <span className='l1'>Login</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
