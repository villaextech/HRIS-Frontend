import React, { useState } from 'react';
import Sidebar from './Components/Sidebar/Sidebar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Company from './Components/Company/Company';
import Office from './Components/Office/Addoffice';
import Designation from './Components/Department/Department';
import Department from './Components/Desiganation/Desiganation';
import Role from './Components/Role/Role';
import Login from './Components/Login/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/company" element={isAuthenticated ? <Company /> : <Navigate to="/login" />} />
            <Route path="/office" element={isAuthenticated ? <Office /> : <Navigate to="/login" />} />
            <Route path="/designation" element={isAuthenticated ? <Designation /> : <Navigate to="/login" />} />
            <Route path="/department" element={isAuthenticated ? <Department /> : <Navigate to="/login" />} />
            <Route path="/role" element={isAuthenticated ? <Role /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;   