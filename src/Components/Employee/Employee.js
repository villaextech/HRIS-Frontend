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
    previousEmploymentDetails: []
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

  const itemsPerPage = 10;

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://54.86.62.130:8882/api/employees/");
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
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        await axios.put(`http://54.86.62.130:8882/api/employees/${employees[editIndex].id}/`, form, {
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
        await axios.post("http://54.86.62.130:8882/api/employees/", form, {
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
      previousEmploymentDetails: []
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
      const response = await fetch(`http://54.86.62.130:8882/api/employees/${employeeToDelete.id}/`, {
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
      previousEmploymentDetails: []
    });
    setEditIndex(null);
    setShowFormPopup(true);
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex flex-column">
        <div className="d-flex justify-content-between mb-3">
            <input
              type="text"
              placeholder="Search employees"
              value={searchTerm}
              onChange={handleSearch}
              className="form-control search-input"
            />
            <button className="btn add1" onClick={openForm}>
              <i className="fas fa-plus"></i> Add
            </button>
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

          {showFormPopup && (
            <div className="modal show" style={{ display: "block" }}>
              <div className="modal-dialog">
                <div className="modal-content c1">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editIndex !== null ? "Edit Employee" : "Add Employee"}
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
                  </div>
                  <div className="modal-body c2">
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
                      {/* Add more fields as needed */}
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <input
                            type="date"
                            id="dob"
                            name="dob"
                            placeholder="Date of Birth"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                            className="form-control"
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
                      {/* Additional fields */}
                      <div className="text-end">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ backgroundColor: '#3B8682', borderColor: '#3B8682', marginRight: '70px' }}
                        >
                          {editIndex !== null ? "Update" : "Add"} Employee
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
                    <p>Are you sure you want to delete this employee?</p>
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

          <table className="table table-striped t1">
            <thead className="align-middle">
              <tr>
                <th>NO.</th>
                <th>Full Name</th>
                <th>Employee ID</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((employee, index) => (
                <tr key={employee.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{employee.fullName}</td>
                  <td>{employee.employeeId}</td>
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
    </div>

  );
};

export default Employee;
