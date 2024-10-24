// Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import 'boxicons/css/boxicons.min.css';
import Logo from '../img/Logo.png';

const Sidebar = ({ setIsAuthenticated, allowedUrls }) => {
  const handleLogout = () => {
    console.log('User logged out');
    setIsAuthenticated(false);
  };

  const isAllowed = (url) => allowedUrls.includes(url);

  const handleDisabledClick = (e) => {
    e.preventDefault();
    alert('You do not have permission to access this page.');
  };

  return (
    <div className="body">
      <nav className="sidebar">
        <header>
          <div className="image-text">
            <span className="image">
              <img src={Logo} alt="Background" />
            </span>
          </div>
        </header>
        <div className="menu-bar">
          <div className="menu">
            <ul className="menu-links ps-0">
              <li>
                <Link
                  to="/dashboard"
                  className={!isAllowed('/dashboard') ? 'disabled' : ''}
                  onClick={!isAllowed('/dashboard') ? handleDisabledClick : undefined}
                >
                  <i className='bx bx-grid-alt icon'></i>
                  <span className="text nav-text">Dashboard</span>
                </Link>
              </li>
              <li className="nav-link has-dropdown ps-0">
                <Link
                  to="/employee"
                  className={!isAllowed('/employee') ? 'disabled' : ''}
                  onClick={!isAllowed('/employee') ? handleDisabledClick : undefined}
                >
                  <i className='bx bx-briefcase icon'></i>
                  <span className="text nav-text">HR</span>
                </Link>
                <ul className="dropdown">
                  <li>
                    <Link
                      to="/employee"
                      className={!isAllowed('/employee') ? 'disabled' : ''}
                      onClick={!isAllowed('/employee') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-user icon'></i>
                      <span className="text nav-text">Employee</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/biometric"
                      className={!isAllowed('/biometric') ? 'disabled' : ''}
                      onClick={!isAllowed('/biometric') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-fingerprint icon'></i>
                      <span className="text nav-text">Biometric</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shift"
                      className={!isAllowed('/shift') ? 'disabled' : ''}
                      onClick={!isAllowed('/shift') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-time-five icon'></i>
                      <span className="text nav-text">Shift</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/leave"
                      className={!isAllowed('/leave') ? 'disabled' : ''}
                      onClick={!isAllowed('/leave') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-calendar icon'></i>
                      <span className="text nav-text">Leave</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wfh"
                      className={!isAllowed('/wfh') ? 'disabled' : ''}
                      onClick={!isAllowed('/wfh') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-home icon'></i> 
                      <span className="text nav-text">WFH</span>
                    </Link>
                  </li>
                </ul>
              </li>


              <li className="nav-link has-dropdown">
                <Link
                  to="/company"
                  className={!isAllowed('/company') ? 'disabled' : ''}
                  onClick={!isAllowed('/company') ? handleDisabledClick : undefined}
                >
                  <i className='bx bx-cog icon'></i>
                  <span className="text nav-text">Settings</span>
                </Link>
                <ul className="dropdown">
                  <li>
                    <Link
                      to="/company"
                      className={!isAllowed('/company') ? 'disabled' : ''}
                      onClick={!isAllowed('/company') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-buildings icon'></i>
                      <span className="text nav-text">Company</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/office"
                      className={!isAllowed('/office') ? 'disabled' : ''}
                      onClick={!isAllowed('/office') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-home-alt icon'></i>
                      <span className="text nav-text">Office</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/department"
                      className={!isAllowed('/department') ? 'disabled' : ''}
                      onClick={!isAllowed('/department') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-building icon'></i>
                      <span className="text nav-text">Department</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/designation"
                      className={!isAllowed('/designation') ? 'disabled' : ''}
                      onClick={!isAllowed('/designation') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-id-card icon'></i>
                      <span className="text nav-text">Designation</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/role"
                      className={!isAllowed('/role') ? 'disabled' : ''}
                      onClick={!isAllowed('/role') ? handleDisabledClick : undefined}
                    >
                      <i className='bx bx-user icon'></i>
                      <span className="text nav-text">Role</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="*" onClick={handleLogout}>
                  <i className='bx bx-log-out icon'></i>
                  <span className="text nav-text">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
