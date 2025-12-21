import React, { useState } from 'react';

const Sidebar = ({ isOpen, onClose }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleNavClick = (section) => {
        setActiveSection(section);
        if (window.innerWidth <= 1024) {
            onClose();
        }
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    return (
        <>
            <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}></div>

            <aside className={`sidenav ${isOpen ? 'open' : ''}`} id="sidenav">
                <div className="nav-card">
                    {/* Sidebar Header */}
                    <div className="sidebar-header">
                        <div className="brand" style={{ padding: '0 0 10px 0', minWidth: 'auto', display: 'flex', justifyContent: 'center' }}>
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
                        <div className="nav-user" onClick={toggleUserMenu}>
                            <div className="nav-user-avatar">
                                <img src="https://lms.mypricol.net.in/pluginfile.php/58/user/icon/space/f1?rev=143" alt="Rubesh" />
                            </div>
                            <div className="nav-user-info">
                                <div className="nav-user-name">RUBESH K R</div>
                                <div className="nav-user-email">rubesh.kr@pricol.com</div>
                            </div>
                            <div className="nav-user-chevron">
                                <i className="fas fa-expand-alt" style={{ transform: 'rotate(45deg)', fontSize: '10px', opacity: 0.5 }}></i>
                            </div>

                            {showUserMenu && (
                                <div className="user-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="user-menu-header">
                                        <div className="user-menu-avatar">
                                            <img src="https://lms.mypricol.net.in/pluginfile.php/58/user/icon/space/f1?rev=143" alt="Rubesh" />
                                        </div>
                                        <div className="user-menu-info">
                                            <div className="user-menu-name">RUBESH K R</div>
                                            <div className="user-menu-email">rubesh.kr@pricol.com</div>
                                        </div>
                                    </div>
                                    <div className="user-menu-divider"></div>
                                    <div className="user-menu-item">
                                        <i className="far fa-user"></i>
                                        <span>My Profile</span>
                                    </div>
                                    <div className="user-menu-item">
                                        <i className="fas fa-cog"></i>
                                        <span>Settings</span>
                                    </div>
                                    <div className="user-menu-divider"></div>
                                    <div className="user-menu-item logout">
                                        <i className="fas fa-sign-out-alt"></i>
                                        <span>Log out</span>
                                    </div>
                                </div>
                            )}
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
