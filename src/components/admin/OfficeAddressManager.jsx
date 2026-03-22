import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './admin.css';

export default function OfficeAddressManager() {
    const [locations, setLocations] = useState([]); // This will now just be office details
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [form, setForm] = useState({
        office_name: '',
        image: '',
        address: '',
        city: '',
        latitude: '',
        longitude: ''
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/office-details');
            setLocations(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch office details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddNew = () => {
        setSelectedOffice(null);
        setForm({
            office_name: '',
            image: '',
            address: '',
            city: '',
            latitude: '',
            longitude: ''
        });
        setShowModal(true);
    };

    const handleEdit = (office) => {
        setSelectedOffice(office);
        setForm({
            office_name: office.office_name || '',
            image: office.image || '',
            address: office.address || '',
            city: office.city || '',
            latitude: office.latitude || '',
            longitude: office.longitude || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this office?')) return;
        try {
            await axios.delete(`/api/admin/office-details/${id}`);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to delete office');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/admin/office-details', {
                ...form,
                id: selectedOffice?.id
            });
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('Failed to save office details');
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                    <h1 className="admin-header">Office Address Management</h1>
                    <p style={{ color: '#94a3b8' }}>Configure physical office details and weather coordinates.</p>
                </div>
                <button className="btn-primary" onClick={handleAddNew}>
                    <i className="fas fa-plus"></i> Add New Office
                </button>
            </div>

            <div className="admin-table-card">
                {error && <div className="error-message" style={{ padding: '1rem', color: '#ef4444' }}>{error}</div>}
                
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>Loading offices...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Office Name</th>
                                    <th>City</th>
                                    <th>Address</th>
                                    <th>Weather (Lat/Lon)</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locations.map(loc => (
                                    <tr key={loc.id}>
                                        <td style={{ fontWeight: '600' }}>{loc.office_name}</td>
                                        <td>{loc.city || '-'}</td>
                                        <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.85rem', color: '#94a3b8' }}>
                                            {loc.address || '-'}
                                        </td>
                                        <td>
                                            {loc.latitude ? (
                                                <span style={{ color: '#10b981', fontSize: '0.85rem' }}>
                                                    {loc.latitude}, {loc.longitude}
                                                </span>
                                            ) : (
                                                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Not set</span>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button 
                                                    className="btn-primary" 
                                                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}
                                                    onClick={() => handleEdit(loc)}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    className="btn-secondary" 
                                                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                                                    onClick={() => handleDelete(loc.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="sync-modal-overlay">
                    <div className="sync-modal-content" style={{ maxWidth: '500px' }}>
                        <div className="sync-modal-header">
                            <h2>{selectedOffice ? 'Edit Office' : 'Add New Office'}</h2>
                            <button className="sync-close-btn" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSave}>
                            <div className="sync-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Office Name</label>
                                    <input 
                                        type="text" 
                                        className="admin-input"
                                        value={form.office_name}
                                        onChange={e => setForm({...form, office_name: e.target.value})}
                                        required
                                        placeholder="e.g. Corporate Technology Center"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>City</label>
                                    <input 
                                        type="text" 
                                        className="admin-input"
                                        value={form.city}
                                        onChange={e => setForm({...form, city: e.target.value})}
                                        placeholder="e.g. Coimbatore"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Address</label>
                                    <textarea 
                                        className="admin-input"
                                        value={form.address}
                                        onChange={e => setForm({...form, address: e.target.value})}
                                        placeholder="Full address..."
                                        rows="3"
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Image Path/URL</label>
                                    <input 
                                        type="text" 
                                        className="admin-input"
                                        value={form.image}
                                        onChange={e => setForm({...form, image: e.target.value})}
                                        placeholder="/lmage/CTC.png"
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className="form-group">
                                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Latitude</label>
                                        <input 
                                            type="number" step="any"
                                            className="admin-input"
                                            value={form.latitude}
                                            onChange={e => setForm({...form, latitude: e.target.value})}
                                            placeholder="11.0168"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.4rem', fontSize: '0.9rem' }}>Longitude</label>
                                        <input 
                                            type="number" step="any"
                                            className="admin-input"
                                            value={form.longitude}
                                            onChange={e => setForm({...form, longitude: e.target.value})}
                                            placeholder="76.9558"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sync-modal-footer">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)} style={{ background: '#334155', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                                <button type="submit" className="btn-primary">Save Office</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-input {
                    width: 100%; 
                    background: #0f172a; 
                    border: 1px solid rgba(255,255,255,0.1); 
                    color: #fff; 
                    padding: 0.6rem; 
                    borderRadius: 4px;
                    outline: none;
                }
                .admin-input:focus {
                    border-color: #d4af37;
                }
            `}</style>
        </div>
    );
}
