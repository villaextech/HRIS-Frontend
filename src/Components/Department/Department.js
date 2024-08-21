import React, { useState, useEffect, useCallback } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Department.css';

const Department = () => {
  const [formData, setFormData] = useState({
    department_name: '',
    department_description: '',
    department_head: '',
    office: '',
    contact_email: '',
    contact_phone_number: '',
    status: true,
  });
  const [departments, setDepartments] = useState([]);
  const [offices, setOffices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/offices/');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      setError('Error fetching offices: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/departments/');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      setError('Error fetching departments: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffices();
    fetchDepartments();
  }, [fetchOffices, fetchDepartments]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedFormData = { ...formData, status: formData.status ? true : false };

    setLoading(true);
    setError(null);
    try {
      let response;
      if (editIndex !== null) {
        const departmentToEdit = departments[editIndex];
        response = await fetch(`http://127.0.0.1:8000/api/departments/${departmentToEdit.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processedFormData),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const updatedDepartment = await response.json();
        const updatedDepartments = [...departments];
        updatedDepartments[editIndex] = updatedDepartment;
        setDepartments(updatedDepartments);
      } else {
        response = await fetch('http://127.0.0.1:8000/api/departments/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(processedFormData),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const newDepartment = await response.json();
        setDepartments((prev) => [...prev, newDepartment]);
      }

      setFormData({
        department_name: '',
        department_description: '',
        department_head: '',
        office: '',
        contact_email: '',
        contact_phone_number: '',
        status: true,
      });
      setEditIndex(null);
      setShowFormPopup(false);
    } catch (error) {
      setError('Error submitting department: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const departmentToEdit = departments[index];
    setFormData({
      department_name: departmentToEdit.department_name,
      department_description: departmentToEdit.department_description,
      department_head: departmentToEdit.department_head,
      office: departmentToEdit.office,
      contact_email: departmentToEdit.contact_email,
      contact_phone_number: departmentToEdit.contact_phone_number,
      status: departmentToEdit.status,
    });
    setEditIndex(index);
    setShowFormPopup(true);
  };

  const handleDelete = (index) => {
    setDepartmentToDelete(departments[index]);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!departmentToDelete) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/departments/${departmentToDelete.id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      setDepartments((prev) => prev.filter(department => department.id !== departmentToDelete.id));
    } catch (error) {
      setError('Error deleting department: ' + error.message);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDepartmentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDepartmentToDelete(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
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

  const filteredDepartments = departments.filter((department) => {
    const departmentName = department.department_name ? department.department_name.toLowerCase() : '';
    const departmentDescription = department.department_description ? department.department_description.toLowerCase() : '';
    const search = searchTerm.toLowerCase() || '';
    return departmentName.includes(search) || departmentDescription.includes(search);
  });

  const paginatedDepartments = paginate(filteredDepartments, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

  const openForm = () => {
    setFormData({
      department_name: '',
      department_description: '',
      department_head: '',
      office: '',
      contact_email: '',
      contact_phone_number: '',
      status: true,
    });
    setEditIndex(null);
    setShowFormPopup(true);
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex justify-content-between mb-3">
          <input
            type="text"
            placeholder="Search departments..."
            value={searchTerm}
            onChange={handleSearch}
            className="form-control"
          />
          <button className="btn add1" onClick={openForm}>
            <i className="fas fa-plus"></i> Add Department
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
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editIndex !== null ? 'Edit Department' : 'Add Department'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="department_name"
                        name="department_name"
                        placeholder="Department Name"
                        value={formData.department_name}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="department_description"
                        name="department_description"
                        placeholder="Department Description"
                        value={formData.department_description}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="department_head"
                        name="department_head"
                        placeholder="Department Head"
                        value={formData.department_head}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <select
                        id="office"
                        name="office"
                        value={formData.office}
                        onChange={handleChange}
                        className="form-select"
                      >
                        <option value="">Select Office</option>
                        {offices.map((office) => (
                          <option key={office.id} value={office.id}>
                            {office.office_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <input
                        type="email"
                        id="contact_email"
                        name="contact_email"
                        placeholder="Contact Email"
                        value={formData.contact_email}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="contact_phone_number"
                        name="contact_phone_number"
                        placeholder="Contact Phone Number"
                        value={formData.contact_phone_number}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3 form-check">
                      <input
                        type="checkbox"
                        id="status"
                        name="status"
                        checked={formData.status}
                        onChange={handleChange}
                        className="form-check-input"
                      />
                      <label htmlFor="status" className="form-check-label">Active</label>
                    </div>
                    <div className="modal-footer">
                      <button type="submit" className="btn btn-primary">Save</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setShowFormPopup(false)}>Close</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                  <button type="button" className="btn-close" onClick={cancelDelete}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this department?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>Yes</button>
                  <button type="button" className="btn btn-secondary" onClick={cancelDelete}>No</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className="table table-striped">
          <thead>
            <tr>
              <th>NO.</th>
              <th>Department Name</th>
              <th>Description</th>
              <th>Head</th>
              <th>Office</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDepartments.map((department, index) => (
              <tr key={department.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{department.department_name}</td>
                <td>{department.department_description}</td>
                <td>{department.department_head}</td>
                <td>{department.office}</td>
                <td>{department.contact_email}</td>
                <td>{department.contact_phone_number}</td>
                <td>{department.status ? 'Active' : 'Inactive'}</td>
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
                    onClick={() => handleDelete(index)}
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
  );
};

export default Department;
