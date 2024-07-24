import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Addoffice.css';

const AddOffice = () => {
  const [formData, setFormData] = useState({
    office_name: '',
    office_address: '',
    contact_email: '',
    contact_phone_number: '',
    postal_address: '',
    office_manager_name: '',
    username: '',
    password: '',
    office_description: '',
    office_hours: '',
    region: '',
    notes: '',
    status: true
  });
  const [offices, setOffices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchOffices();
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const processedFormData = {
        ...formData,
        status: formData.status ? true : false
      };

      if (editIndex !== null) {
        const officeToEdit = offices[editIndex];
        const response = await fetch(`http://127.0.0.1:8000/api/offices/${officeToEdit.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(processedFormData)
        });
        const updatedOffice = await response.json();
        const updatedOffices = [...offices];
        updatedOffices[editIndex] = updatedOffice;
        setOffices(updatedOffices);
      } else {
        const response = await fetch('http://127.0.0.1:8000/api/offices/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(processedFormData)
        });
        const newOffice = await response.json();
        setOffices([...offices, newOffice]);
      }

      setFormData({
        office_name: '',
        office_address: '',
        contact_email: '',
        contact_phone_number: '',
        postal_address: '',
        office_manager_name: '',
        username: '',
        password: '',
        office_description: '',
        office_hours: '',
        region: '',
        notes: '',
        status: true
      });
      setEditIndex(null);
    } catch (error) {
      console.error('Error submitting office:', error);
    }
  };

  const handleEdit = (index) => {
    const officeToEdit = offices[index];
    setFormData({
      office_name: officeToEdit.office_name,
      office_address: officeToEdit.office_address,
      contact_email: officeToEdit.contact_email,
      contact_phone_number: officeToEdit.contact_phone_number,
      postal_address: officeToEdit.postal_address,
      office_manager_name: officeToEdit.office_manager_name,
      username: officeToEdit.username,
      password: officeToEdit.password,
      office_description: officeToEdit.office_description,
      office_hours: officeToEdit.office_hours,
      region: officeToEdit.region,
      notes: officeToEdit.notes || '',
      status: officeToEdit.status
    });
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const officeToDelete = offices[index];
    try {
      await fetch(`http://127.0.0.1:8000/api/offices/${officeToDelete.id}/`, {
        method: 'DELETE'
      });
      setOffices(offices.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting office:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Form fields */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="office_name"><i className="fas fa-building"></i></label>
            <input
              type="text"
              id="office_name"
              name="office_name"
              placeholder="Office Name"
              value={formData.office_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="office_address"><i className="fas fa-map-marker-alt"></i></label>
            <input
              type="text"
              id="office_address"
              name="office_address"
              placeholder="Office Address"
              value={formData.office_address}
              onChange={handleChange}
              required
            />
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
            <label htmlFor="postal_address"><i className="fas fa-mail-bulk"></i></label>
            <input
              type="text"
              id="postal_address"
              name="postal_address"
              placeholder="Postal Address"
              value={formData.postal_address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="office_manager_name"><i className="fas fa-user"></i></label>
            <input
              type="text"
              id="office_manager_name"
              name="office_manager_name"
              placeholder="Office Manager"
              value={formData.office_manager_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username"><i className="fas fa-user-circle"></i></label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="User Name"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password"><i className="fas fa-lock"></i></label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="office_description"><i className="fas fa-info-circle"></i></label>
            <input
              type="text"
              id="office_description"
              name="office_description"
              placeholder="Office Description"
              value={formData.office_description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="office_hours"><i className="fas fa-clock"></i></label>
            <input
              type="text"
              id="office_hours"
              name="office_hours"
              placeholder="Office Hours"
              value={formData.office_hours}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="region"><i className="fas fa-globe"></i></label>
            <input
              type="text"
              id="region"
              name="region"
              placeholder="Region/Zone"
              value={formData.region}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="notes"><i className="fas fa-sticky-note"></i></label>
            <input
              type="text"
              id="notes"
              name="notes"
              placeholder="Notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
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
        <button type="submit"><i className="fas fa-paper-plane"></i> {editIndex !== null ? 'Update' : 'Submit'}</button>
      </form>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Office Name</th>
              <th>Office Address</th>
              <th>Contact Email</th>
              <th>Contact Phone Number</th>
              <th>Postal Address</th>
              <th>Office Manager</th>
              <th>User Name</th>
              <th>Password</th>
              <th>Office Description</th>
              <th>Office Hours</th>
              <th>Region/Zone</th>
              <th>Notes</th>
              <th>Status</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {offices.map((office, index) => (
              <tr key={index}>
                <td>{office.office_name}</td>
                <td>{office.office_address}</td>
                <td>{office.contact_email}</td>
                <td>{office.contact_phone_number}</td>
                <td>{office.postal_address}</td>
                <td>{office.office_manager_name}</td>
                <td>{office.username}</td>
                <td>
                  <input 
                    type="password" 
                    value={office.password} 
                    readOnly 
                  />
                </td>
                <td>{office.office_description}</td>
                <td>{office.office_hours}</td>
                <td>{office.region}</td>
                <td>{office.notes}</td>
                <td>{office.status ? 'Active' : 'Deactive'}</td>
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

export default AddOffice;
