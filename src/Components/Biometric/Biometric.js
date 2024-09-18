import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import "./Biometric.css";

const Biometric = () => {
  const [formData, setFormData] = useState({
    ip_address: "",
    port_number: "",
    status: true,
    office: "",
    device_name: "", // Added device_name
  });
  const [biometricMachines, setBiometricMachines] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormPopup, setShowFormPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const itemsPerPage = 10;

  const fetchBiometricMachines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/biometric-machines/`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setBiometricMachines(data);
    } catch (error) {
      setError("Error fetching biometric machines: " + error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBiometricMachines();
  }, [fetchBiometricMachines]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMachine = {
      ip_address: formData.ip_address,
      port_number: formData.port_number,
      status: formData.status === 'true',
      office: formData.office,
      device_name: formData.device_name, // Include device_name in the submission
    };

    try {
      if (editIndex !== null) {
        const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/api/biometric-machines${biometricMachines[editIndex].id}/`, newMachine);
        console.log("Update response:", response.data);
        setBiometricMachines((prevMachines) =>
          prevMachines.map((machine, i) =>
            i === editIndex ? { ...machine, ...newMachine } : machine
          )
        );
      } else {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/api/biometric-machines`, newMachine);
        setBiometricMachines([...biometricMachines, response.data]);
      }
    } catch (error) {
      setError("Error submitting data: " + error.message);
    }

    setFormData({
      ip_address: "",
      port_number: "",
      status: true,
      office: "",
      device_name: "", // Reset device_name
    });
    setEditIndex(null);
    setShowFormPopup(false);
  };

  const handleEdit = (index) => {
    if (index >= 0 && index < biometricMachines.length) {
      const machine = biometricMachines[index];
      setFormData({
        ip_address: machine.ip_address || "",
        port_number: machine.port_number || "",
        status: machine.status || true,
        office: machine.office || "",
        device_name: machine.device_name || "", // Include device_name for editing
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
    const machineToDelete = biometricMachines[deleteIndex];

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/biometric-machines/${machineToDelete.id}/`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      setBiometricMachines((prev) => prev.filter((_, i) => i !== deleteIndex));
      setShowDeleteModal(false);
    } catch (error) {
      setError("Error deleting machine: " + error.message);
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

  const filteredMachines = biometricMachines.filter(machine => {
    const ipAddress = machine.ip_address ? machine.ip_address.toLowerCase() : '';
    const search = searchTerm.toLowerCase() || '';
    return ipAddress.includes(search);
  });

  const paginatedMachines = paginate(filteredMachines, currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredMachines.length / itemsPerPage);

  const openForm = () => {
    setFormData({
      ip_address: "",
      port_number: "",
      status: true,
      office: "",
      device_name: "", // Reset device_name when opening form
    });
    setEditIndex(null);
    setShowFormPopup(true);
  };

  return (
    <div className="main">
      <div className="container mt-4">
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="T1">Biometric Machines</span>
            <div className='d-flex align-items-center'>
              <input
                type="text"
                placeholder="Search IP"
                value={searchTerm}
                onChange={handleSearch}
                className="form-control search-input me-2"
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
                  <h5 className="modal-title">{editIndex !== null ? "Edit Machine" : "Add Machine"}</h5>
                  <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
                </div>
                <div className="modal-body c2">
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="ip_address"
                          name="ip_address"
                          placeholder="IP Address"
                          value={formData.ip_address}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                      <div className="col-md-6">
                        <input
                          type="number"
                          id="port_number"
                          name="port_number"
                          placeholder="Port Number"
                          value={formData.port_number}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <select
                          id="status"
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          required
                          className="form-control"
                        >
                          <option value={true}>Active</option>
                          <option value={false}>Deactive</option>
                        </select>
                      </div>
                      <div className="col-md-6">
                        <input
                          type="text"
                          id="office"
                          name="office"
                          placeholder="Office"
                          value={formData.office}
                          onChange={handleChange}
                          required
                          className="form-control"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-md-12">
                        <input
                          type="text"
                          id="device_name"
                          name="device_name"
                          placeholder="Device Name"
                          value={formData.device_name}
                          onChange={handleChange}
                          required
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

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Device Name</th>
                <th>IP Address</th>
                <th>Port Number</th>
                <th>Status</th>
                <th>Office</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {paginatedMachines.length > 0 && (
  paginatedMachines.map((machine, index) => (
    <tr key={index}>
      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
      <td>{machine.device_name}</td>
      <td>{machine.ip_address}</td>
      <td>{machine.port_number}</td>
      <td>{machine.status ? "Active" : "Deactive"}</td>
      <td>{machine.office}</td>
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
  ))
)}

            </tbody>
          </table>
        </div>
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

        {showDeleteModal && (
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content c1">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Deletion</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body c2">
                  Are you sure you want to delete this machine?
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Biometric;
