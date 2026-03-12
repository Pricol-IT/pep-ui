import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar';
import AdminNavbar from './AdminNavbar';
import '../../index.css';

export default function AdminLayout() {
    const { isHR, loading } = useAuth();

    if (loading) return <div>Loading...</div>;

    if (!isHR) {
        return <Navigate to="/admin/access-request" replace />;
    }

    return (
        <div className="admin-layout-content admin-theme">
            <div className="dashboard-bg-pattern"></div>
            <div className="admin-layout-container">
                <AdminNavbar />
                <div className="admin-page-content">
                    <Outlet />
                </div>
            </div>
            <style>{`
        .admin-layout-content {
            min-height: 100%;
            width: 100%;
            background-color: #0f172a;
            position: relative;
            border-radius: 12px; /* Optional: giving it a card-like look or just filling */
        }
        .admin-theme .dashboard-bg-pattern {
            background-image: radial-gradient(#334155 1px, transparent 1px);
            background-size: 24px 24px;
            opacity: 0.3;
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            pointer-events: none;
        }
      `}</style>
        </div>
    );
}
