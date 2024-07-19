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
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [logoFile, setLogoFile] = useState(null); // State for logo file

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
      setContactNumber(value.replace(selectedCountryCode, ''));
    }
  };

  const handleCountryCodeChange = (e) => {
    const selectedCode = e.target.value;
    setSelectedCountryCode(selectedCode);

    setFormData({
      ...formData,
      contact: `${selectedCode} ${contactNumber}`
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    console.log(logoFile); // Log the logo file object

    // Include formData and logoFile in your submission logic
  };

  const filteredCountryCodes = countryCodes.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
        <div className="form-group"style={{ width: '40%' }}>
          <label htmlFor="logo"><i className="fas fa-file-upload"></i></label>
          <input
            id="logo"
            name="logo"
            accept=".png, .jpg, .jpeg"
            onChange={handleLogoChange}
            required
            style={{ width: '100%' }}
            
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
            value={selectedCountryCode}
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
      <button type="submit"><i className="fas fa-paper-plane"></i> Submit</button>
    </form>
  );
};

export default Company;
