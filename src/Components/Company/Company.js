import React, { useState, useEffect } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Company.css';

const Company = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    area: '',
    city: '',
    country: '',
    contact: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: ''
  });
  const [logoFile, setLogoFile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchCompanies(); // Fetch companies on component mount
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/tenants/');
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithFile = new FormData();
    formDataWithFile.append('t_name', formData.name);
    formDataWithFile.append('area', formData.area);
    formDataWithFile.append('city', formData.city);
    formDataWithFile.append('country', formData.country);
    formDataWithFile.append('t_contact', formData.contact);
    formDataWithFile.append('t_email', formData.email);
    formDataWithFile.append('t_contact_person_name', formData.contactPersonName);
    formDataWithFile.append('t_contact_person_contact', formData.contactPersonPhone);
    formDataWithFile.append('t_contact_person_email', formData.contactPersonEmail);
    if (logoFile) {
      formDataWithFile.append('logo', logoFile);
    }

    try {
      let response;
      if (editIndex !== null) {
        const companyToEdit = companies[editIndex];
        response = await fetch(`http://127.0.0.1:8000/api/tenants/${companyToEdit.id}/`, {
          method: 'PUT',
          body: formDataWithFile
        });
        const updatedCompany = await response.json();
        const updatedCompanies = [...companies];
        updatedCompanies[editIndex] = updatedCompany;
        setCompanies(updatedCompanies);
      } else {
        response = await fetch('http://127.0.0.1:8000/api/tenants/', {
          method: 'POST',
          body: formDataWithFile
        });
        const newCompany = await response.json();
        setCompanies([...companies, newCompany]);
      }

      setFormData({
        name: '',
        email: '',
        area: '',
        city: '',
        country: '',
        contact: '',
        contactPersonName: '',
        contactPersonEmail: '',
        contactPersonPhone: ''
      });
      setLogoFile(null);
      setEditIndex(null);
    } catch (error) {
      console.error('Error submitting company:', error);
    }
  };

  const handleEdit = (index) => {
    setFormData({
      name: companies[index].t_name,
      email: companies[index].t_email,
      area: companies[index].area,
      city: companies[index].city,
      country: companies[index].country,
      contact: companies[index].t_contact,
      contactPersonName: companies[index].t_contact_person_name,
      contactPersonEmail: companies[index].t_contact_person_email,
      contactPersonPhone: companies[index].t_contact_person_contact
    });
    setLogoFile(null);
    setEditIndex(index);
  };

  const handleDelete = async (index) => {
    const companyToDelete = companies[index];
    try {
      await fetch(`http://127.0.0.1:8000/api/tenants/${companyToDelete.id}/`, {
        method: 'DELETE'
      });
      setCompanies(companies.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name"><i className="fas fa-user"></i></label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Company Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email"><i className="fas fa-envelope"></i></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Company Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="country"><i className="fas fa-flag"></i></label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="city"><i className="fas fa-city"></i></label>
            <input
              type="text"
              id="city"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">

        <div className="form-group">
            <label htmlFor="area"><i className="fas fa-map-marked-alt"></i></label>
            <input
              type="text"
              id="area"
              name="area"
              placeholder="Area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contact"><i className="fas fa-phone"></i></label>
            <input
              type="text"
              id="contact"
              name="contact"
              placeholder="Company Contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />
          </div>
          

        </div>
        <div className="form-row">
         
          <div className="form-group">
            <label htmlFor="contactPersonName"><i className="fas fa-user"></i></label>
            <input
              type="text"
              id="contactPersonName"
              name="contactPersonName"
              placeholder="Contact Person Name"
              value={formData.contactPersonName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contactPersonEmail"><i className="fas fa-envelope"></i></label>
            <input
              type="email"
              id="contactPersonEmail"
              name="contactPersonEmail"
              placeholder="Contact Person Email"
              value={formData.contactPersonEmail}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          
          <div className="form-group">
            <label htmlFor="contactPersonPhone"><i className="fas fa-phone"></i></label>
            <input
              type="text"
              id="contactPersonPhone"
              name="contactPersonPhone"
              placeholder="Contact Person Phone"
              value={formData.contactPersonPhone}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="logo"><i className="fas fa-cloud-upload-alt"></i> Logo</label>
            <input
              type='file'
              id="logo"
              name="logo"
              accept=".png, .jpg, .jpeg"
              onChange={handleLogoChange}
            />
          </div>
        </div>
        <button type="submit"><i className="fas fa-paper-plane"></i> {editIndex !== null ? 'Update' : 'Submit'}</button>
      </form>

      <div className="table-container">
        <table className="company-table">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Company Email</th>
              <th>Area</th>
              <th>City</th>
              <th>Country</th>
              <th>Contact</th>
              <th>Contact Person Name</th>
              <th>Contact Person Email</th>
              <th>Contact Person Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={company.id}>
                <td>{company.t_name}</td>
                <td>{company.t_email}</td>
                <td>{company.area}</td>
                <td>{company.city}</td>
                <td>{company.country}</td>
                <td>{company.t_contact}</td>
                <td>{company.t_contact_person_name}</td>
                <td>{company.t_contact_person_email}</td>
                <td>{company.t_contact_person_contact}</td>
                <td>
                  <button onClick={() => handleEdit(index)} className="edit-button"><i className="fas fa-edit"></i></button>
                  <button onClick={() => handleDelete(index)} className="delete-button"><i className="fas fa-trash"></i></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Company;
