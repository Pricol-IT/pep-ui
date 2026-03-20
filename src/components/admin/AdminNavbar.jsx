import React from 'react';
import { NavLink } from 'react-router-dom';
import './admin.css';

export default function AdminNavbar() {
    return (
        <nav className="admin-navbar">
            <div className="admin-nav-links">
                <NavLink
                    to="/admin/dashboard"
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    end
                >
                    Dashboard
                </NavLink>
                <NavLink
                    to="/admin/access-request"
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                >
                    Access Requests
                </NavLink>
                <NavLink
                    to="/admin/company-location"
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                >
                    Company & Locations
                </NavLink>
                <NavLink
                    to="/admin/announcements"
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                >
                    Announcements
                </NavLink>
            </div>
        </nav>
    );
}
