import React, { useState } from 'react';
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
              <li className="nav-link">
                <a href="/dashboard">
                  <i className='bx bx-home-alt icon'></i>
                  <span className="text nav-text">Dashboard</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="/company">
                  <i className='bx bx-bar-chart-alt-2 icon'></i>
                  <span className="text nav-text">Company</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="/department">
                  <i className='bx bx-wallet icon'></i>
                  <span className="text nav-text">Department</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="/notifications">
                  <i className='bx bx-bell icon'></i>
                  <span className="text nav-text">Notifications</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="/analytics">
                  <i className='bx bx-pie-chart-alt icon'></i>
                  <span className="text nav-text">Analytics</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="/likes">
                  <i className='bx bx-heart icon'></i>
                  <span className="text nav-text">Likes</span>
                </a>
              </li>
              <li className="nav-link">
                <a href="/settings">
                  <i className='bx bx-cog icon'></i>
                  <span className="text nav-text">Settings</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
