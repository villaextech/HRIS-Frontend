import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Addoffice.css';

const AddOffice = () => {
  const [formData, setFormData] = useState({
    officeName: '',
    officeAddress: '',
    contactEmail: '',
    contactPhoneNumber: '',
    postalAddress: '',
    officeManager: '',
    userName: '',
    password: '',
    officeDescription: '',
    officeHours: '',
    region: '',
    notes: '',
    status: 'active'
  });
  const [offices, setOffices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updatedOffices = offices.map((office, index) => 
        index === editIndex ? formData : office
      );
      setOffices(updatedOffices);
      setEditIndex(null);
    } else {
      setOffices([...offices, formData]);
    }
    setFormData({
      officeName: '',
      officeAddress: '',
      contactEmail: '',
      contactPhoneNumber: '',
      postalAddress: '',
      officeManager: '',
      userName: '',
      password: '',
      officeDescription: '',
      officeHours: '',
      region: '',
      notes: '',
      status: 'active'
    });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(offices[index]);
  };

  const handleDelete = (index) => {
    const updatedOffices = offices.filter((_, i) => i !== index);
    setOffices(updatedOffices);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="contact-form">
        {/* Form fields */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="officeName"><i className="fas fa-building"></i></label>
            <input
              type="text"
              id="officeName"
              name="officeName"
              placeholder="Office Name"
              value={formData.officeName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="officeAddress"><i className="fas fa-map-marker-alt"></i></label>
            <input
              type="text"
              id="officeAddress"
              name="officeAddress"
              placeholder="Office Address"
              value={formData.officeAddress}
              onChange={handleChange}
              required
            />
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
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="postalAddress"><i className="fas fa-mail-bulk"></i></label>
            <input
              type="text"
              id="postalAddress"
              name="postalAddress"
              placeholder="Postal Address"
              value={formData.postalAddress}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="officeManager"><i className="fas fa-user"></i></label>
            <input
              type="text"
              id="officeManager"
              name="officeManager"
              placeholder="Office Manager"
              value={formData.officeManager}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="userName"><i className="fas fa-user-circle"></i></label>
            <input
              type="text"
              id="userName"
              name="userName"
              placeholder="User Name"
              value={formData.userName}
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
            <label htmlFor="officeDescription"><i className="fas fa-info-circle"></i></label>
            <input
              type="text"
              id="officeDescription"
              name="officeDescription"
              placeholder="Office Description"
              value={formData.officeDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="officeHours"><i className="fas fa-clock"></i></label>
            <input
              type="text"
              id="officeHours"
              name="officeHours"
              placeholder="Office Hours"
              value={formData.officeHours}
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
              value={formData.status}
              onChange={handleChange}
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
                <td>{office.officeName}</td>
                <td>{office.officeAddress}</td>
                <td>{office.contactEmail}</td>
                <td>{office.contactPhoneNumber}</td>
                <td>{office.postalAddress}</td>
                <td>{office.officeManager}</td>
                <td>{office.userName}</td>
                <td>
                  <input 
                    type="password" 
                    value={office.password} 
                    readOnly 
                  />
                </td>
                <td>{office.officeDescription}</td>
                <td>{office.officeHours}</td>
                <td>{office.region}</td>
                <td>{office.notes}</td>
                <td>{office.status}</td>
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