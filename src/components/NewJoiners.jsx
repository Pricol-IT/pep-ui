import React, { useState, useEffect } from 'react';

const joinersData = [
    { id: 1, name: 'Naveen V', dept: 'Frontend', joinedDate: 'Joined today', avatar: 'NV' },
    { id: 2, name: 'Sonia Paul', dept: 'HR', joinedDate: 'Joined this week', avatar: 'SP' },
    { id: 3, name: 'Rahul M', dept: 'Design', joinedDate: 'Joined this week', avatar: 'RM' },
];

const JoinerCard = ({ person }) => (
    <div className="birthday-card-clickable" style={{ cursor: 'default' }}>
        <div className="person-avatar brand-bg">
            {person.avatar}
        </div>
        <div className="person-info">
            <div className="person-name">{person.name}</div>
            <div className="person-dept" style={{ fontSize: '11px', color: 'var(--brand-600)', fontWeight: '600', marginTop: '2px' }}>{person.dept}</div>
            <div className="person-meta">{person.joinedDate}</div>
        </div>
        <div className="card-action-hint" style={{ opacity: 0.1 }}>
            <i className="ti ti-user-check"></i>
        </div>
    </div>
);

const NewJoiners = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextJoiner = () => setCurrentIndex((prev) => (prev + 1) % joinersData.length);
    const prevJoiner = () => setCurrentIndex((prev) => (prev - 1 + joinersData.length) % joinersData.length);

    useEffect(() => {
        const interval = setInterval(nextJoiner, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="team-card birthday-main-card">
            <div className="card-header-flex">
                <h3 className="card-title">
                    <i className="ti ti-user-plus"></i>
                    New Joiners
                </h3>
                <div className="carousel-controls">
                    <button onClick={prevJoiner} className="carousel-btn"><i className="ti ti-chevron-left"></i></button>
                    <button onClick={nextJoiner} className="carousel-btn"><i className="ti ti-chevron-right"></i></button>
                </div>
            </div>

            <div className="birthday-carousel-container">
                <div
                    className="birthday-track-horizontal"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {joinersData.map(person => (
                        <div className="birthday-track-item" key={`joiner-${person.id}`}>
                            <JoinerCard person={person} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NewJoiners;
