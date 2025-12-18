import React, { useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
    const [activeSection, setActiveSection] = useState('dashboard');

    const handleNavClick = (section) => {
        setActiveSection(section);
        if (window.innerWidth <= 1024) {
            onClose();
        }
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>

            <aside className={`sidenav ${isOpen ? 'open' : ''}`} id="sidenav">
                <div className="nav-card">
                    {/* Sidebar Header */}
                    <div className="sidebar-header">
                        <div className="brand" style={{ padding: '0 0 20px 0', minWidth: 'auto', display: 'flex', justifyContent: 'center' }}>
                            <div className="logo-container">
                                <img src="/lmage/logo.png" alt="Pricol" className="logo" />
                            </div>
                        </div>

                        <div className="sidebar-search">
                            <i className="sidebar-search-icon fas fa-search"></i>
                            <input type="text" placeholder="Search menu..." />
                        </div>
                    </div>

                    {/* Navigation Content */}
                    <div className="nav-content">
                        <div className="nav-title">Main</div>
                        <div
                            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                            onClick={() => handleNavClick('dashboard')}
                        >
                            <div className="nav-item-icon">
                                <i className="fas fa-tachometer-alt"></i>
                            </div>
                            <span className="nav-item-text">Dashboard</span>
                        </div>

                        <div className="nav-title">HR Services</div>
                        {['attendance', 'leave', 'payroll', 'performance', 'travel'].map(section => (
                            <div
                                key={section}
                                className={`nav-item ${activeSection === section ? 'active' : ''}`}
                                onClick={() => handleNavClick(section)}
                            >
                                <div className="nav-item-icon">
                                    <i className={`fas fa-${getIconForSection(section)}`}></i>
                                </div>
                                <span className="nav-item-text">{getLabelForSection(section)}</span>
                            </div>
                        ))}

                        <div className="nav-title">Resources</div>
                        {['knowledge', 'directory', 'about', 'content'].map(section => (
                            <div
                                key={section}
                                className={`nav-item ${activeSection === section ? 'active' : ''}`}
                                onClick={() => handleNavClick(section)}
                            >
                                <div className="nav-item-icon">
                                    <i className={`fas fa-${getIconForSection(section)}`}></i>
                                </div>
                                <span className="nav-item-text">{getLabelForSection(section)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar Footer */}
                    <div className="sidebar-footer">
                        <div className="sidebar-stats">
                            <div className="stat-item">
                                <div className="stat-value">12</div>
                                <div className="stat-label">Tasks</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">3</div>
                                <div className="stat-label">Alerts</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-value">8</div>
                                <div className="stat-label">Messages</div>
                            </div>
                        </div>
                        <div className="sidebar-actions">
                            <button className="sidebar-action-btn">Settings</button>
                            <button className="sidebar-action-btn">Help</button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

const getIconForSection = (section) => {
    const map = {
        attendance: 'clock',
        leave: 'calendar-alt',
        payroll: 'credit-card',
        performance: 'chart-line',
        travel: 'plane',
        knowledge: 'book-open',
        directory: 'users',
        about: 'building',
        content: 'file-alt'
    };
    return map[section] || 'circle';
};

const getLabelForSection = (section) => {
    const map = {
        attendance: 'Attendance & Time',
        leave: 'Leave & Holidays',
        payroll: 'Payroll',
        performance: 'Performance & Learning',
        travel: 'Travel & Expense',
        knowledge: 'Knowledge & Policies',
        directory: 'Directory',
        about: 'About / Group Company',
        content: 'My Content'
    };
    return map[section] || section;
};

export default Sidebar;
