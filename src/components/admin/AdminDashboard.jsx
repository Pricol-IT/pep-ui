import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AnalyticsCharts from './AnalyticsCharts';
import './admin.css';

export default function AdminDashboard() {
    const { user, isAdmin, isSuperadmin } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await axios.get('/api/admin/requests');
            setRequests(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error('Failed to fetch requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm('Are you sure you want to approve this request? The user will become HR by default.')) return;
        try {
            await axios.post(`/api/admin/requests/${id}/approve`);
            fetchRequests(); // Refresh list
        } catch (error) {
            alert('Failed to approve request.');
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Are you sure you want to reject this request?')) return;
        try {
            await axios.post(`/api/admin/requests/${id}/reject`);
            fetchRequests(); // Refresh list
        } catch (error) {
            alert('Failed to reject request.');
        }
    };

    if (loading) return <div className="admin-dashboard">Loading dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <h1 className="admin-header">Admin Dashboard</h1>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <h3 className="stat-title">Pending Requests</h3>
                    <p className="stat-value">{requests?.length || 0}</p>
                </div>
                {/* Add more stats here later */}
            </div>

            <AnalyticsCharts />

            <div className="admin-table-card">
                <div className="card-header">
                    <h2 className="card-title">Access Requests</h2>
                </div>

                {!Array.isArray(requests) || requests.length === 0 ? (
                    <div className="empty-state">
                        No pending access requests.
                    </div>
                ) : (
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Requested Role</th>
                                    <th>Date</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {requests.map(req => (
                                    <tr key={req.id}>
                                        <td>
                                            <div className="user-cell">
                                                {req.user.avatar ? (
                                                    <img src={req.user.avatar} className="user-avatar" alt="" />
                                                ) : (
                                                    <div className="user-avatar-placeholder">
                                                        {req.user.name.charAt(0)}
                                                    </div>
                                                )}
                                                <span className="user-name">{req.user.name}</span>
                                            </div>
                                        </td>
                                        <td className="user-email">{req.user.email}</td>
                                        <td>
                                            <span className="badge badge-role">
                                                {req.requested_role}
                                            </span>
                                        </td>
                                        <td className="user-email">
                                            {new Date(req.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    onClick={() => handleApprove(req.id)}
                                                    className="btn-action btn-approve"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(req.id)}
                                                    className="btn-action btn-reject"
                                                >
                                                    Reject
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
        </div>
    );
}
