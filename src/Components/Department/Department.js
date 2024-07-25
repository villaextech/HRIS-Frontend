import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchOffices();
    fetchDepartments();
  }, []);

  const fetchOffices = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/offices/');
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      console.error('Error fetching offices:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/departments/');
      const data = await response.json();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedFormData = {
        ...formData,
        status: formData.status ? true : false,
      };

      if (editIndex !== null) {
        const departmentToEdit = departments[editIndex];
        const response = await fetch(`http://127.0.0.1:8000/api/departments/${departmentToEdit.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedFormData),
        });
        const updatedDepartment = await response.json();
        const updatedDepartments = [...departments];
        updatedDepartments[editIndex] = updatedDepartment;
        setDepartments(updatedDepartments);
      } else {
        const response = await fetch('http://127.0.0.1:8000/api/departments/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(processedFormData),
        });
        const newDepartment = await response.json();
        setDepartments([...departments, newDepartment]);
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
    } catch (error) {
      console.error('Error submitting department:', error);
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
  };

  const handleDelete = async (index) => {
    const departmentToDelete = departments[index];
    try {
      await fetch(`http://127.0.0.1:8000/api/departments/${departmentToDelete.id}/`, {
        method: 'DELETE',
      });
      setDepartments(departments.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Form fields */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department_name"><i className="fas fa-building"></i></label>
            <input
              type="text"
              id="department_name"
              name="department_name"
              placeholder="Department Name"
              value={formData.department_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="department_description"><i className="fas fa-info-circle"></i></label>
            <input
              type="text"
              id="department_description"
              name="department_description"
              placeholder="Department Description"
              value={formData.department_description}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="department_head"><i className="fas fa-user"></i></label>
            <input
              type="text"
              id="department_head"
              name="department_head"
              placeholder="Department Head"
              value={formData.department_head}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="status"><i className="fas fa-toggle-on"></i></label>
            <select
              id="status"
              name="status"
              value={formData.status ? 'active' : 'deactive'}
              onChange={(e) => handleChange({ target: { name: 'status', value: e.target.value === 'active' } })}
              required
            >
              <option value="active">Active</option>
              <option value="deactive">Deactive</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="contact_email"><i className="fas fa-envelope"></i></label>
            <input
              type="email"
              id="contact_email"
              name="contact_email"
              placeholder="Contact Email"
              value={formData.contact_email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact_phone_number"><i className="fas fa-phone"></i></label>
            <input
              type="text"
              id="contact_phone_number"
              name="contact_phone_number"
              placeholder="Contact Phone Number"
              value={formData.contact_phone_number}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="office"><i className="fas fa-building"></i></label>
            <select
              id="office"
              name="office"
              value={formData.office}
              onChange={handleChange}
            >
              <option value="">Select Office</option>
              {offices.map((office) => (
                <option key={office.id} value={office.id}>{office.office_name}</option>
              ))}
            </select>
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
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((department, index) => (
              <tr key={index}>
                <td>{department.department_name}</td>
                <td>{department.department_description}</td>
                <td>{department.department_head}</td>
                <td>{department.office}</td>
                <td>{department.contact_email}</td>
                <td>{department.contact_phone_number}</td>
                <td>{department.status ? 'Active' : 'Deactive'}</td>
                <td>
                  <button onClick={() => handleEdit(index)} className="edit-button">
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(index)} className="delete-button">
                    Delete
                  </button>
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
