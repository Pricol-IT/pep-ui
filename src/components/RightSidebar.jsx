import React, { useState } from 'react';
import CalendarWidget from './CalendarWidget';
import LocationModal from './LocationModal';

const RightSidebar = () => {
    const [isLocationModalOpen, setLocationModalOpen] = useState(false);

    return (
        <div className="content-sidebar">
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setLocationModalOpen(false)}
            />

            {/* Location Card */}
            <div className="location-card" onClick={() => setLocationModalOpen(true)} style={{ marginBottom: '20px' }}>
                <div className="location-card-inner">
                    <img src="/lmage/CTC.png" alt="Corporate Tech Center" className="location-bg" />
                    <div className="location-overlay">
                        <div className="location-header">
                            <div className="weather-badge">
                                <i className="ti ti-sun"></i>
                                <span>28°C</span>
                            </div>
                        </div>
                        <div className="location-info">
                            <div className="location-city">
                                <i className="ti ti-map-pin"></i>
                                Coimbatore
                            </div>
                            <div className="location-name">Corporate Technology Center</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Birthdays */}
            <div className="team-card" style={{ marginBottom: '20px' }}>
                <h3 className="card-title">
                    <i className="ti ti-cake"></i>
                    Birthdays
                </h3>
                <div className="people-list">
                    <div className="person-row">
                        <div className="person-avatar">SK</div>
                        <div className="person-info">
                            <div className="person-name">Siddharth Kumar</div>
                            <div className="person-meta">Today • Send wishes</div>
                        </div>
                    </div>
                    <div className="person-row">
                        <div className="person-avatar">AS</div>
                        <div className="person-info">
                            <div className="person-name">Akhil Sharma</div>
                            <div className="person-meta">Tomorrow • Tool Room</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Joiners */}
            <div className="team-card" style={{ marginBottom: '20px' }}>
                <h3 className="card-title">
                    <i className="ti ti-user-plus"></i>
                    New Joiners
                </h3>
                <div className="people-list">
                    <div className="person-row">
                        <div className="person-avatar">NV</div>
                        <div className="person-info">
                            <div className="person-name">Naveen V</div>
                            <div className="person-meta">Frontend | Joined today</div>
                        </div>
                    </div>
                    <div className="person-row">
                        <div className="person-avatar">SP</div>
                        <div className="person-info">
                            <div className="person-name">Sonia Paul</div>
                            <div className="person-meta">HR | Joined this week</div>
                        </div>
                    </div>
                </div>
            </div>





            {/* Mini Calendar */}
            <CalendarWidget />

        </div>
    );
};

export default RightSidebar;
