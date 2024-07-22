import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Desiganation.css';

const Desiganation = () => {
  const [formData, setFormData] = useState({
    designationTitle: '',
    designationDescription: ''
  });

  const [designations, setDesignations] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDesignations([...designations, formData]);
    setFormData({
      designationTitle: '',
      designationDescription: ''
    });
  };

  const handleEdit = (index) => {
    const designationToEdit = designations[index];
    setFormData(designationToEdit);
    setDesignations(designations.filter((_, i) => i !== index));
  };

  const handleDelete = (index) => {
    setDesignations(designations.filter((_, i) => i !== index));
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
          <i className="fas fa-paper-plane"></i> Submit
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
              <td>{designation.designationTitle}</td>
              <td>{designation.designationDescription}</td>
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
