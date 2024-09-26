import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import "./Company.css";

const Company = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    area: "",
    city: "",
    country: "",
    contact: "",
    contactPersonName: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const itemsPerPage = 10;

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tenants/`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      setError("Error fetching companies: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };



  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newCompany = {
      t_name: formData.name,
      t_email: formData.email,
      area: formData.area,
      city: formData.city,
      country: formData.country,
      t_contact: formData.contact,
      t_contact_person_name: formData.contactPersonName,
      t_contact_person_email: formData.contactPersonEmail,
      t_contact_person_contact: formData.contactPersonPhone,
    };

    const form = new FormData();
    form.append("t_name", newCompany.t_name);
    form.append("t_email", newCompany.t_email);
    form.append("area", newCompany.area);
    form.append("city", newCompany.city);
    form.append("country", newCompany.country);
    form.append("t_contact", newCompany.t_contact);
    form.append("t_contact_person_name", newCompany.t_contact_person_name);
    form.append("t_contact_person_email", newCompany.t_contact_person_email);
    form.append("t_contact_person_contact", newCompany.t_contact_person_contact);

    if (logoFile) {
      form.append("logo", logoFile);
    }

    try {
      if (editIndex !== null) {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/tenants/${companies[editIndex].id}/`, form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log("Update response:", response.data);
        setCompanies((prevCompanies) =>
          prevCompanies.map((company, i) =>
            i === editIndex ? { ...company, ...newCompany, logo: response.data.logo } : company
          )
        );
      } else {
        const response = await axios.post("{process.env.REACT_APP_BASE_URL}/api/tenants/", form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setCompanies([...companies, response.data]);
      }
    } catch (error) {
      setError("Error submitting data: " + error.message);
    }

    setFormData({
      name: "",
      email: "",
      area: "",
      city: "",
      country: "",
      contact: "",
      contactPersonName: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
    });
    setLogoFile(null);
    setEditIndex(null);
    setShowFormPopup(false);
  };



  const handleEdit = (index) => {
    if (index >= 0 && index < companies.length) {
      const company = companies[index];
      setFormData({
        name: company.t_name || "",
        email: company.t_email || "",
        area: company.area || "",
        city: company.city || "",
        country: company.country || "",
        contact: company.t_contact || "",
        contactPersonName: company.t_contact_person_name || "",
        contactPersonEmail: company.t_contact_person_email || "",
        contactPersonPhone: company.t_contact_person_contact || "",
      });
      setEditIndex(index);
      setShowFormPopup(true);
    } else {
      setError("Invalid index for editing: " + index);
    }
  };





  const initiateDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    const companyToDelete = companies[deleteIndex];

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/tenants/${companyToDelete.id}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      setCompanies((prev) => prev.filter((_, i) => i !== deleteIndex));
      setShowDeleteModal(false);
    } catch (error) {
      setError("Error deleting company: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value || "");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const paginate = (items, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const filteredCompanies = companies.filter(company => {
    const companyName = company.t_name ? company.t_name.toLowerCase() : '';
    const companyEmail = company.t_email ? company.t_email.toLowerCase() : '';
    const search = searchTerm.toLowerCase() || '';
    return companyName.includes(search) || companyEmail.includes(search);
  });

  const paginatedCompanies = paginate(filteredCompanies, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const openForm = () => {
    setFormData({
      name: "",
      email: "",
      area: "",
      city: "",
      country: "",
      contact: "",
      contactPersonName: "",
      contactPersonEmail: "",
      contactPersonPhone: "",
    });
    setLogoFile(null);
    setEditIndex(null);
    setShowFormPopup(true);
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3 ">
            <span className="T1">Company</span>
            <div className='d-flex align-items-center'>
              <input
                type="text"
                placeholder="Search Company"
                value={searchTerm}
                onChange={handleSearch}
                className="form-control search-input me-2 "
              />
              <button className="btn add1 me-8" onClick={openForm}>
                Add
              </button>
              </div>
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
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content c1">
                <div className="modal-header">
                  <h5 className="modal-title">{editIndex !== null ? "Edit Company" : "Add Company"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
                </div>
                <div className="modal-body c2">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Company Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Company Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="country"
                          name="country"
                          placeholder="Country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="city"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="area"
                          name="area"
                          placeholder="Area"
                          value={formData.area}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="contact"
                          name="contact"
                          placeholder="Contact"
                          value={formData.contact}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="contactPersonName"
                          name="contactPersonName"
                          placeholder="Contact Person Name"
                          value={formData.contactPersonName}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="email"
                          id="contactPersonEmail"
                          name="contactPersonEmail"
                          placeholder="Contact Person Email"
                          value={formData.contactPersonEmail}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="contactPersonPhone"
                          name="contactPersonPhone"
                          placeholder="Contact Person Phone"
                          value={formData.contactPersonPhone}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="file"
                          id="logo"
                          name="logo"
                          accept=".png, .jpg, .jpeg"
                          onChange={handleLogoChange}
                          className="form-control"
                        />
                      </div>
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


        {showDeleteModal && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content" style={{ height: "300px", width: "500px", marginLeft: "50px" }}>
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete this company?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>
                    Yes
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        <table className="table table-striped t1">
          <thead className="align-middle">
            <tr>
              <th>No</th>
              <th>Company</th>
              <th>Email</th>
              <th>Country</th>
              <th>City</th>
              <th>Area</th>
              <th>Contact</th>
              <th>Person</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCompanies.map((company, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Added row number */}
                <td>{company.t_name}</td>
                <td>{company.t_email}</td>
                <td>{company.country}</td>
                <td>{company.city}</td>
                <td>{company.area}</td>
                <td>{company.t_contact}</td>
                <td>{company.t_contact_person_name}</td>
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
                    onClick={() => initiateDelete(index)}
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

export default Company;
