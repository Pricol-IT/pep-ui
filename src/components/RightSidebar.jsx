import React, { useState } from 'react';
import LocationModal from './LocationModal';
import BirthdayWidget from './BirthdayWidget';
import Applications from './Applications';
import NewJoiners from './NewJoiners';

const RightSidebar = () => {
    const [isLocationModalOpen, setLocationModalOpen] = useState(false);

    return (
        <div className="content-sidebar">
            <LocationModal
                isOpen={isLocationModalOpen}
                onClose={() => setLocationModalOpen(false)}
            />

            {/* Location Card */}
            <div className="location-card-modern" onClick={() => setLocationModalOpen(true)}>
                <div className="location-image-box">
                    <img src="/lmage/CTC.png" alt="Corporate Tech Center" className="location-img-main" />
                    <div className="weather-chip-floating">
                        <i className="ti ti-sun"></i>
                        <span>28°C</span>
                    </div>
                </div>
                <div className="location-content-box">
                    <div className="location-city-info">
                        <i className="ti ti-map-pin-filled"></i>
                        <span>Coimbatore</span>
                    </div>
                    <div className="location-facility-name">Corporate Technology Center</div>
                </div>
            </div>

            {/* Birthdays Widget */}
            <BirthdayWidget />

            {/* New Joiners Widget */}
            <NewJoiners />

            {/* Applications Widget - Moved to Last */}
            <Applications />

        </div>
    );
};

export default RightSidebar;
