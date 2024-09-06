import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import your Sidebar-specific CSS
import 'boxicons/css/boxicons.min.css';
import Logo from '../img/Logo.png';

const Sidebar = ({ setIsAuthenticated }) => {
  const handleLogout = () => {
    console.log('User logged out');
    setIsAuthenticated(false);
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
                <Link to="/dashboard">
                  <i className='bx bx-grid-alt icon'></i>
                  <span className="text nav-text">Dashboard</span>
                </Link>
              </li>
              <li className="nav-link has-dropdown ps-0">
                <Link to="/employee">
                  <i className='bx bx-briefcase icon'></i>
                  <span className="text nav-text">HR</span>
                </Link>
                <ul className="dropdown">
                  <li>
                    <Link to="/employee">
                      <i className='bx bx-user icon'></i>
                      <span className="text nav-text">Employee</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/biometric">
                      <i className='bx bx-fingerprint icon'></i>
                      <span className="text nav-text">Biometric</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/shift">
                      <i className='bx bx-time-five icon'></i> 
                      <span className="text nav-text">Shift</span> 
                    </Link>
                  </li>


                </ul>
              </li>
              <li className="nav-link has-dropdown">
                <Link to="/company">
                  <i className='bx bx-cog icon'></i>
                  <span className="text nav-text">Settings</span>
                </Link>
                <ul className="dropdown">
                  <li>
                    <Link to="/company">
                      <i className='bx bx-buildings icon'></i>
                      <span className="text nav-text">Company</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/office">
                      <i className='bx bx-home-alt icon'></i>
                      <span className="text nav-text">Office</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/department">
                      <i className='bx bx-building icon'></i>
                      <span className="text nav-text">Department</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/designation">
                      <i className='bx bx-id-card icon'></i>
                      <span className="text nav-text">Designation</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/role">
                      <i className='bx bx-user icon'></i> {/* Updated to role-related icon */}
                      <span className="text nav-text">Role</span>
                    </Link>
                  </li>
                </ul>
              </li>
              <li>
                <Link to="*" onClick={handleLogout}>
                  <i className='bx bx-log-out icon' ></i>
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
