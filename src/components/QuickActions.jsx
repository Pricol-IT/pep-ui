import React from 'react';

const QuickActions = () => {
    return (
        <div className="action-strip">
            <h2 className="section-title">
                <i className="ti ti-bolt"></i>
                Quick Actions
            </h2>
            <div className="strip">
                <button className="strip-btn">
                    <i className="ti ti-clock"></i>
                    <span>Clock In</span>
                </button>
                <button className="strip-btn">
                    <i className="ti ti-calendar"></i>
                    <span>Request Leave</span>
                </button>
                <button className="strip-btn">
                    <i className="ti ti-file-invoice"></i>
                    <span>View Payslip</span>
                </button>
                <button className="strip-btn">
                    <i className="ti ti-chart-line"></i>
                    <span>Performance</span>
                </button>
                <div className="strip-divider"></div>
                <button className="strip-btn ghost">
                    <i className="ti ti-plus"></i>
                    <span>New Request</span>
                </button>
            </div>
        </div>
    );
};

export default QuickActions;
