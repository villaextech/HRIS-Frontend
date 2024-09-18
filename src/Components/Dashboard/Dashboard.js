import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import "./Dashboard.css"; // Import the CSS file

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/attendance/`);
      setEmployees(response.data);
    } catch (error) {
      setError("Error fetching employees: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (showAttendance) {
      fetchEmployees();
    }
  }, [fetchEmployees, showAttendance]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value || "");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const paginate = (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const filteredEmployees = employees.filter((employee) => {
    const biometricId = employee.biometric_id ? employee.biometric_id.toString().toLowerCase() : '';
    const fullName = employee.employee.full_name.toLowerCase();
    const search = searchTerm.toLowerCase();
    return biometricId.includes(search) || fullName.includes(search);
  });

  const paginatedEmployees = paginate(filteredEmployees, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const formatTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return '';
    const fullDateStr = `${dateStr}T${timeStr}`; // Combine date and time
    const date = new Date(fullDateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="T1">Dashboard</span>
          <div className="d-flex align-items-center">
            <input
              type="text"
              placeholder="Search attendance"
              value={searchTerm}
              onChange={handleSearch}
              className="form-control search-input me-2"
              disabled={!showAttendance} // Disable search when attendance is hidden
            />
            <button
              className="btn add1"
              onClick={() => setShowAttendance((prev) => !prev)}
            >
              {showAttendance ? "Hide Attendance" : "Get Attendance"}
            </button>
          </div>
        </div>

        {loading && showAttendance && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && showAttendance && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {showAttendance && (
          <>
            <table className="table table-striped">
              <thead className="align-middle">
                <tr>
                  <th>No</th>
                  <th>Employee ID</th>
                  <th>Full Name</th>
                  <th>Date</th>
                  <th>Check-In Time</th>
                  <th>Check-Out Time</th>
                  <th>Status</th>
                  <th>Working Hours</th>
                  <th>Late</th>
                  <th>Remarks</th>
                  <th>Biometric ID</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee, index) => (
                  <tr key={employee.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{employee.employee.employee_id}</td>
                    <td>{employee.employee.full_name}</td>
                    <td>{employee.date}</td>
                    <td>{formatTime(employee.date, employee.check_in_time)}</td>
                    <td>{formatTime(employee.date, employee.check_out_time)}</td>
                    <td>{employee.status}</td>
                    <td>{employee.working_hours}</td>
                    <td>{employee.is_late ? 'Yes' : 'No'}</td>
                    <td>{employee.remarks}</td>
                    <td>{employee.biometric_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination-container">
              <button
                className="pagination-button"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                {'<'}
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="pagination-button"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                {'>'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
