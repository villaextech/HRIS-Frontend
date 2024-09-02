import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Addoffice.css"; // Ensure this CSS file includes the necessary styles.

const AddOffice = () => {
  const [formData, setFormData] = useState({
    office_name: "",
    office_address: "",
    contact_email: "",
    contact_phone_number: "",
    postal_address: "",
    office_manager_name: "",
    username: "",
    password: "",
    office_description: "",
    office_hours: "",
    region: "",
    notes: "",
    status: true,
  });
  const [offices, setOffices] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const fetchOffices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://54.86.62.130:8882/api/offices/");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setOffices(data);
    } catch (error) {
      setError("Error fetching offices: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffices();
  }, [fetchOffices]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const processedFormData = { ...formData, status: formData.status ? true : false };

    setLoading(true);
    setError(null);
    try {
      let response;
      if (editIndex !== null) {
        const officeToEdit = offices[editIndex];
        response = await fetch(`http://54.86.62.130:8882/api/offices/${officeToEdit.id}/`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(processedFormData),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const updatedOffice = await response.json();
        const updatedOffices = [...offices];
        updatedOffices[editIndex] = updatedOffice;
        setOffices(updatedOffices);
      } else {
        response = await fetch("http://54.86.62.130:8882/api/offices/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(processedFormData),
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const newOffice = await response.json();
        setOffices((prev) => [...prev, newOffice]);
      }
      setFormData({
        office_name: "",
        office_address: "",
        contact_email: "",
        contact_phone_number: "",
        postal_address: "",
        office_manager_name: "",
        username: "",
        password: "",
        office_description: "",
        office_hours: "",
        region: "",
        notes: "",
        status: true,
      });
      setEditIndex(null);
      setShowFormPopup(false);
    } catch (error) {
      setError("Error submitting office: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    const office = offices[index];
    setFormData({
      office_name: office.office_name,
      office_address: office.office_address,
      contact_email: office.contact_email,
      contact_phone_number: office.contact_phone_number,
      postal_address: office.postal_address,
      office_manager_name: office.office_manager_name,
      username: office.username,
      password: office.password,
      office_description: office.office_description,
      office_hours: office.office_hours,
      region: office.region,
      notes: office.notes || "",
      status: office.status,
    });
    setEditIndex(index);
    setShowFormPopup(true);
  };

  const initiateDelete = (index) => {
    setDeleteIndex(index);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (deleteIndex === null) return;
    const officeToDelete = offices[deleteIndex];

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://54.86.62.130:8882/api/offices/${officeToDelete.id}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      setOffices((prev) => prev.filter((_, i) => i !== deleteIndex));
      setShowDeleteModal(false);
      setDeleteIndex(null);
    } catch (error) {
      setError("Error deleting office: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value || "");
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

  const filteredOffices = offices.filter((office) => {
    const officeName = office.office_name ? office.office_name.toLowerCase() : "";
    const officeAddress = office.office_address ? office.office_address.toLowerCase() : "";
    const search = searchTerm.toLowerCase() || "";
    return officeName.includes(search) || officeAddress.includes(search);
  });

  const paginatedOffices = paginate(filteredOffices, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredOffices.length / itemsPerPage);

  const openForm = () => {
    setFormData({
      office_name: "",
      office_address: "",
      contact_email: "",
      contact_phone_number: "",
      postal_address: "",
      office_manager_name: "",
      username: "",
      password: "",
      office_description: "",
      office_hours: "",
      region: "",
      notes: "",
      status: true,
    });
    setEditIndex(null);
    setShowFormPopup(true);
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-center mb-3 ">
            <span className="T1">Office</span>
            <div className='d-flex align-items-center'>
              <input
                type="text"
                placeholder="Search Office"
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
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editIndex !== null ? "Edit Office" : "Add Office"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowFormPopup(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="office_name"
                          name="office_name"
                          placeholder="Office Name"
                          value={formData.office_name}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="office_address"
                          name="office_address"
                          placeholder="Office Address"
                          value={formData.office_address}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="email"
                          id="contact_email"
                          name="contact_email"
                          placeholder="Contact Email"
                          value={formData.contact_email}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="contact_phone_number"
                          name="contact_phone_number"
                          placeholder="Contact Phone Number"
                          value={formData.contact_phone_number}
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
                          id="postal_address"
                          name="postal_address"
                          placeholder="Postal Address"
                          value={formData.postal_address}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="office_manager_name"
                          name="office_manager_name"
                          placeholder="Office Manager Name"
                          value={formData.office_manager_name}
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
                          id="username"
                          name="username"
                          placeholder="Username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                    <div className="col-md-6">
                      <input
                        name="office_description"
                        placeholder="Office Description"
                        value={formData.office_description}
                        onChange={handleChange}
                        className="form-control"
                      />
                     </div>
                     <div className="col-md-6">
                      <input
                        name="notes"
                        placeholder="Notes"
                        value={formData.notes}
                        onChange={handleChange}
                        className="form-control"
                      />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="office_hours"
                          name="office_hours"
                          placeholder="Office Hours"
                          value={formData.office_hours}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="region"
                          name="region"
                          placeholder="Region"
                          value={formData.region}
                          onChange={handleChange}
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        id="status"
                        name="status"
                        checked={formData.status}
                        onChange={handleChange}
                        className="form-check-input"
                      />
                      <label htmlFor="status" className="form-check-label">
                        Active
                      </label>
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
                  <p>Are you sure you want to delete this office?</p>
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

        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>No</th>
              <th>Office Name</th>
              <th>Office Address</th>
              <th>Contact Email</th>
              <th>Contact Phone Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOffices.map((office, index) => (
              <tr key={office.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td> {/* Numbering logic */}
                <td>{office.office_name}</td>
                <td>{office.office_address}</td>
                <td>{office.contact_email}</td>
                <td>{office.contact_phone_number}</td>
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

export default AddOffice;
