import React, { useState, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Workhome.css"; // Make sure you have the relevant styles.

const Workhome = () => {
  const [formData, setFormData] = useState({
    employee: "",
    date: "",
    checkin: "",
    checkout: "",
    reason: "",
    status: "Pending",
  });

  const [isCheckinFocused, setIsCheckinFocused] = useState(false);
  const [isCheckoutFocused, setIsCheckoutFocused] = useState(false);
  const [workFromHomeRecords, setWorkFromHomeRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFormPopup, setShowFormPopup] = useState(false);

  // Fetch work from home records from the backend
  const fetchWorkFromHomeRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/work-from-home/`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setWorkFromHomeRecords(data);
    } catch (error) {
      setError("Error fetching records: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/work-from-home/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      // Fetch updated records after applying new work from home entry
      fetchWorkFromHomeRecords();

      // Reset form after successful submission
      setFormData({
        employee: "",
        date: "",
        checkin: "",
        checkout: "",
        reason: "",
        status: "Pending",
      });
      setShowFormPopup(false);
    } catch (error) {
      setError("Error applying for work from home: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openForm = () => {
    setFormData({
      employee: "",
      date: "",
      checkin: "",
      checkout: "",
      reason: "",
      status: "Pending",
    });
    setShowFormPopup(true);
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="T1">Work From Home Records</span>
            <button className="btn add1" onClick={openForm}>
              Apply Work From Home
            </button>
          </div>
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

        {/* Display the work from home records in a table */}
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Employee Name</th>
                <th scope="col">Date</th>
                <th scope="col">Check-in Time</th>
                <th scope="col">Check-out Time</th>
                <th scope="col">Reason</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {workFromHomeRecords.length > 0 ? (
                workFromHomeRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.employee}</td>
                    <td>{record.date}</td>
                    <td>{record.checkin}</td>
                    <td>{record.checkout}</td>
                    <td>{record.reason}</td>
                    <td>{record.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {showFormPopup && (
          <div className="modal show" style={{ display: "block"}}>
            <div className="modal-dialog">
              <div className="modal-content"  style={{ height: "350px" }}>
                <div className="modal-header">
                  <h5 className="modal-title">Submit Attendance</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormPopup(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    {/* Employee Name */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          name="employee"
                          value={formData.employee}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Employee Name"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Select Date"
                          required
                        />
                      </div>
                    </div>

                    {/* Check-in and Check-out */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type={isCheckinFocused ? "time" : "text"}
                          name="checkin"
                          value={formData.checkin}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Check-in Time"
                          required
                          onFocus={() => setIsCheckinFocused(true)}
                          onBlur={() => setIsCheckinFocused(false)}
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type={isCheckoutFocused ? "time" : "text"}
                          name="checkout"
                          value={formData.checkout}
                          onChange={handleChange}
                          className="form-control"
                          placeholder="Check-out Time"
                          required
                          onFocus={() => setIsCheckoutFocused(true)}
                          onBlur={() => setIsCheckoutFocused(false)}
                        />
                      </div>
                    </div>

                    {/* Reason and Status */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <textarea
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          placeholder="Reason"
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="col-md-6">
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="form-control"
                          required
                        >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                          backgroundColor: '#3B8682',
                          borderColor: '#3B8682',
                          marginRight: '70px',
                        }}
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

export default Workhome;
