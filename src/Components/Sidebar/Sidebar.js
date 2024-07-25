import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Import your Sidebar-specific CSS
import 'boxicons/css/boxicons.min.css';

const Sidebar = () => {
  const [isSidebarClosed, setSidebarClosed] = useState(true);

  const handleToggleClick = () => {
    setSidebarClosed(!isSidebarClosed);
  };

  const handleSearchClick = () => {
    setSidebarClosed(false);
  };

  return (
    <div className="body">
      <nav className={`sidebar ${isSidebarClosed ? 'close' : ''}`}>
        <header>
          <div className="image-text">
            <span className="image">
              <img src={process.env.PUBLIC_URL + "/img/logo.jpg"} alt="Logo" />
            </span>
            <div className="text logo-text">
              <span className="name">Villaex</span>
              <span className="profession">Technologies</span>
            </div>
          </div>
          <i className='bx bx-chevron-right toggle' onClick={handleToggleClick}></i>
        </header>

        <div className="menu-bar">
          <div className="menu">
            <li className="search-box" onClick={handleSearchClick}>
              <i className='bx bx-search icon'></i>
              <input type="text" placeholder="Search..." />
            </li>

            <ul className="menu-links">

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
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
