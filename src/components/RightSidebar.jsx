import React, { useState } from 'react';
import LocationModal from './LocationModal';
import BirthdayWidget from './BirthdayWidget';

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

            {/* Birthdays Widget */}
            <BirthdayWidget />

            {/* New Joiners */}

        </div>
    );
};

export default RightSidebar;
