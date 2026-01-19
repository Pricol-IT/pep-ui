import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const hasAccess = (pageName) => {
        if (!user) return false;
        // If the user has no pageAccesses defined, they can access everything by default (standard behavior)
        // OR you can change this to be restrictive. 
        // Based on "after authcate only able to access the pages", we might want to ONLY allow what's in the list.
        if (!user.page_accesses || user.page_accesses.length === 0) return true;

        return user.page_accesses.some(access =>
            access.page_name.toLowerCase() === pageName.toLowerCase() && access.can_access
        );
    };

    const handleNavClick = (section) => {
        if (!hasAccess(section)) {
            // Potentially show a toast or alert
            console.log(`Access denied to ${section}`);
            return;
        }
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
                        <div className="brand" style={{ padding: '24px 12px', minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                            <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <img src="/lmage/pricol-gold-logo.png" alt="Pricol" style={{ height: '24px', width: 'auto' }} />
                            </div>
                            <div className="separator" style={{ width: '1px', height: '54px', background: 'rgba(212, 175, 55, 0.2)' }}></div>
                            <div className="anniversary-badge" style={{ pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                                <img src="/lmage/50years-center.png" alt="50 Years" style={{ height: '100px', width: 'auto' }} />
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
                        {hasAccess('dashboard') && (
                            <div
                                className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
                                onClick={() => { handleNavClick('dashboard'); navigate('/'); }}
                            >
                                <div className="nav-item-icon">
                                    <i className="fas fa-tachometer-alt"></i>
                                </div>
                                <span className="nav-item-text">Dashboard</span>
                            </div>
                        )}

                        <div className="nav-title">HR Services</div>
                        {['attendance', 'leave', 'payroll', 'performance', 'travel'].filter(section => hasAccess(section)).map(section => (
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
                        {['knowledge', 'directory', 'about', 'content'].filter(section => hasAccess(section)).map(section => (
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
                                <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0f84cf&color=fff`} alt={user?.name} />
                            </div>
                            <div className="nav-user-info">
                                <div className="nav-user-name">{user?.name || 'User'}</div>
                                <div className="nav-user-email">{user?.email}</div>
                            </div>
                            <div className="nav-user-chevron">
                                <i className="fas fa-expand-alt" style={{ transform: 'rotate(45deg)', fontSize: '10px', opacity: 0.5 }}></i>
                            </div>

                            {showUserMenu && (
                                <div className="user-menu-dropdown" onClick={(e) => e.stopPropagation()}>
                                    <div className="user-menu-header">
                                        <div className="user-menu-avatar">
                                            <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0f84cf&color=fff`} alt={user?.name} />
                                        </div>
                                        <div className="user-menu-info">
                                            <div className="user-menu-name">{user?.name}</div>
                                            <div className="user-menu-email">{user?.email}</div>
                                            <div className="user-menu-extra" style={{ fontSize: '11px', opacity: 0.6, marginTop: '4px' }}>
                                                {user?.job_title} {user?.department ? `• ${user.department}` : ''}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="user-menu-divider"></div>
                                    <div className="user-menu-item" onClick={() => { navigate('/profile'); setShowUserMenu(false); }}>
                                        <i className="far fa-user"></i>
                                        <span>My Profile</span>
                                    </div>
                                    <div className="user-menu-item">
                                        <i className="fas fa-cog"></i>
                                        <span>Settings</span>
                                    </div>
                                    <div className="user-menu-divider"></div>
                                    <div className="user-menu-item logout" onClick={logout}>
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
