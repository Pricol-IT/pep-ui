import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './admin.css';

export default function CompanyLocationManager() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('companies');
    const [companies, setCompanies] = useState([]);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Delete Confirmation State
    const [deleteConfirmation, setDeleteConfirmation] = useState({
        show: false,
        id: null,
        type: null,
        name: ''
    });

    // Form States
    const [companyForm, setCompanyForm] = useState({ name: '', short_name: '' });
    const [locationForm, setLocationForm] = useState({ name: '', company_id: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'companies') {
                const res = await axios.get('/admin/companies');
                setCompanies(Array.isArray(res.data) ? res.data : []);
            } else {
                const res = await axios.get('/admin/locations');
                setLocations(Array.isArray(res.data) ? res.data : []);
                // Also fetch companies for the dropdown if not already fetched
                if (companies.length === 0) {
                    const compRes = await axios.get('/admin/companies');
                    setCompanies(Array.isArray(compRes.data) ? compRes.data : []);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCompanySubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await axios.post('/admin/companies', companyForm);
            setShowModal(false);
            setCompanyForm({ name: '', short_name: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create company');
        }
    };

    const handleLocationSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await axios.post('/admin/locations', locationForm);
            setShowModal(false);
            setLocationForm({ name: '', company_id: '' });
            fetchData();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create location');
        }
    };

    const handleDelete = (id, type, name) => {
        setDeleteConfirmation({
            show: true,
            id,
            type,
            name
        });
    };

    const confirmDelete = async () => {
        const { id, type } = deleteConfirmation;
        try {
            const endpoint = type === 'company' ? `/admin/companies/${id}` : `/admin/locations/${id}`;
            await axios.delete(endpoint);
            setDeleteConfirmation({ show: false, id: null, type: null, name: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete item');
            setDeleteConfirmation({ show: false, id: null, type: null, name: '' });
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header-row">
                <h1 className="admin-header">Company & Location Management</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <i className="fas fa-plus"></i> Add {activeTab === 'companies' ? 'Company' : 'Location'}
                </button>
            </div>

            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'companies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('companies')}
                >
                    Companies
                </button>
                <button
                    className={`admin-tab ${activeTab === 'locations' ? 'active' : ''}`}
                    onClick={() => setActiveTab('locations')}
                >
                    Locations
                </button>
            </div>

            <div className="admin-table-card">
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>Loading...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    {activeTab === 'companies' && <th>Short Name</th>}
                                    {activeTab === 'locations' && <th>Company</th>}
                                    <th>Created By</th>
                                    <th>Created At</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeTab === 'companies' ? (
                                    companies.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>No companies found</td></tr>
                                    ) : (
                                        companies.map(comp => (
                                            <tr key={comp.id}>
                                                <td>{comp.name}</td>
                                                <td>{comp.short_name}</td>
                                                <td>
                                                    <div className="user-cell">
                                                        {comp.creator?.avatar && <img src={comp.creator.avatar} className="user-avatar" alt="" />}
                                                        <span>{comp.creator?.name || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td>{new Date(comp.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="btn-icon delete-btn" onClick={() => handleDelete(comp.id, 'company', comp.name)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                ) : (
                                    locations.length === 0 ? (
                                        <tr><td colSpan="4" style={{ textAlign: 'center' }}>No locations found</td></tr>
                                    ) : (
                                        locations.map(loc => (
                                            <tr key={loc.id}>
                                                <td>{loc.name}</td>
                                                <td>{loc.company?.name}</td>
                                                <td>
                                                    <div className="user-cell">
                                                        {loc.creator?.avatar && <img src={loc.creator.avatar} className="user-avatar" alt="" />}
                                                        <span>{loc.creator?.name || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td>{new Date(loc.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="btn-icon delete-btn" onClick={() => handleDelete(loc.id, 'location', loc.name)}>
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmation.show && (
                <div className="modal-overlay">
                    <div className="modal-content admin-modal delete-modal">
                        <div className="modal-header">
                            <h2 className="text-danger">Delete {deleteConfirmation.type === 'company' ? 'Company' : 'Location'}</h2>
                            <button className="close-btn" onClick={() => setDeleteConfirmation({ show: false, id: null, type: null, name: '' })}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete <strong>{deleteConfirmation.name}</strong>?</p>
                            <p className="text-sm text-muted">This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setDeleteConfirmation({ show: false, id: null, type: null, name: '' })}>Cancel</button>
                            <button className="btn-danger" onClick={confirmDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content admin-modal">
                        <div className="modal-header">
                            <h2>Add New {activeTab === 'companies' ? 'Company' : 'Location'}</h2>
                            <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={activeTab === 'companies' ? handleCompanySubmit : handleLocationSubmit}>
                            <div className="modal-body">
                                {error && <div className="error-message">{error}</div>}

                                {activeTab === 'companies' ? (
                                    <>
                                        <div className="form-group">
                                            <label>Company Name</label>
                                            <input
                                                type="text"
                                                value={companyForm.name}
                                                onChange={e => setCompanyForm({ ...companyForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Short Name</label>
                                            <input
                                                type="text"
                                                value={companyForm.short_name}
                                                onChange={e => setCompanyForm({ ...companyForm, short_name: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="form-group">
                                            <label>Location Name (Plant)</label>
                                            <input
                                                type="text"
                                                value={locationForm.name}
                                                onChange={e => setLocationForm({ ...locationForm, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Company</label>
                                            <select
                                                value={locationForm.company_id}
                                                onChange={e => setLocationForm({ ...locationForm, company_id: e.target.value })}
                                                required
                                                className="admin-select"
                                            >
                                                <option value="">Select Company</option>
                                                {companies.map(c => (
                                                    <option key={c.id} value={c.id}>{c.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                }
                .admin-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    padding-bottom: 1px;
                }
                .admin-tab {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    padding: 0.75rem 1.5rem;
                    cursor: pointer;
                    font-size: 1rem;
                    border-bottom: 2px solid transparent;
                    transition: all 0.2s;
                }
                .admin-tab.active {
                    color: #fff;
                    border-bottom-color: #d4af37;
                }
                .admin-tab:hover {
                    color: #cbd5e1;
                }
                .btn-primary {
                    background: #d4af37;
                    color: #0f172a;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.7);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .admin-modal {
                    background: #1e293b;
                    border: 1px solid #334155;
                    color: #fff;
                    width: 400px;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #334155;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    color: #94a3b8;
                    font-size: 0.9rem;
                }
                .form-group input, .admin-select {
                    width: 100%;
                    padding: 0.75rem;
                    background: #0f172a;
                    border: 1px solid #334155;
                    border-radius: 6px;
                    color: #fff;
                }
                .modal-footer {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid #334155;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                }
                .btn-secondary {
                    background: transparent;
                    color: #94a3b8;
                    border: 1px solid #334155;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                }
                .btn-icon {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    padding: 6px;
                    border-radius: 4px;
                    transition: all 0.2s;
                    color: #94a3b8;
                }
                .btn-icon:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #fff;
                }
                .delete-btn:hover {
                    color: #ef4444;
                    background: rgba(239, 68, 68, 0.1);
                }
                .text-danger {
                    color: #ef4444;
                }
                .text-muted {
                    color: #94a3b8;
                }
                .text-sm {
                   font-size: 0.875rem; 
                }
                .btn-danger {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }
                .btn-danger:hover {
                    background: #dc2626;
                }
                .delete-modal {
                    max-width: 400px;
                    border-color: #ef4444;
                }
            `}</style>
        </div>
    );
}
