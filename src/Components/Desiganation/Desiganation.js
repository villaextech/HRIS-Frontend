import React, { useState, useEffect, useCallback } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Desiganation.css'; // Ensure this CSS file is styled according to your needs

const Desiganation = () => {
  const [formData, setFormData] = useState({
    designationTitle: '',
    designationDescription: ''
  });
  const [designations, setDesignations] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const fetchDesignations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://54.86.62.130:8882/api/designations/');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setDesignations(data);
    } catch (error) {
      setError('Error fetching designations: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (editIndex !== null) {
        const designationToEdit = designations[editIndex];
        response = await fetch(`http://54.86.62.130:8882/api/designations/${designationToEdit.id}/`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const updatedDesignation = await response.json();
        const updatedDesignations = [...designations];
        updatedDesignations[editIndex] = updatedDesignation;
        setDesignations(updatedDesignations);
      } else {
        response = await fetch('http://54.86.62.130:8882/api/designations/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const newDesignation = await response.json();
        setDesignations(prev => [...prev, newDesignation]);
      }
      setFormData({
        designationTitle: '',
        designationDescription: ''
      });
      setEditIndex(null);
      setShowFormPopup(false);
    } catch (error) {
      setError('Error submitting designation: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const designationToEdit = designations[index];
    setFormData({
      designationTitle: designationToEdit.title,
      designationDescription: designationToEdit.description
    });
    setEditIndex(index);
    setShowFormPopup(true);
  };

  const handleDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    const designationToDelete = designations[deleteIndex];
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://54.86.62.130:8882/api/designations/${designationToDelete.id}/`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Network response was not ok');
      setDesignations(prev => prev.filter((_, i) => i !== deleteIndex));
    } catch (error) {
      setError('Error deleting designation: ' + error.message);
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteIndex(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteIndex(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const paginate = (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const filteredDesignations = designations.filter((designation) => {
    const title = designation.title ? designation.title.toLowerCase() : '';
    const description = designation.description ? designation.description.toLowerCase() : '';
    const search = searchTerm.toLowerCase() || '';
    return title.includes(search) || description.includes(search);
  });

  const paginatedDesignations = paginate(filteredDesignations, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredDesignations.length / itemsPerPage);

  const openForm = () => {
    setFormData({
      designationTitle: '',
      designationDescription: ''
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
              placeholder="Search desiganation"
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
              <div className="modal-content c3">
                <div className="modal-header">
                  <h5 className="modal-title">{editIndex !== null ? 'Edit Designation' : 'Add Designation'}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
                </div>
                <div className="modal-body c4">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <textarea
                        type="text"
                        id="designationTitle"
                        name="designationTitle"
                        placeholder="Designation Title"
                        value={formData.designationTitle}
                        onChange={handleChange}
                        required
                        className="form-control f2"
                      />
                    </div>
                    <div className="mb-3">
                      <textarea
                        type="text"
                        id="designationDescription"
                        name="designationDescription"
                        placeholder="Designation Description"
                        value={formData.designationDescription}
                        onChange={handleChange}
                        required
                        className="form-control f2"
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
              <th>No.</th>
              <th>Designation</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDesignations.map((designation, index) => (
              <tr key={designation.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Numbering logic */}
                <td>{designation.title}</td>
                <td>{designation.description}</td>
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

export default Desiganation;
