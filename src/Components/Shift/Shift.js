import React, { useState, useEffect, useCallback } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Shift.css';

const Shift = () => {
    const [formData, setFormData] = useState({
        shift_name: '',
        start_time: '',
        end_time: '',
        description: '',
    });
    const [shifts, setShifts] = useState([]);
    const [focusStartTime, setFocusStartTime] = useState(false);
    const [focusEndTime, setFocusEndTime] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFormPopup, setShowFormPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const itemsPerPage = 10;

    // Fetch shifts from the API
    const fetchShifts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://54.86.62.130:8882/api/shifts/');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setShifts(data);
        } catch (error) {
            setError('Error fetching shifts: ' + error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchShifts();
    }, [fetchShifts]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Submit form data (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            let response;
            if (editIndex !== null) {
                const shiftToEdit = shifts[editIndex];
                response = await fetch(`http://54.86.62.130:8882/api/shifts/${shiftToEdit.id}/`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const updatedShift = await response.json();
                const updatedShifts = [...shifts];
                updatedShifts[editIndex] = updatedShift;
                setShifts(updatedShifts);
            } else {
                response = await fetch('http://54.86.62.130:8882/api/shifts/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const newShift = await response.json();
                setShifts((prev) => [...prev, newShift]);
            }

            setFormData({
                shift_name: '',
                start_time: '',
                end_time: '',
                description: '',
            });
            setEditIndex(null);
            setShowFormPopup(false);
        } catch (error) {
            setError('Error submitting shift: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const openForm = (index = null) => {
        if (index !== null) {
            setFormData({
                shift_name: shifts[index].shift_name,
                start_time: shifts[index].start_time,
                end_time: shifts[index].end_time,
                description: shifts[index].description,
            });
            setEditIndex(index);
        } else {
            setFormData({
                shift_name: '',
                start_time: '',
                end_time: '',
                description: '',
            });
            setEditIndex(null);
        }
        setShowFormPopup(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this shift?')) {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`http://54.86.62.130:8882/api/shifts/${id}/`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Network response was not ok');
                setShifts(shifts.filter((shift) => shift.id !== id));
            } catch (error) {
                setError('Error deleting shift: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    // Pagination logic
    const totalPages = Math.ceil(shifts.length / itemsPerPage);
    const paginatedShifts = shifts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page) => setCurrentPage(page);
    const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="main">
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="T1">Shift</span>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            placeholder="Search Shift"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-control search-input me-2"
                        />
                        <button className="btn add1" onClick={() => openForm()}>
                            Add
                        </button>
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

                {/* Table displaying shift data */}
                <table className="table table-striped">
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
                        {paginatedShifts
                            .filter((shift) =>
                                shift.shift_name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((shift, index) => (
                                <tr key={shift.id}>
                                    <td>{shift.shift_name}</td>
                                    <td>{shift.start_time}</td>
                                    <td>{shift.end_time}</td>
                                    <td>{shift.description}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => openForm(shifts.indexOf(shift))}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(shift.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* Pagination Component */}
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

                {/* Form Popup */}
                {showFormPopup && (
                    <div className="modal show" style={{ display: 'block' }}>
                        <div className="modal-dialog">
                            <div className="modal-content c7">
                                <div className="modal-header">
                                    <h5 className="modal-title">
                                        {editIndex !== null ? 'Edit Shift' : 'Add Shift'}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setShowFormPopup(false)}
                                    ></button>
                                </div>
                                <div className="modal-body c8">
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
                                                <textarea
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
            </div>
        </div>
    );
};

export default Shift;
