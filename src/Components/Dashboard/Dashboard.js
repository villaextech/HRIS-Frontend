import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import "./Dashboard.css"; // Import the CSS file

// Reusable CheckboxDropdown Component
const CheckboxDropdown = ({ label, options, selectedOptions, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionChange = (option) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter((o) => o !== option)
      : [...selectedOptions, option];
    onChange(newSelectedOptions);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="checkbox-dropdown" ref={dropdownRef}>
      <button type="button" className="form-control dropdown-toggle" onClick={toggleDropdown}>
        {selectedOptions.length > 0 ? `${selectedOptions.length} Selected` : label}
      </button>
      {isOpen && (
        <ul className="dropdown-menu show">
          {options.map((option) => (
            <li key={option}>
              <label className="dropdown-item">
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionChange(option)}
                  className="me-2"
                />
                {option}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);

  // States for Filters
  const [selectedEmployeeNames, setSelectedEmployeeNames] = useState([]);
  const [selectedBiometricIds, setSelectedBiometricIds] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  // Date Range State
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  // UseRef for Debounce Timeout
  const debounceTimeoutRef = useRef(null);

  // Fetch Employees Function
  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query parameters based on filters
      const params = {};

      if (startDate) params.start_date = startDate.toISOString().split('T')[0];
      if (endDate) params.end_date = endDate.toISOString().split('T')[0];
      if (selectedStatuses.length > 0) params.status = selectedStatuses;
      if (selectedEmployeeNames.length > 0) params.employee_name = selectedEmployeeNames;
      if (selectedBiometricIds.length > 0) params.biometric_id = selectedBiometricIds;
      if (selectedEmployeeIds.length > 0) params.employee_id = selectedEmployeeIds;

      // Serialize parameters
      const queryString = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          params[key].forEach(value => queryString.append(key, value));
        } else {
          queryString.append(key, params[key]);
        }
      });

      console.log('Fetching employees with params:', queryString.toString());

      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/attendance/filter/?${queryString.toString()}`);
      console.log('API Response:', response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error('Fetch Employees Error:', error);
      setError("Error fetching employees: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [selectedEmployeeNames, selectedBiometricIds, selectedEmployeeIds, startDate, endDate, selectedStatuses]);

  // Debounce Fetch Employees
  useEffect(() => {
    if (showAttendance) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        fetchEmployees();
      }, 500); // 500ms delay

      // Cleanup on unmount or when dependencies change
      return () => clearTimeout(debounceTimeoutRef.current);
    }
  }, [fetchEmployees, showAttendance, selectedEmployeeNames, selectedBiometricIds, selectedEmployeeIds, selectedStatuses, startDate, endDate]);

  // Handle Reset Filters
  const handleResetFilters = () => {
    setSelectedEmployeeNames([]);
    setSelectedBiometricIds([]);
    setSelectedEmployeeIds([]);
    setSelectedStatuses([]);
    setDateRange([null, null]);
    setSearchTerm("");
    setCurrentPage(1);
    if (showAttendance) {
      fetchEmployees();
    }
  };

  // Handle Search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value || "");
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination Handlers
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

  // Paginate Function
  const paginate = (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  // Filter employees based on searchTerm
  const filteredEmployees = employees.filter((employee) => {
    const biometricIdStr = employee.biometric_id ? employee.biometric_id.toString().toLowerCase() : '';
    const fullName = employee.employee.full_name.toLowerCase();
    const search = searchTerm.toLowerCase();
    return biometricIdStr.includes(search) || fullName.includes(search);
  });

  const paginatedEmployees = paginate(filteredEmployees, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  // Format Time Function
  const formatTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return '';
    const fullDateStr = `${dateStr}T${timeStr}`; // Combine date and time
    const date = new Date(fullDateStr);
    if (isNaN(date)) return 'Invalid Date';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  // Extract Unique Options for Dropdowns
  const employeeNamesOptions = Array.from(new Set(employees.map(emp => emp.employee.full_name)));
  const employeeIdsOptions = Array.from(new Set(employees.map(emp => emp.employee.employee_id)));
  const biometricIdsOptions = Array.from(new Set(employees.map(emp => emp.biometric_id)));
  const statusOptions = ["present", "absent", "on_leave"]; // Assuming these are the possible statuses

  return (
    <div className="main">
      <div className="container mt-4">
        {/* Header Section */}
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

        {/* Filters Section */}
        {showAttendance && (
          <div className="filters mb-4">
            <div className="row g-2 align-items-center">
              {/* Employee Name Filter */}
              <div className="col-md-3">
                <CheckboxDropdown
                  label="Employee Name"
                  options={employeeNamesOptions}
                  selectedOptions={selectedEmployeeNames}
                  onChange={setSelectedEmployeeNames}
                />
              </div>

              {/* Employee ID Filter */}
              <div className="col-md-3">
                <CheckboxDropdown
                  label="Employee ID"
                  options={employeeIdsOptions}
                  selectedOptions={selectedEmployeeIds}
                  onChange={setSelectedEmployeeIds}
                />
              </div>

              {/* Biometric ID Filter */}
              <div className="col-md-3">
                <CheckboxDropdown
                  label="Biometric ID"
                  options={biometricIdsOptions}
                  selectedOptions={selectedBiometricIds}
                  onChange={setSelectedBiometricIds}
                />
              </div>

              {/* Status Filter */}
              <div className="col-md-3">
                <CheckboxDropdown
                  label="Status"
                  options={statusOptions}
                  selectedOptions={selectedStatuses}
                  onChange={setSelectedStatuses}
                />
              </div>

              {/* Date Range Picker */}
              <div className="col-md-3">
                <DatePicker
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  isClearable={true}
                  placeholderText="Select Date Range"
                  className="form-control"
                />
              </div>

              {/* Reset Filters Button */}
              <div className="col-md-2">
                <button className="btn btn-secondary w-100" onClick={handleResetFilters}>
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && showAttendance && (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && showAttendance && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Attendance Table */}
        {showAttendance && !loading && !error && (
          <>
            {filteredEmployees.length > 0 ? (
              <div className="table-responsive">
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
              </div>
            ) : (
              <div className="alert alert-info" role="alert">
                No attendance records found.
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container d-flex justify-content-center mt-3">
                <button
                  className="pagination-button btn btn-outline-primary me-2"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  {'<'}
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`pagination-button btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => handlePageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  className="pagination-button btn btn-outline-primary"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  {'>'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
