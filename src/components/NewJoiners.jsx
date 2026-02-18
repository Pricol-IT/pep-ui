import React, { useState, useEffect } from 'react';



const JoinerCard = ({ person }) => (
    <div className="birthday-card-clickable" style={{ cursor: 'default' }}>
        <div className="person-avatar brand-bg">
            {person.initials}
        </div>
        <div className="person-info">
            <div className="person-name">{person.name}</div>
            <div className="person-dept" style={{ fontSize: '11px', color: 'var(--brand-600)', fontWeight: '600', marginTop: '2px' }}>
                {person.designation}
            </div>
            <div className="person-company" style={{ fontSize: '9px', color: '#666' }}>
                {person.company}
            </div>
            <div className="person-meta">{person.joinedDate}</div>
        </div>
        <div className="card-action-hint" style={{ opacity: 0.1 }}>
            <i className="ti ti-user-check"></i>
        </div>
    </div>
);

const NewJoiners = () => {
    const [joiners, setJoiners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJoiners = async () => {
            try {
                const response = await fetch('/new-joiners', {
                    headers: { 'Accept': 'application/json' }
                });
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setJoiners(data);
            } catch (error) {
                console.error("Error fetching new joiners:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchJoiners();
    }, []);

    const nextJoiner = () => {
        if (joiners.length > 0) setCurrentIndex((prev) => (prev + 1) % joiners.length);
    };
    const prevJoiner = () => {
        if (joiners.length > 0) setCurrentIndex((prev) => (prev - 1 + joiners.length) % joiners.length);
    };

    useEffect(() => {
        if (joiners.length > 1) {
            const interval = setInterval(nextJoiner, 3000);
            return () => clearInterval(interval);
        }
    }, [joiners.length]);

    if (loading) return <div className="team-card birthday-main-card">Loading...</div>;

    if (joiners.length === 0) {
        return (
            <div className="team-card birthday-main-card">
                <div className="card-header-flex">
                    <h3 className="card-title">
                        <i className="ti ti-user-plus"></i>
                        New Joiners
                    </h3>
                </div>
                <div className="no-birthdays">
                    <p>No new joiners this week.</p>
                    <i className="ti ti-user" style={{ fontSize: '24px', color: '#ccc', marginTop: '10px' }}></i>
                </div>
            </div>
        );
    }

    return (
        <div className="team-card birthday-main-card">
            <div className="card-header-flex">
                <h3 className="card-title">
                    <i className="ti ti-user-plus"></i>
                    New Joiners
                </h3>
                {joiners.length > 1 && (
                    <div className="carousel-controls">
                        <button onClick={prevJoiner} className="carousel-btn"><i className="ti ti-chevron-left"></i></button>
                        <button onClick={nextJoiner} className="carousel-btn"><i className="ti ti-chevron-right"></i></button>
                    </div>
                )}
            </div>

            <div className="birthday-carousel-container">
                <div
                    className="birthday-track-horizontal"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {joiners.map(person => (
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
