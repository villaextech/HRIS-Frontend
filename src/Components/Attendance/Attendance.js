import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import "./Attendance.css"; // Import the CSS file

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(false);
  const [isCheckInFocused, setIsCheckInFocused] = useState(false);
  const [isCheckOutFocused, setIsCheckOutFocused] = useState(false);
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false); // State to control showing attendance
  const [showFormPopup, setShowFormPopup] = useState(false); // State to control manual attendance form popup

  // State for handling form data
  const [formData, setFormData] = useState({
    employee_id: "",
    full_name: "",
    attendance_date: "",
    check_in_time: "",
    check_out_time: "",
    status: "Present",
    working_hours: "",
    remarks: "",
    is_late: false,
    biometric_id: ""
  });

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

  const openManualAttendanceForm = () => {
    setShowFormPopup(true);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform the form submission logic here
    console.log(formData); // For testing purpose
    setShowFormPopup(false); // Close form popup on submit
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="T1">Attendance</span>
          <div className="d-flex align-items-center">
            <input
              type="text"
              placeholder="Search attendance"
              value={searchTerm}
              onChange={handleSearch}
              className="form-control search-input me-2"
              disabled={!showAttendance} // Disable search when attendance is hidden
            />
            <button className="btn add1 me-2" onClick={openManualAttendanceForm}>
              Add Manual Attendance
            </button>
            <button
              className="btn add1"
              onClick={() => setShowAttendance((prev) => !prev)}
            >
              {showAttendance ? "Hide Attendance" : "Show Attendance"}
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
                    <td>{new Date(employee.check_in_time).toLocaleTimeString()}</td>
                    <td>{new Date(employee.check_out_time).toLocaleTimeString()}</td>
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

        {showFormPopup && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content c1">
                <div className="modal-header">
                  <h5 className="modal-title">Add Attendance</h5>
                  <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
                </div>
                <div className="modal-body c2">
                  <form onSubmit={handleSubmit}>
                    {/* Row 1: Employee ID and Full Name */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="employee_id"
                          name="employee_id"
                          placeholder="Employee ID"
                          value={formData.employee_id}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="full_name"
                          name="full_name"
                          placeholder="Full Name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>

                    {/* Row 2: Date and Check-in Time */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type={isFocused ? 'date' : 'text'}
                          id="date"
                          name="date"
                          placeholder="Date"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          className="form-control custom-date-input"
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type={isCheckInFocused ? 'time' : 'text'}
                          id="check_in_time"
                          name="check_in_time"
                          placeholder="Check-In Time"
                          value={formData.check_in_time}
                          onChange={handleChange}
                          required
                          className="form-control custom-time-input"
                          onFocus={() => setIsCheckInFocused(true)}
                          onBlur={() => setIsCheckInFocused(false)}
                        />
                      </div>
                    </div>

                    {/* Row 3: Check-out Time and Working Hours */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type={isCheckOutFocused ? 'time' : 'text'}
                          id="check_out_time"
                          name="check_out_time"
                          placeholder="Check-Out Time"
                          value={formData.check_out_time}
                          onChange={handleChange}
                          required
                          className="form-control custom-time-input"
                          onFocus={() => setIsCheckOutFocused(true)}
                          onBlur={() => setIsCheckOutFocused(false)}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="number"
                          id="working_hours"
                          name="working_hours"
                          placeholder="Working Hours"
                          value={formData.working_hours}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>

                    {/* Row 4: Status and Late */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="form-control"
                          required
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="On Leave">On Leave</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <select
                          id="is_late"
                          name="is_late"
                          value={formData.is_late ? 'Yes' : 'No'}
                          onChange={handleChange}
                          className="form-control"
                          required
                        >
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 5: Remarks and Biometric ID */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="remarks"
                          name="remarks"
                          placeholder="Remarks"
                          value={formData.remarks}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="biometric_id"
                          name="biometric_id"
                          placeholder="Biometric ID"
                          value={formData.biometric_id}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ backgroundColor: '#3B8682', borderColor: '#3B8682', marginRight: '70px' }}
                      >
                        Submit
                      </button>
                    </div>

                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
