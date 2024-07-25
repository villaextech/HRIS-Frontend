import React from 'react'
import Sidebar from './Components/Sidebar/Sidebar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Company from './Components/Company/Company';
import Office from './Components/Office/Addoffice';
import Designation from './Components/Department/Department';
import Department from './Components/Desiganation/Desiganation';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/company" element={<Company />} />
            <Route path="/office" element={<Office/>} />
            <Route path="/designation" element={<Designation />} />
            <Route path="/department" element={<Department />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};
export default App
