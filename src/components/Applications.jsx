import React, { useState } from 'react';

const appsData = [
    { name: 'Payroll', icon: 'cash', pinned: true, recent: false },
    { name: 'Time Track', icon: 'clock', pinned: true, recent: true },
    { name: 'LMS', icon: 'school', pinned: false, recent: false },
    { name: 'PMS', icon: 'chart-line', pinned: false, recent: true },
    { name: 'Travel', icon: 'plane', pinned: false, recent: false },
    { name: 'Knowledge', icon: 'book', pinned: false, recent: false },
    { name: 'Medi-claim', icon: 'stethoscope', pinned: true, recent: false },
];

const Applications = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApps = appsData.filter(app => {
        const matchesFilter = filter === 'all' || (filter === 'pinned' && app.pinned) || (filter === 'recent' && app.recent);
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="applications-section">
            <div className="section-header">
                <h2 className="section-title">
                    <i className="ti ti-apps"></i>
                    My Applications
                </h2>
                <div className="apps-toolbar">
                    <div className="apps-tabs" role="tablist">
                        <button className={`apps-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`apps-tab ${filter === 'pinned' ? 'active' : ''}`} onClick={() => setFilter('pinned')}>Pinned</button>
                        <button className={`apps-tab ${filter === 'recent' ? 'active' : ''}`} onClick={() => setFilter('recent')}>Recent</button>
                    </div>
                    <div className="search-container">
                        <i className="ti ti-search"></i>
                        <input
                            type="search"
                            placeholder="Search applications..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="applications-grid">
                {filteredApps.map((app, index) => (
                    <a href="#" className="app-card" key={index}>
                        <div className="app-icon">
                            <i className={`ti ti-${app.icon}`}></i>
                        </div>
                        <span className="app-name">{app.name}</span>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default Applications;
