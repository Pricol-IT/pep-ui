import React from 'react';

const QuickDock = () => {
    return (
        <div className="quick-dock">
            <div className="quick-dock-items">
                <div className="quick-dock-item">
                    <div className="quick-dock-icon">
                        <i className="ti ti-home"></i>
                    </div>
                    <div className="quick-dock-label">Home</div>
                </div>
                <div className="quick-dock-item">
                    <div className="quick-dock-icon">
                        <i className="ti ti-clock"></i>
                    </div>
                    <div className="quick-dock-label">Attendance</div>
                </div>
                <div className="quick-dock-item">
                    <div className="quick-dock-icon">
                        <i className="ti ti-user"></i>
                    </div>
                    <div className="quick-dock-label">Profile</div>
                </div>
            </div>
        </div>
    );
};

export default QuickDock;
