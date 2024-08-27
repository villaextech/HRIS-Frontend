import React, { useState, useEffect, useCallback } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Role.css';

const Role = () => {
  const [formData, setFormData] = useState({
    roleName: '',
    roleDescription: '',
  });
  const [roles, setRoles] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://54.86.62.130:8882/api/roles/');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      setError('Error fetching roles: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (editIndex !== null) {
        const roleToEdit = roles[editIndex];
        response = await fetch(`http://54.86.62.130:8882/api/roles/${roleToEdit.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.roleName,
            description: formData.roleDescription,
          }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const updatedRole = await response.json();
        const updatedRoles = [...roles];
        updatedRoles[editIndex] = updatedRole;
        setRoles(updatedRoles);
      } else {
        response = await fetch('http://54.86.62.130:8882/api/roles/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.roleName,
            description: formData.roleDescription,
          }),
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const newRole = await response.json();
        setRoles((prev) => [...prev, newRole]);
      }
      setFormData({ roleName: '', roleDescription: '' });
      setEditIndex(null);
      setShowFormPopup(false);
    } catch (error) {
      setError('Error submitting role: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const roleToEdit = roles[index];
    setFormData({
      roleName: roleToEdit.name,
      roleDescription: roleToEdit.description,
    });
    setEditIndex(index);
    setShowFormPopup(true);
  };

  const handleDelete = (index) => {
    setRoleToDelete(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (roleToDelete === null) return;

    const roleToDeleteItem = roles[roleToDelete];

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://54.86.62.130:8882/api/roles/${roleToDeleteItem.id}/`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Network response was not ok');
      setRoles((prev) => prev.filter((_, i) => i !== roleToDelete));
      setRoleToDelete(null);
    } catch (error) {
      setError('Error deleting role: ' + error.message);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setRoleToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
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

  const filteredRoles = roles.filter((role) => {
    const roleName = role.name ? role.name.toLowerCase() : '';
    const roleDescription = role.description ? role.description.toLowerCase() : '';
    const search = searchTerm.toLowerCase() || '';
    return roleName.includes(search) || roleDescription.includes(search);
  });

  const paginatedRoles = paginate(filteredRoles, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredRoles.length / itemsPerPage);

  const openForm = () => {
    setFormData({
      roleName: '',
      roleDescription: '',
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
              placeholder="Search role"
              value={searchTerm}
              onChange={handleSearch}
              className="form-control search-input"
            />
            <button className="btn add1" onClick={openForm}>
              <i className="fas fa-plus"></i> Add
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

        {showFormPopup && (
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content c9">
                <div className="modal-header">
                  <h5 className="modal-title">{editIndex !== null ? 'Edit Role' : 'Add Role'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
                </div>
                <div className="modal-body c10">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <input
                        type="text"
                        id="roleName"
                        name="roleName"
                        placeholder="Role Name"
                        value={formData.roleName}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        type='ttext'
                        id="roleDescription"
                        name="roleDescription"
                        placeholder="Role Description"
                        value={formData.roleDescription}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
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

        {showDeleteConfirm && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content" style={{ height: "300px", width: "500px", marginLeft: "50px" }}>
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button type="button" className="btn-close" onClick={() => cancelDelete(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this office?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                    Yes
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => cancelDelete(false)}>
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <table className="table table-striped">
          <thead>
            <tr>
              <th>NO.</th>
              <th>Role Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRoles.map((role, index) => (
              <tr key={role.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Numbering */}
                <td>{role.name}</td>
                <td>{role.description}</td>
                <td>
                  <button
                    className="btn btn-icon me-2"
                    onClick={() => handleEdit(index)}
                    style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-icon"
                    onClick={() => handleDelete(index)}
                    style={{ background: 'none', border: 'none', padding: '0', cursor: 'pointer' }}
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

export default Role;
