import React from 'react';

const NewJoiners = () => {
    return (
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
    );
};

export default NewJoiners;
