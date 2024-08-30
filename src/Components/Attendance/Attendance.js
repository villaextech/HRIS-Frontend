import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import "./Attendance.css"; // Import the CSS file

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://54.86.62.130:8882/api/attendance/");
      setEmployees(response.data);
    } catch (error) {
      setError("Error fetching employees: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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

  const filteredEmployees = employees.filter(employee => {
    const biometricId = employee.biometric_id ? employee.biometric_id.toString() : '';
    const search = searchTerm.toLowerCase() || '';
    return biometricId.includes(search);
  });

  const paginatedEmployees = paginate(filteredEmployees, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3 a1">
          <h4>Attendance</h4> 
          <input
            type="text"
            placeholder="Search by biometric ID"
            value={searchTerm}
            onChange={handleSearch}
            className="form-control search-input1"
          />
        </div>

        {loading && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <table className="table table-striped">
          <thead className="align-middle">
            <tr>
              <th>No</th>
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
                <td>{employee.date}</td>
                <td>{employee.check_in_time}</td>
                <td>{employee.check_out_time}</td>
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
      </div>
    </div>
  );
};

export default Attendance;
