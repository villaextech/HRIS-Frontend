import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import "./Employee.css";

const Employee = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    contactPhoneNumber: "",
    homeAddress: "",
    designation: "",
    department: "",
    officeLocation: "",
    employeeStartDate: "",
    employmentType: "",
    reportingManager: "",
    salaryDetails: "",
    emergencyContactInfo: "",
    nationalId: "",
    bankAccountDetails: "",
    profilePicture: null,
    socialSecurityNumber: "",
    taxIdentificationNumber: "",
    preferredLanguage: "",
    probationPeriodEndDate: "",
    contractEndDate: "",
    maritalStatus: "",
    numberOfDependents: "",
    bloodGroup: "",
    employeeStatus: "",
    linkedinProfile: "",
    companyEmailAddress: "",
    workPhoneNumber: "",
    employeeBenefits: "",
    jobDescription: "",
    workShift: "",
    leaveBalance: "",
    performanceReviews: "",
    trainingAndDevelopmentRecords: "",
    role: "",
    notes: "",
    educationalQualifications: [],
    skillsAndCertificates: [],
    workExperience: [],
    previousEmploymentDetails: [],
    references: []
  });

  const [employees, setEmployees] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const itemsPerPage = 12;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employees/`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      setError("Error fetching employees: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (Array.isArray(value)) {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, value);
      }
    }

    try {
      if (editIndex !== null) {
        await axios.put(`${process.env.REACT_APP_BASE_URL}/api/employees/${employees[editIndex].id}/`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEmployees((prevEmployees) =>
          prevEmployees.map((employee, i) =>
            i === editIndex ? { ...employee, ...formData } : employee
          )
        );
      } else {
        await axios.post(`${process.env.REACT_APP_BASE_URL}/api/employees/`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEmployees([...employees, formData]);
      }
    } catch (error) {
      setError("Error submitting data: " + error.message);
    }

    setFormData({
      fullName: "",
      employeeId: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      contactPhoneNumber: "",
      homeAddress: "",
      designation: "",
      department: "",
      officeLocation: "",
      employeeStartDate: "",
      employmentType: "",
      reportingManager: "",
      salaryDetails: "",
      emergencyContactInfo: "",
      nationalId: "",
      bankAccountDetails: "",
      profilePicture: null,
      socialSecurityNumber: "",
      taxIdentificationNumber: "",
      preferredLanguage: "",
      probationPeriodEndDate: "",
      contractEndDate: "",
      maritalStatus: "",
      numberOfDependents: "",
      bloodGroup: "",
      employeeStatus: "",
      linkedinProfile: "",
      companyEmailAddress: "",
      workPhoneNumber: "",
      employeeBenefits: "",
      jobDescription: "",
      workShift: "",
      leaveBalance: "",
      performanceReviews: "",
      trainingAndDevelopmentRecords: "",
      role: "",
      notes: "",
      educationalQualifications: [],
      skillsAndCertificates: [],
      workExperience: [],
      previousEmploymentDetails: [],
      references: []
    });
    setEditIndex(null);
    setShowFormPopup(false);
  };

  const handleEdit = (index) => {
    if (index >= 0 && index < employees.length) {
      setFormData(employees[index]);
      setEditIndex(index);
      setShowFormPopup(true);
    } else {
      setError("Invalid index for editing: " + index);
    }
  };

  const initiateDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    const employeeToDelete = employees[deleteIndex];

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/employees/${employeeToDelete.id}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      setEmployees((prev) => prev.filter((_, i) => i !== deleteIndex));
      setShowDeleteModal(false);
    } catch (error) {
      setError("Error deleting employee: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value || "");
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
    const employeeName = employee.fullName ? employee.fullName.toLowerCase() : '';
    const employeeEmail = employee.email ? employee.email.toLowerCase() : '';
    const search = searchTerm.toLowerCase() || '';
    return employeeName.includes(search) || employeeEmail.includes(search);
  });

  const paginatedEmployees = paginate(filteredEmployees, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const openForm = () => {
    setFormData({
      fullName: "",
      employeeId: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      contactPhoneNumber: "",
      homeAddress: "",
      designation: "",
      department: "",
      officeLocation: "",
      employeeStartDate: "",
      employmentType: "",
      reportingManager: "",
      salaryDetails: "",
      emergencyContactInfo: "",
      nationalId: "",
      bankAccountDetails: "",
      profilePicture: null,
      socialSecurityNumber: "",
      taxIdentificationNumber: "",
      preferredLanguage: "",
      probationPeriodEndDate: "",
      contractEndDate: "",
      maritalStatus: "",
      numberOfDependents: "",
      bloodGroup: "",
      employeeStatus: "",
      linkedinProfile: "",
      companyEmailAddress: "",
      workPhoneNumber: "",
      employeeBenefits: "",
      jobDescription: "",
      workShift: "",
      leaveBalance: "",
      performanceReviews: "",
      trainingAndDevelopmentRecords: "",
      role: "",
      notes: "",
      educationalQualifications: [],
      skillsAndCertificates: [],
      workExperience: [],
      previousEmploymentDetails: [],
      references: []
    });
    setEditIndex(null);
    setShowFormPopup(true);
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3 ">
            <span className="T1">Employee</span>
            <div className='d-flex align-items-center'>
              <input
                type="text"
                placeholder="Search Employee"
                value={searchTerm}
                onChange={handleSearch}
                className="form-control search-input me-2 "
              />
              <button className="btn add1 me-8" onClick={openForm}>
                Add
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

          {paginatedEmployees.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee, index) => (
                  <tr key={employee.id}>
                    <td>{index + 1}</td>
                    <td>{employee.fullName}</td>
                    <td>{employee.email}</td>
                    <td>
                      <button
                        className="btn btn-icon me-2"
                        onClick={() => handleEdit(index)}
                        style={{ background: "none", border: "none", padding: "0", cursor: "pointer" }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-icon"
                        onClick={() => initiateDelete(index)}
                        style={{ background: "none", border: "none", padding: "0", cursor: "pointer" }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          )}
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

      {showFormPopup && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content m1">
              <div className="modal-header">
                <h5 className="modal-title">{editIndex !== null ? "Edit Employee" : "Add Employee"}</h5>
                <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        placeholder="Employee ID"
                        value={formData.employeeId}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type={isFocused ? 'date' : 'text'}
                        id="dateOfBirth"
                        name="dateOfBirth"
                        placeholder="Date of Birth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="form-control custom-date-input"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </div>
                    <div className="col-md-6">
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="form-control"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="contactPhoneNumber"
                        name="contactPhoneNumber"
                        placeholder="Contact Phone Number"
                        value={formData.contactPhoneNumber}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="homeAddress"
                        name="homeAddress"
                        placeholder="Home Address"
                        value={formData.homeAddress}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="designation"
                        name="designation"
                        placeholder="Designation"
                        value={formData.designation}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="department"
                        name="department"
                        placeholder="Department"
                        value={formData.department}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="officeLocation"
                        name="officeLocation"
                        placeholder="Office Location"
                        value={formData.officeLocation}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type={isFocused ? 'date' : 'text'}
                        id="employeeStartDate"
                        name="employeeStartDate"
                        placeholder="Employee Start Date"
                        value={formData.employeeStartDate}
                        onChange={handleChange}
                        required
                        className="form-control custom-date-input"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </div>
                    <div className="col-md-6">
                      <select
                        id="employmentType"
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        required
                        className="form-control"
                      >
                        <option value="">Select Employment Type</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Part-Time">Part-Time</option>
                        <option value="Contract">Contract</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="reportingManager"
                        name="reportingManager"
                        placeholder="Reporting Manager"
                        value={formData.reportingManager}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="salaryDetails"
                        name="salaryDetails"
                        placeholder="Salary Details"
                        value={formData.salaryDetails}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="emergencyContactInfo"
                        name="emergencyContactInfo"
                        placeholder="Emergency Contact Info"
                        value={formData.emergencyContactInfo}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="nationalId"
                        name="nationalId"
                        placeholder="National ID"
                        value={formData.nationalId}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="bankAccountDetails"
                        name="bankAccountDetails"
                        placeholder="Bank Account Details"
                        value={formData.bankAccountDetails}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="file"
                        id="profilePicture"
                        name="profilePicture"
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="socialSecurityNumber"
                        name="socialSecurityNumber"
                        placeholder="Social Security Number"
                        value={formData.socialSecurityNumber}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="taxIdentificationNumber"
                        name="taxIdentificationNumber"
                        placeholder="Tax Identification Number"
                        value={formData.taxIdentificationNumber}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="preferredLanguage"
                        name="preferredLanguage"
                        placeholder="Preferred Language"
                        value={formData.preferredLanguage}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type={isFocused ? 'date' : 'text'}
                        id="probationPeriodEndDate"
                        name="probationPeriodEndDate"
                        placeholder="Probation Period End Date"
                        value={formData.probationPeriodEndDate}
                        onChange={handleChange}
                        required
                        className="form-control custom-date-input"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type={isFocused ? 'date' : 'text'}
                        id="contractEndDate"
                        name="contractEndDate"
                        placeholder="Contract End Date"
                        value={formData.contractEndDate}
                        onChange={handleChange}
                        required
                        className="form-control custom-date-input"
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                      />
                    </div>
                    <div className="col-md-6">
                      <select
                        id="maritalStatus"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        required
                        className="form-control"
                      >
                        <option value="">Select Marital Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="number"
                        id="numberOfDependents"
                        name="numberOfDependents"
                        placeholder="Number of Dependents"
                        value={formData.numberOfDependents}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="bloodGroup"
                        name="bloodGroup"
                        placeholder="Blood Group"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <select
                        id="employeeStatus"
                        name="employeeStatus"
                        value={formData.employeeStatus}
                        onChange={handleChange}
                        required
                        className="form-control"
                      >
                        <option value="">Select Employee Status</option>
                        <option value="Active">Active</option>
                        <option value="Onboarding">Onboarding</option>
                        <option value="Terminated">Terminated</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="linkedinProfile"
                        name="linkedinProfile"
                        placeholder="LinkedIn Profile"
                        value={formData.linkedinProfile}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="email"
                        id="companyEmailAddress"
                        name="companyEmailAddress"
                        placeholder="Company Email Address"
                        value={formData.companyEmailAddress}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="workPhoneNumber"
                        name="workPhoneNumber"
                        placeholder="Work Phone Number"
                        value={formData.workPhoneNumber}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="employeeBenefits"
                        name="employeeBenefits"
                        placeholder="Employee Benefits"
                        value={formData.employeeBenefits}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="jobDescription"
                        name="jobDescription"
                        placeholder="Job Description"
                        value={formData.jobDescription}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="workShift"
                        name="workShift"
                        placeholder="Work Shift"
                        value={formData.workShift}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="leaveBalance"
                        name="leaveBalance"
                        placeholder="Leave Balance"
                        value={formData.leaveBalance}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="performanceReviews"
                        name="performanceReviews"
                        placeholder="Performance Reviews"
                        value={formData.performanceReviews}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="trainingAndDevelopmentRecords"
                        name="trainingAndDevelopmentRecords"
                        placeholder="Training and Development Records"
                        value={formData.trainingAndDevelopmentRecords}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        type="text"
                        id="role"
                        name="role"
                        placeholder="Role"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="col-md-6">
                      <textarea
                        id="notes"
                        name="notes"
                        placeholder="Notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </div>
                  <div className="text-end">
                    <button type="submit" className="btn btn-primary" style={{ backgroundColor: '#3B8682', borderColor: '#3B8682', marginRight: '70px' }}>
                      {editIndex !== null ? "Update" : "Submit"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ height: "300px", width: "500px", marginLeft: "50px" }}>
              <div className="modal-header">
                <h5 className="modal-title">Confirm Deletion</h5>
                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this company?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" onClick={handleDelete}>
                  Yes
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employee;
