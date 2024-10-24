import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAttendance, setShowAttendance] = useState(false);
  const [selectedEmployeeNames, setSelectedEmployeeNames] = useState([]);
  const [selectedBiometricIds, setSelectedBiometricIds] = useState([]);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const debounceTimeoutRef = useRef(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (startDate) params.start_date = startDate.toISOString().split('T')[0];
      if (endDate) params.end_date = endDate.toISOString().split('T')[0];
      if (selectedStatuses.length > 0) params.status = selectedStatuses;
      if (selectedEmployeeNames.length > 0) params.employee_name = selectedEmployeeNames;
      if (selectedBiometricIds.length > 0) params.biometric_id = selectedBiometricIds;
      if (selectedEmployeeIds.length > 0) params.employee_id = selectedEmployeeIds;

      const queryString = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          params[key].forEach(value => queryString.append(key, value));
        } else {
          queryString.append(key, params[key]);
        }
      });

      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/api/attendance/filter/?${queryString.toString()}`);
      setEmployees(response.data);
    } catch (error) {
      setError("Error fetching employees: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }, [selectedEmployeeNames, selectedBiometricIds, selectedEmployeeIds, startDate, endDate, selectedStatuses]);

  useEffect(() => {
    if (showAttendance) {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        fetchEmployees();
      }, 500);
      return () => clearTimeout(debounceTimeoutRef.current);
    }
  }, [fetchEmployees, showAttendance, selectedEmployeeNames, selectedBiometricIds, selectedEmployeeIds, selectedStatuses, startDate, endDate]);

  const handleResetFilters = () => {
    setSelectedEmployeeNames([]);
    setSelectedBiometricIds([]);
    setSelectedEmployeeIds([]);
    setSelectedStatuses([]);
    setDateRange([null, null]);
    setSearchTerm("");
    if (showAttendance) {
      fetchEmployees();
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value || "");
  };

  // Prepare data for the chart based on the filtered employees
  const prepareChartData = () => {
    const checkInData = {};
    const checkOutData = {};
    const absentDays = new Set(); // Track absent days

    employees.forEach(employee => {
      const date = new Date(employee.date);
      const day = date.getDate();
      const checkInTime = employee.check_in_time ? new Date(`${employee.date}T${employee.check_in_time}`) : null;
      const checkOutTime = employee.check_out_time ? new Date(`${employee.date}T${employee.check_out_time}`) : null;

      // Check if the date is within the selected date range
      if (startDate && endDate && (date < startDate || date > endDate)) {
        return;
      }

      // Record check-in times
      if (checkInTime) {
        if (!checkInData[day]) {
          checkInData[day] = [];
        }
        checkInData[day].push(checkInTime);
      }

      // Record check-out times
      if (checkOutTime) {
        if (!checkOutData[day]) {
          checkOutData[day] = [];
        }
        checkOutData[day].push(checkOutTime);
      }

      // If no check-in or check-out, mark as absent
      if (!checkInTime && !checkOutTime) {
        absentDays.add(day);
      }
    });

    const categories = Array.from({ length: 31 }, (_, i) => i + 1);
    const checkInSeriesData = categories.map(day => {
      const times = checkInData[day] || [];
      const totalMinutes = times.reduce((sum, time) => sum + time.getHours() * 60 + time.getMinutes(), 0);
      return totalMinutes / (times.length || 1) || null; // Average in minutes
    });

    const checkOutSeriesData = categories.map(day => {
      const times = checkOutData[day] || [];
      const totalMinutes = times.reduce((sum, time) => sum + time.getHours() * 60 + time.getMinutes(), 0);
      return totalMinutes / (times.length || 1) || null; // Average in minutes
    });

    const absentSeriesData = categories.map(day => (absentDays.has(day) ? 1 : null)); // Mark absent days

    return {
      categories,
      checkInSeriesData,
      checkOutSeriesData,
      absentSeriesData,
    };
  };

  const { categories, checkInSeriesData, checkOutSeriesData, absentSeriesData } = prepareChartData();

  const chartOptions = {
    chart: {
      toolbar: { show: false },
      type: 'bar',
      stacked: false,
    },
    dataLabels: { enabled: false },
    legend: {
      show: true,
    },
    colors: ["#0d6efd", "#28a745", "#dc3545"], // Colors for Check-In, Check-Out, and Absent
    xaxis: {
      categories,
    },
    yaxis: {
      title: {
        text: 'Time',
      },
      labels: {
        formatter: (value) => {
          const totalMinutes = Math.round(value);
          const hours = Math.floor(totalMinutes / 60) % 12 || 12;
          const minutes = totalMinutes % 60;
          const ampm = totalMinutes >= 720 ? 'PM' : 'AM';
          return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
        },
      },
    },
    series: [
      { name: "Check-In", data: checkInSeriesData },
      { name: "Check-Out", data: checkOutSeriesData },
      { name: "Absent", data: absentSeriesData },
    ],
  };

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
              disabled={!showAttendance}
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
              <div className="col-md-3">
                <CheckboxDropdown
                  label="Employee Name"
                  options={Array.from(new Set(employees.map(emp => emp.employee.full_name)))}
                  selectedOptions={selectedEmployeeNames}
                  onChange={setSelectedEmployeeNames}
                />
              </div>
              <div className="col-md-3">
                <CheckboxDropdown
                  label="Employee ID"
                  options={Array.from(new Set(employees.map(emp => emp.employee.employee_id)))}
                  selectedOptions={selectedEmployeeIds}
                  onChange={setSelectedEmployeeIds}
                />
              </div>
              <div className="col-md-3">
                <CheckboxDropdown
                  label="Biometric ID"
                  options={Array.from(new Set(employees.map(emp => emp.biometric_id)))}
                  selectedOptions={selectedBiometricIds}
                  onChange={setSelectedBiometricIds}
                />
              </div>
              <div className="col-md-3">
                <CheckboxDropdown
                  label="Status"
                  options={["Present", "Absent", "Leave", "Half Day"]}
                  selectedOptions={selectedStatuses}
                  onChange={setSelectedStatuses}
                />
              </div>
              <div className="col-md-4">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => setDateRange(dates)}
                  selectsRange
                  startDate={startDate}
                  endDate={endDate}
                  className="form-control"
                  placeholderText="Select Date Range"
                />
              </div>
              <div className="col-md-2">
                <button className="btn reset-btn" onClick={handleResetFilters}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chart Section */}
        {showAttendance && !loading && employees.length > 0 && (
          <Card>
            <CardBody>
              <CardTitle tag="h5">Attendance Chart</CardTitle>
              <CardSubtitle tag="h6" className="mb-2 text-muted">
                Check-in and Check-out Times with Absences
              </CardSubtitle>
              <Chart
                options={chartOptions}
                series={[
                  { name: "Check-In", data: checkInSeriesData },
                  { name: "Check-Out", data: checkOutSeriesData },
                  { name: "Absent", data: absentSeriesData },
                ]}
                type="bar"
                height={350}
              />
            </CardBody>
          </Card>
        )}

        {/* Loading and Error Handling */}
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
      </div>
    </div>
  );
};

export default Dashboard;
