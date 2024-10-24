// App.js
import React, { useState } from 'react';
import Sidebar from './Components/Sidebar/Sidebar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Company from './Components/Company/Company';
import Office from './Components/Office/Addoffice';
import Designation from './Components/Desiganation/Desiganation';
import Department from './Components/Department/Department';
import Employee from './Components/Employee/Employee';
import Attendance from './Components/Attendance/Attendance';
import Biometric from './Components/Biometric/Biometric';
import Dashboard from './Components/Dashboard/Dashboard';
import Aleave from './Components/Apply leave/Aleave';
import Role from './Components/Role/Role';
import Workhome from './Components/Workhome/Workhome';
import Shift from './Components/Shift/Shift';
import Login from './Components/Login/Login';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allowedUrls, setAllowedUrls] = useState([]);

  const handleLogin = (urls) => {
    setIsAuthenticated(true);
    setAllowedUrls(urls);
  };

  const isAuthorized = (url) => allowedUrls.includes(url);

  return (
    <Router>
      <div className="app">
        {isAuthenticated && <Sidebar setIsAuthenticated={setIsAuthenticated} allowedUrls={allowedUrls} />}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/company" element={isAuthenticated && isAuthorized('/company') ? <Company /> : <Navigate to="/login" />} />
            <Route path="/office" element={isAuthenticated && isAuthorized('/office') ? <Office /> : <Navigate to="/login" />} />
            <Route path="/designation" element={isAuthenticated && isAuthorized('/designation') ? <Designation /> : <Navigate to="/login" />} />
            <Route path="/department" element={isAuthenticated && isAuthorized('/department') ? <Department /> : <Navigate to="/login" />} />
            <Route path="/role" element={isAuthenticated && isAuthorized('/role') ? <Role /> : <Navigate to="/login" />} />
            <Route path="/employee" element={isAuthenticated && isAuthorized('/employee') ? <Employee /> : <Navigate to="/login" />} />
            <Route path="/attendance" element={isAuthenticated && isAuthorized('/attendance') ? <Attendance /> : <Navigate to="/login" />} />
            <Route path="/biometric" element={isAuthenticated && isAuthorized('/biometric') ? <Biometric /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={isAuthenticated && isAuthorized('/dashboard') ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/shift" element={isAuthenticated && isAuthorized('/shift') ? <Shift /> : <Navigate to="/login" />} />
            <Route path="/wfh" element={isAuthenticated && isAuthorized('/wfh') ? <Workhome /> : <Navigate to="/login" />} />
            <Route path="/leave" element={isAuthenticated && isAuthorized('/leave') ? <Aleave /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
