import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AccessRequestStatus() {
    const [status, setStatus] = useState(null); // null, pending, approved, rejected, none
    const [loading, setLoading] = useState(true);
    const { user, checkAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        try {
            const res = await axios.get('/admin/access-request/status');
            setStatus(res.data ? res.data.status : 'none');
        } catch (error) {
            console.error(error);
            setStatus('none');
        } finally {
            setLoading(false);
        }
    };

    const handleRequestAccess = async () => {
        try {
            setLoading(true);
            await axios.post('/admin/access-request');
            await fetchStatus();
        } catch (error) {
            alert('Failed to request access.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading status...</div>;

    if (status === 'approved') {
        return (
            <div className="access-container">
                <h2>Access Granted</h2>
                <p>Your request has been approved.</p>
                <button onClick={() => window.location.href = '/admin'}>Go to Admin Dashboard</button>
            </div>
        );
    }

    return (
        <div className="access-container">
            <div className="access-card">
                <h1>Admin Portal Access</h1>

                {status === 'pending' && (
                    <div className="status-box pending">
                        <h3>Request Pending</h3>
                        <p>Your request for admin access is awaiting approval by a Superadmin.</p>
                    </div>
                )}

                {status === 'rejected' && (
                    <div className="status-box rejected">
                        <h3>Request Rejected</h3>
                        <p>Your request was rejected. Please contact support if you believe this is an error.</p>
                    </div>
                )}

                {status === 'none' && (
                    <div className="request-box">
                        <p>You do not have access to the Admin Portal. Would you like to request access?</p>
                        <button className="request-btn" onClick={handleRequestAccess}>
                            Request Admin Access
                        </button>
                    </div>
                )}

                <button className="back-btn" onClick={() => navigate('/')}>Back to Dashboard</button>
            </div>

            <style>{`
                .access-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 80vh;
                    color: white;
                }
                .access-card {
                    background: rgba(30, 41, 59, 0.8);
                    padding: 2rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    text-align: center;
                    max-width: 500px;
                    width: 100%;
                    backdrop-filter: blur(10px);
                }
                .access-card h1 { margin-bottom: 1.5rem; color: #fff; }
                .status-box {
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                }
                .status-box.pending {
                    background: rgba(234, 179, 8, 0.1);
                    border: 1px solid rgba(234, 179, 8, 0.3);
                    color: #facc15;
                }
                .status-box.rejected {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #f87171;
                }
                .request-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    margin-bottom: 1rem;
                    width: 100%;
                }
                .back-btn {
                    background: transparent;
                    color: #94a3b8;
                    border: 1px solid #475569;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                }
                .back-btn:hover { background: rgba(255,255,255,0.05); color: white; }
            `}</style>
        </div>
    );
}
