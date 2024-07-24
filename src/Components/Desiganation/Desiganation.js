import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Desiganation.css';

const Desiganation = () => {
  const [formData, setFormData] = useState({
    designationTitle: '',
    designationDescription: ''
  });

  const [designations, setDesignations] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/designations/');
      const data = await response.json();
      setDesignations(data);
    } catch (error) {
      console.error('Error fetching designations:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editIndex !== null) {
        const designationToEdit = designations[editIndex];
        const response = await fetch(`http://127.0.0.1:8000/api/designations/${designationToEdit.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: formData.designationTitle,
            description: formData.designationDescription
          })
        });
        const updatedDesignation = await response.json();
        const updatedDesignations = [...designations];
        updatedDesignations[editIndex] = updatedDesignation;
        setDesignations(updatedDesignations);
      } else {
        const response = await fetch('http://127.0.0.1:8000/api/designations/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: formData.designationTitle,
            description: formData.designationDescription
          })
        });
        const newDesignation = await response.json();
        setDesignations([...designations, newDesignation]);
      }
      setFormData({
        designationTitle: '',
        designationDescription: ''
      });
      setEditIndex(null);
    } catch (error) {
      console.error('Error submitting designation:', error);
    }
  };

  const handleEdit = (index) => {
    const designationToEdit = designations[index];
    setFormData({
      designationTitle: designationToEdit.title,
      designationDescription: designationToEdit.description
    });
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const designationToDelete = designations[index];
    try {
      await fetch(`http://127.0.0.1:8000/api/designations/${designationToDelete.id}/`, {
        method: 'DELETE'
      });
      setDesignations(designations.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting designation:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="designation-form">
        <div className="form-row">
          <div className="form-group">
            <i className="fas fa-tag icon"></i>
            <input
              type="text"
              id="designationTitle"
              name="designationTitle"
              placeholder="Designation Title"
              value={formData.designationTitle}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <i className="fas fa-info-circle icon"></i>
            <input
              type="text"
              id="designationDescription"
              name="designationDescription"
              placeholder="Designation Description"
              value={formData.designationDescription}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button type="submit">
          <i className="fas fa-paper-plane"></i> {editIndex !== null ? 'Update' : 'Submit'}
        </button>
      </form>

      <table className="designation-table">
        <thead>
          <tr>
            <th>Designation Title</th>
            <th>Designation Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {designations.map((designation, index) => (
            <tr key={index}>
              <td>{designation.title}</td>
              <td>{designation.description}</td>
              <td className="actions">
                <button className="edit-button" onClick={() => handleEdit(index)}>
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button className="delete-button" onClick={() => handleDelete(index)}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Desiganation;
