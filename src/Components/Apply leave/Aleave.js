import React, { useState, useCallback, useEffect } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Aleave.css"; // Ensure you have the relevant styles.

const Aleave = () => {
  const [formData, setFormData] = useState({
    leave_type: "",
    leave_duration: "Full Day",
    leave_days: 0,
    start_date: "",
    end_date: "",
    reason: "",
    attachment: null,
    status: "Pending",
    approver: "",
  });

  const [leaves, setLeaves] = useState([]);
  const [names, setNames] = useState([]); // New state for names
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [isStartDateFocused, setIsStartDateFocused] = useState(false);
  const [isEndDateFocused, setIsEndDateFocused] = useState(false);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [isTimeFocused, setIsTimeFocused] = useState(false);

  // Fetch leave records
  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/leaves/`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setLeaves(data);
    } catch (error) {
      setError("Error fetching leave records: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch names for approver
  const fetchNames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/names/`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setNames(data); // Assuming data is an array of names
    } catch (error) {
      setError("Error fetching names: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
    fetchNames();
  }, [fetchLeaves, fetchNames]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/leaves/`, {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) throw new Error("Network response was not ok");
      fetchLeaves();

      // Reset form data
      setFormData({
        leave_type: "",
        leave_duration: "Full Day",
        leave_days: 0,
        start_date: "",
        end_date: "",
        reason: "",
        attachment: null,
        status: "Pending",
        approver: "",
      });
      setShowFormPopup(false);
    } catch (error) {
      setError("Error applying for leave: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openForm = () => {
    setShowFormPopup(true);
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="T1">Leave Records</span>
            <button className="btn add1" onClick={openForm}>
              Apply Leave
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

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">Leave Type</th>
                <th scope="col">Leave Duration</th>
                <th scope="col">Leave Days</th>
                <th scope="col">Start Date</th>
                <th scope="col">End Date</th>
                <th scope="col">Status</th>
                <th scope="col">Approver</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.leave_type}</td>
                    <td>{leave.leave_duration}</td>
                    <td>{leave.leave_days}</td>
                    <td>{leave.start_date}</td>
                    <td>{leave.end_date}</td>
                    <td>{leave.status}</td>
                    <td>{leave.approver}</td>
                  </tr>
                ))
              ) : null}
            </tbody>

          </table>
        </div>

        {showFormPopup && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content" style={{ height: "400px" }}>
                <div className="modal-header">
                  <h5 className="modal-title">Apply for Leave</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormPopup(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <select
                          name="leave_type"
                          value={formData.leave_type}
                          onChange={handleChange}
                          className="form-control"
                          required
                        >
                          <option value="">Select Leave Type</option>
                          <option value="Casual Leave">Casual Leave</option>
                          <option value="Medical Leave">Medical Leave</option>
                        </select>
                      </div>
                    </div>

                    <div className="row mb-3">
                      <div className="col-md-12">
                        <div className="radio-group">
                          <div className="radio-item">
                            <label>
                              <input
                                type="radio"
                                name="leave_duration"
                                value="Full Day"
                                checked={formData.leave_duration === "Full Day"}
                                onChange={handleChange}
                              />
                              Full Day
                            </label>
                          </div>
                          <div className="radio-item">
                            <label>
                              <input
                                type="radio"
                                name="leave_duration"
                                value="Half Day"
                                checked={formData.leave_duration === "Half Day"}
                                onChange={handleChange}
                              />
                              Half Day
                            </label>
                          </div>
                          <div className="radio-item">
                            <label>
                              <input
                                type="radio"
                                name="leave_duration"
                                value="Multiple Days"
                                checked={formData.leave_duration === "Multiple Days"}
                                onChange={handleChange}
                              />
                              Multiple Days
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    {formData.leave_duration === "Full Day" && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type={isStartDateFocused ? 'date' : 'text'}
                            name="start_date"
                            placeholder="Start Date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="form-control"
                            required
                            onFocus={() => setIsStartDateFocused(true)}
                            onBlur={() => setIsStartDateFocused(false)}
                          />
                        </div>
                        <div className="col-md-6">
                          <select
                            name="approver"
                            value={formData.approver}
                            onChange={handleChange}
                            className="form-control"
                            required
                          >
                            <option value="">Select Approver</option>
                            {names.map((name) => (
                              <option key={name.id} value={name.name}>
                                {name.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {formData.leave_duration === "Half Day" && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type={isDateFocused ? "date" : "text"}
                            name="start_date"
                            value={formData.start_date.split('T')[0]}
                            onChange={handleChange}
                            className="form-control"
                            required
                            placeholder="Date"
                            onFocus={() => setIsDateFocused(true)}
                            onBlur={() => setIsDateFocused(false)}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type={isTimeFocused ? "time" : "text"}
                            name="start_time"
                            value={formData.start_date.split('T')[1] || ""}
                            onChange={handleChange}
                            className="form-control"
                            required
                            placeholder="Time"
                            onFocus={() => setIsTimeFocused(true)}
                            onBlur={() => setIsTimeFocused(false)}
                          />
                        </div>
                      </div>
                    )}



                    {formData.leave_duration === "Multiple Days" && (
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type={isStartDateFocused ? 'date' : 'text'}
                            name="start_date"
                            placeholder="Start Date"
                            value={formData.start_date}
                            onChange={handleChange}
                            className="form-control"
                            required
                            onFocus={() => setIsStartDateFocused(true)}
                            onBlur={() => setIsStartDateFocused(false)}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            type={isEndDateFocused ? 'date' : 'text'}
                            name="end_date"
                            placeholder="End Date"
                            value={formData.end_date}
                            onChange={handleChange}
                            className="form-control"
                            required
                            onFocus={() => setIsEndDateFocused(true)}
                            onBlur={() => setIsEndDateFocused(false)}
                          />
                        </div>
                      </div>
                    )}

                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="file"
                          name="attachment"
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
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
                    </div>

                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                          backgroundColor: '#3B8682',
                          borderColor: '#3B8682',
                          marginRight: '70px'
                        }}
                      >
                        Apply Leave
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

export default Aleave;
