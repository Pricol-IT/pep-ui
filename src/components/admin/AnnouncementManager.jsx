import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './admin.css';

export default function AnnouncementManager() {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        content: '',
        badge_text: 'NEW',
        is_active: false,
        start_date: '',
        end_date: '',
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/admin/announcements');
            setAnnouncements(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            if (isEditing) {
                await axios.put(`/admin/announcements/${editingId}`, formData);
            } else {
                await axios.post('/admin/announcements', formData);
            }
            resetForm();
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to save announcement');
        }
    };

    const handleEdit = (ann) => {
        setIsEditing(true);
        setEditingId(ann.id);
        setFormData({
            content: ann.content,
            badge_text: ann.badge_text || 'NEW',
            is_active: !!ann.is_active,
            start_date: ann.start_date ? ann.start_date.split('T')[0] : '',
            end_date: ann.end_date ? ann.end_date.split('T')[0] : '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleToggle = async (ann) => {
        try {
            await axios.patch(`/admin/announcements/${ann.id}/toggle`);
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
            alert('Failed to toggle status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;
        try {
            await axios.delete(`/admin/announcements/${id}`);
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
            alert('Failed to delete');
        }
    };

    const resetForm = () => {
        setFormData({
            content: '',
            badge_text: 'NEW',
            is_active: false,
            start_date: '',
            end_date: '',
        });
        setIsEditing(false);
        setEditingId(null);
    };

    return (
        <div className="admin-dashboard">
            <h1 className="admin-header">Announcement Management</h1>

            <div className="admin-table-card" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
                <h2 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
                </h2>
                <form onSubmit={handleSubmit} className="announcement-form">
                    <div className="form-group" style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Content</label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleInputChange}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                background: '#1e293b', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '6px',
                                color: '#fff',
                                minHeight: '80px'
                            }}
                            placeholder="Type announcement message here..."
                        />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Badge Text</label>
                            <input
                                type="text"
                                name="badge_text"
                                value={formData.badge_text}
                                onChange={handleInputChange}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    background: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: '6px',
                                    color: '#fff'
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>Start Date</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleInputChange}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    background: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: '6px',
                                    color: '#fff'
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '0.5rem' }}>End Date</label>
                            <input
                                type="date"
                                name="end_date"
                                value={formData.end_date}
                                onChange={handleInputChange}
                                style={{ 
                                    width: '100%', 
                                    padding: '0.75rem', 
                                    background: '#1e293b', 
                                    border: '1px solid rgba(255,255,255,0.1)', 
                                    borderRadius: '6px',
                                    color: '#fff'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="is_active"
                                checked={formData.is_active}
                                onChange={handleInputChange}
                                style={{ width: '18px', height: '18px' }}
                            />
                            Active
                        </label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ background: '#d4af37' }}>
                            {isEditing ? 'Update Announcement' : 'Create Announcement'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '6px', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="admin-table-card">
                <h2 style={{ color: '#fff', fontSize: '1.2rem', padding: '1.5rem 1.5rem 0' }}>Announcement Records</h2>
                {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Content</th>
                                    <th>Badge</th>
                                    <th>Dates</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {announcements.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No announcements found.</td>
                                    </tr>
                                ) : (
                                    announcements.map(ann => (
                                        <tr key={ann.id}>
                                            <td style={{ maxWidth: '300px' }}>{ann.content}</td>
                                            <td><span className="badge-new" style={{ fontSize: '0.7rem' }}>{ann.badge_text}</span></td>
                                            <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                                {ann.start_date ? new Date(ann.start_date).toLocaleDateString() : 'Immediate'} - {ann.end_date ? new Date(ann.end_date).toLocaleDateString() : 'Ongoing'}
                                            </td>
                                            <td>
                                                <button 
                                                    onClick={() => handleToggle(ann)}
                                                    style={{ 
                                                        background: ann.is_active ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: ann.is_active ? '#22c55e' : '#ef4444',
                                                        border: `1px solid ${ann.is_active ? '#22c55e' : '#ef4444'}`,
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.75rem',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    {ann.is_active ? 'ON' : 'OFF'}
                                                </button>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <button onClick={() => handleEdit(ann)} style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer' }} title="Edit">
                                                        <i className="ti ti-edit"></i>
                                                    </button>
                                                    <button onClick={() => handleDelete(ann.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                                                        <i className="ti ti-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
