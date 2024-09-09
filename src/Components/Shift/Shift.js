import React, { useState, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import "./Shift.css";

const Shift = () => {
    const [formData, setFormData] = useState({
        shift_name: "",
        start_time: "",
        end_time: "",
        description: "",
    });
    const [shifts, setShifts] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showFormPopup, setShowFormPopup] = useState(false);
    const [focusStartTime, setFocusStartTime] = useState(false);
    const [focusEndTime, setFocusEndTime] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);
    const itemsPerPage = 10;

    const fetchShifts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("http://54.86.62.130:8882/api/shifts/");
            if (!response.ok) throw new Error("Network response was not ok");
            const data = await response.json();
            setShifts(data);
        } catch (error) {
            setError("Error fetching shifts: " + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShifts();
    }, [fetchShifts]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newShift = {
            shift_name: formData.shift_name,
            start_time: formData.start_time,
            end_time: formData.end_time,
            description: formData.description,
        };

        try {
            if (editIndex !== null) {
                await axios.put(`http://54.86.62.130:8882/api/shifts/${shifts[editIndex].id}/`, newShift);
                setShifts((prevShifts) =>
                    prevShifts.map((shift, i) =>
                        i === editIndex ? { ...shift, ...newShift } : shift
                    )
                );
            } else {
                const response = await axios.post("http://54.86.62.130:8882/api/shifts/", newShift);
                setShifts([...shifts, response.data]);
            }
        } catch (error) {
            setError("Error submitting data: " + error.message);
        }

        setFormData({
            shift_name: "",
            start_time: "",
            end_time: "",
            description: "",
        });
        setEditIndex(null);
        setShowFormPopup(false);
    };


    const handleEdit = (index) => {
        if (index >= 0 && index < shifts.length) {
            const shift = shifts[index];
            setFormData({
                shift_name: shift.shift_name || "",
                start_time: shift.start_time || "",
                end_time: shift.end_time || "",
                description: shift.description || "",
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
        const shiftToDelete = shifts[deleteIndex];

        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://54.86.62.130:8882/api/shifts/${shiftToDelete.id}/`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Network response was not ok");
            setShifts((prev) => prev.filter((_, i) => i !== deleteIndex));
            setShowDeleteModal(false);
        } catch (error) {
            setError("Error deleting shift: " + error.message);
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

    const filteredShifts = shifts.filter(shift => {
        const shiftName = shift.shift_name ? shift.shift_name.toLowerCase() : '';
        const search = searchTerm.toLowerCase() || '';
        return shiftName.includes(search);
    });

    const paginatedShifts = paginate(filteredShifts, currentPage, itemsPerPage);
    const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);

    const openForm = () => {
        setFormData({
            shift_name: "",
            start_time: "",
            end_time: "",
            description: "",
        });
        setEditIndex(null);
        setShowFormPopup(true);
    };

    return (
        <div className="main">
            <div className="container mt-4">
                <div className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="T1">Shifts</span>
                        <div className='d-flex align-items-center'>
                            <input
                                type="text"
                                placeholder="Search Shifts"
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
                            <div className="modal-content " style={{ height: "280px", width: "630px", marginLeft: "50px" }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">{editIndex !== null ? "Edit Shift" : "Add Shift"}</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowFormPopup(false)}></button>
                                </div>
                                <div className="modal-body c2">
                                    <form onSubmit={handleSubmit}>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    id="shift_name"
                                                    name="shift_name"
                                                    placeholder="Shift Name"
                                                    value={formData.shift_name}
                                                    onChange={handleChange}
                                                    required
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type={focusStartTime ? 'time' : 'text'}
                                                    id="start_time"
                                                    name="start_time"
                                                    placeholder="Start Time"
                                                    value={formData.start_time}
                                                    onChange={handleChange}
                                                    required
                                                    className="form-control custom-date-input"
                                                    onFocus={() => setFocusStartTime(true)}
                                                    onBlur={() => setFocusStartTime(false)}
                                                />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <input
                                                    type={focusEndTime ? 'time' : 'text'}
                                                    id="end_time"
                                                    name="end_time"
                                                    placeholder="End Time"
                                                    value={formData.end_time}
                                                    onChange={handleChange}
                                                    required
                                                    className="form-control custom-date-input"
                                                    onFocus={() => setFocusEndTime(true)}
                                                    onBlur={() => setFocusEndTime(false)}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    id="description"
                                                    name="description"
                                                    placeholder="Description"
                                                    value={formData.description}
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
                {paginatedShifts.length > 0 && (
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Shift Name</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedShifts.map((shift, index) => (
                                    <tr key={index}>
                                        <td>{shift.shift_name}</td>
                                        <td>{shift.start_time}</td>
                                        <td>{shift.end_time}</td>
                                        <td>{shift.description}</td>
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
                    </div>
                )}

                {filteredShifts.length > itemsPerPage && (
                    <div className="pagination">
                        <button
                            className="btn page1"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                className={`btn page1 ${index + 1 === currentPage ? "active" : ""}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            className="btn page1"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}

                {showDeleteModal && (
                    <div className="modal show" style={{ display: "block" }}>
                        <div className="modal-dialog">
                            <div className="modal-content " style={{ height: "300px", width: "500px", marginLeft: "50px" }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                                </div>
                                <div className="modal-body c2">
                                    <p>Are you sure you want to delete this shift?</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Yes</button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Shift;
