import React, { useState } from 'react';

const AnnouncementBar = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="announcement-bar">
            <div className="announcement-content">
                <div className="announcement-icon">
                    <i className="ti ti-confetti"></i>
                </div>
                <div className="announcement-text">
                    <span className="badge-new">New</span>
                    <span className="message">FY2025 Strategic Goals have been published. Check the Knowledge Base for details.</span>
                </div>
            </div>
            <button className="announcement-close" onClick={() => setIsVisible(false)} title="Dismiss">
                <i className="ti ti-x"></i>
            </button>
        </div>
    );
};

export default AnnouncementBar;
