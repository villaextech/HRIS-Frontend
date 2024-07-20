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

  const [countryCodes, setCountryCodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState({ name: '', code: '' });
  const [contactNumber, setContactNumber] = useState("");
  const [logoFile, setLogoFile] = useState(null); // State for logo file
  const [companies, setCompanies] = useState([]); // State for submitted companies
  const [editIndex, setEditIndex] = useState(null); // State for tracking the editing index

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then(response => response.json())
      .then(data => {
        const codes = data.map(country => ({
          name: country.name.common,
          code: country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "")
        }));
        setCountryCodes(codes);
      })
      .catch(error => console.error('Error fetching country codes:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (name === 'contact') {
      setContactNumber(value.replace(selectedCountry.code, ''));
    }
  };

  const handleCountryCodeChange = (e) => {
    const selectedCode = e.target.value;
    const selectedCountry = countryCodes.find(country => country.code === selectedCode);
    setSelectedCountry(selectedCountry);

    setFormData({
      ...formData,
      country: selectedCountry.name,
      contact: `${selectedCode} ${contactNumber}`
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      // Editing an existing company
      const updatedCompanies = companies.map((company, index) => 
        index === editIndex ? { ...formData, logoFile } : company
      );
      setCompanies(updatedCompanies);
      setEditIndex(null);
    } else {
      // Adding a new company
      setCompanies([...companies, { ...formData, logoFile }]);
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
  };

  const handleEdit = (index) => {
    setFormData(companies[index]);
    setLogoFile(companies[index].logoFile);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedCompanies = companies.filter((_, i) => i !== index);
    setCompanies(updatedCompanies);
  };

  const filteredCountryCodes = countryCodes.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <label htmlFor="search"><i className="fas fa-search"></i></label>
            <input
              type="text"
              id="search"
              placeholder="Search Country"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ width: '40%' }}>
            <label htmlFor="country"><i className="fas fa-flag"></i></label>
            <select
              id="country"
              name="country"
              value={selectedCountry.code}
              onChange={handleCountryCodeChange}
              required
              style={{ width: '100%' }}
            >
              <option value="">Select a country</option>
              {filteredCountryCodes.map((country, index) => (
                <option key={index} value={country.code}>
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
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
        </div>
        <div className="form-row">
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
              required
            />
          </div>
        </div>
        <button type="submit"><i className="fas fa-paper-plane"></i> Submit</button>
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
              <th>Logo</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company, index) => (
              <tr key={index}>
                <td>{company.name}</td>
                <td>{company.email}</td>
                <td>{company.area}</td>
                <td>{company.city}</td>
                <td>{company.country}</td>
                <td>{company.contact}</td>
                <td>{company.contactPersonName}</td>
                <td>{company.contactPersonEmail}</td>
                <td>{company.contactPersonPhone}</td>
                <td>{company.logoFile && <img src={URL.createObjectURL(company.logoFile)} alt="Logo" className="logo-img" />}</td>
                <td>
                  <button onClick={() => handleEdit(index)}>Edit</button>
                  <button onClick={() => handleDelete(index)}>Delete</button>
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
