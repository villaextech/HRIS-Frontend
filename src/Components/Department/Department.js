import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Department.css';

const Department = () => {
  const [formData, setFormData] = useState({
    departmentName: '',
    departmentDescription: '',
    departmentHead: '',
    office: '',
    contactEmail: '',
    contactPhoneNumber: '',
    status: 'active'
  });

  const [departments, setDepartments] = useState([]);
  const [offices, setOffices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [newOffice, setNewOffice] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNewOfficeChange = (e) => {
    setNewOffice(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update office list if a new office is provided and not already in the list
    if (newOffice && !offices.includes(newOffice)) {
      setOffices([...offices, newOffice]);
      setFormData({
        ...formData,
        office: newOffice
      });
      setNewOffice('');
    }

    // Allow form submission even if office is not selected or new office is not added
    if (editIndex !== null) {
      const updatedDepartments = departments.map((department, index) =>
        index === editIndex ? formData : department
      );
      setDepartments(updatedDepartments);
      setEditIndex(null);
    } else {
      setDepartments([...departments, formData]);
    }

    setFormData({
      departmentName: '',
      departmentDescription: '',
      departmentHead: '',
      office: '',
      contactEmail: '',
      contactPhoneNumber: '',
      status: 'active'
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="departmentName"><i className="fas fa-building"></i></label>
            <input
              type="text"
              id="departmentName"
              name="departmentName"
              placeholder="Department Name"
              value={formData.departmentName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="departmentDescription"><i className="fas fa-info-circle"></i></label>
            <input
              type="text"
              id="departmentDescription"
              name="departmentDescription"
              placeholder="Department Description"
              value={formData.departmentDescription}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
        <div className="form-group">
            <label htmlFor="departmentHead"><i className="fas fa-user"></i></label>
            <input
              type="text"
              id="departmentHead"
              name="departmentHead"
              placeholder="Department Head"
              value={formData.departmentHead}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status"><i className="fas fa-toggle-on"></i></label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="deactive">Deactive</option>
            </select>
          </div>
        </div>

        <div className="form-row">
        <div className="form-group">
            <label htmlFor="newOffice"><i className="fas fa-plus-circle"></i></label>
            <input
              type="text"
              id="newOffice"
              name="newOffice"
              placeholder="Add New Office (optional)"
              value={newOffice}
              onChange={handleNewOfficeChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="office"><i className="fas fa-building"></i></label>
            <select
              id="office"
              name="office"
              value={formData.office}
              onChange={handleChange}
            >
              <option value="">Select Office (optional)</option>
              {offices.map((office, index) => (
                <option key={index} value={office}>{office}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contactEmail"><i className="fas fa-envelope"></i></label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              placeholder="Contact Email"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactPhoneNumber"><i className="fas fa-phone"></i></label>
            <input
              type="text"
              id="contactPhoneNumber"
              name="contactPhoneNumber"
              placeholder="Contact Phone Number"
              value={formData.contactPhoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
       
        <button type="submit"><i className="fas fa-paper-plane"></i> {editIndex !== null ? 'Update' : 'Submit'}</button>
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Department Name</th>
              <th>Department Description</th>
              <th>Department Head</th>
              <th>Office</th>
              <th>Contact Email</th>
              <th>Contact Phone Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department, index) => (
              <tr key={index}>
                <td>{department.departmentName}</td>
                <td>{department.departmentDescription}</td>
                <td>{department.departmentHead}</td>
                <td>{department.office}</td>
                <td>{department.contactEmail}</td>
                <td>{department.contactPhoneNumber}</td>
                <td>{department.status}</td>
                <td>
                  <button className="edit-button" onClick={() => {
                    setEditIndex(index);
                    setFormData(department);
                  }}>Edit</button>
                  <button className="delete-button" onClick={() => {
                    const updatedDepartments = departments.filter((_, i) => i !== index);
                    setDepartments(updatedDepartments);
                  }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Department;