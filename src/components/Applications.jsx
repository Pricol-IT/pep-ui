import React, { useState } from 'react';

const appsData = [
    { name: 'Cafeteria', icon: 'soup', link: 'https://cafeteria.mypricol.in/' },
    { name: 'Smart Traveller', icon: 'plane-tilt', link: 'https://smarttraveller.mypricol.in/' },
    { name: 'LMS', icon: 'school', link: 'https://lms.mypricol.net.in/' },
    { name: 'Time track', icon: 'history', link: 'https://pep.mypricol.in/timetrack/' },
    { name: 'IT Projection', icon: 'chart-bar', link: 'https://pep.mypricol.in/it_projection/' },
    { name: 'MoM', icon: 'file-description', link: 'https://minutes.mypricol.net.in/' },
];

const Applications = () => {
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredApps = appsData.filter(app => {
        return app.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="applications-section">
            <div className="section-header">
                <h2 className="section-title">
                    <i className="ti ti-apps"></i>
                    My Applications
                </h2>
                <div className="apps-toolbar">
                    <div className="app-search-container" style={{ marginLeft: 0 }}>
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
                    <a href={app.link} className="app-card" key={index} target="_blank" rel="noopener noreferrer">
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
