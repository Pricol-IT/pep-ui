import React, { useState, useEffect } from 'react';
import BirthdayMessageModal from './BirthdayMessageModal';
import { useNavigate } from 'react-router-dom';


const BirthdayCard = ({ person, onClick }) => (
    <div className="birthday-card-clickable" onClick={() => onClick(person)}>
        <div className={`person-avatar ${person.type === 'team' ? 'brand-bg' : 'grey-bg'}`}>
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
            <div className="person-meta">{person.display_date} {person.type === 'team' && person.display_date.includes('Today') ? '• Send wishes' : ''}</div>
        </div>
        <div className="card-action-hint">
            <i className="ti ti-message-plus"></i>
        </div>
    </div>
);

const BirthdayWidget = () => {
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [teamIndex, setTeamIndex] = useState(0);
    const [companyIndex, setCompanyIndex] = useState(0);
    const [birthdays, setBirthdays] = useState({
        team_today: [],
        today: [],
        team_tomorrow: [],
        tomorrow: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBirthdays = async () => {
            try {
                // Adjust endpoint based on your setup, e.g. /api/birthdays or just /birthdays if proxy is set
                const response = await fetch('/api/birthdays', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setBirthdays(data);
            } catch (error) {
                console.error("Error fetching birthdays:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBirthdays();
    }, []);

    const openModal = (person) => {
        setSelectedPerson(person);
        setIsModalOpen(true);
    };

    // Combine team today (My Team)
    const teamList = birthdays.team_today.map(p => ({ ...p, type: 'team', display_date: 'Today' }));

    // Combine company today (excluding team members to avoid dupes if desired, but user said "Company Members" show as name, designation, company name)
    // The previous hardcoded data had "Company Members" as separate list. 
    // Logic: My Team shows team members. Company Members shows EVERYONE (or everyone else).
    // Let's show everyone in Company Members for now as it's simpler and likely what's expected ("All Company").
    const companyList = birthdays.today.map(p => ({ ...p, type: 'company', display_date: 'Today' }));

    const nextTeam = () => {
        if (teamList.length > 0) setTeamIndex((prev) => (prev + 1) % teamList.length);
    };
    const prevTeam = () => {
        if (teamList.length > 0) setTeamIndex((prev) => (prev - 1 + teamList.length) % teamList.length);
    };

    const nextCompany = () => {
        if (companyList.length > 0) setCompanyIndex((prev) => (prev + 1) % companyList.length);
    };
    const prevCompany = () => {
        if (companyList.length > 0) setCompanyIndex((prev) => (prev - 1 + companyList.length) % companyList.length);
    };

    // Auto-advance carousels every 3 seconds
    useEffect(() => {
        if (teamList.length > 1) {
            const teamInterval = setInterval(nextTeam, 3000);
            return () => clearInterval(teamInterval);
        }
    }, [teamList.length]);

    useEffect(() => {
        if (companyList.length > 1) {
            const companyInterval = setInterval(nextCompany, 3000);
            return () => clearInterval(companyInterval);
        }
    }, [companyList.length]);

    if (loading) return <div className="birthday-card birthday-main-card">Loading...</div>;

    const hasBirthdays = teamList.length > 0 || companyList.length > 0;

    return (
        <>
            <div className="team-card birthday-main-card">
                <div className="card-header-flex">
                    <h3 className="card-title">
                        <i className="ti ti-cake"></i>
                        Birthdays
                    </h3>
                    <button className="view-all-link" onClick={() => navigate('/birthdays')}>
                        View all
                    </button>
                </div>

                {!hasBirthdays ? (
                    <div className="no-birthdays">
                        <p>No birthdays today.</p>
                        <i className="ti ti-confetti" style={{ fontSize: '24px', color: '#ccc', marginTop: '10px' }}></i>
                    </div>
                ) : (
                    <div className="birthday-sections">
                        {/* MY TEAM SECTION */}
                        {teamList.length > 0 && (
                            <div className="birthday-sub-section">
                                <div className="section-header-mini">
                                    <label className="section-label-mini">My Team</label>
                                    {teamList.length > 1 && (
                                        <div className="carousel-controls">
                                            <button onClick={prevTeam} className="carousel-btn"><i className="ti ti-chevron-left"></i></button>
                                            <button onClick={nextTeam} className="carousel-btn"><i className="ti ti-chevron-right"></i></button>
                                        </div>
                                    )}
                                </div>
                                <div className="birthday-carousel-container">
                                    <div
                                        className="birthday-track-horizontal"
                                        style={{ transform: `translateX(-${teamIndex * 100}%)` }}
                                    >
                                        {teamList.map((person, idx) => (
                                            <div className="birthday-track-item" key={`team-${idx}`}>
                                                <BirthdayCard person={person} onClick={openModal} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {teamList.length > 0 && companyList.length > 0 && <div className="divider-sm"></div>}

                        {/* COMPANY MEMBERS SECTION */}
                        {companyList.length > 0 && (
                            <div className="birthday-sub-section">
                                <div className="section-header-mini">
                                    <label className="section-label-mini">Company Members</label>
                                    {companyList.length > 1 && (
                                        <div className="carousel-controls">
                                            <button onClick={prevCompany} className="carousel-btn"><i className="ti ti-chevron-left"></i></button>
                                            <button onClick={nextCompany} className="carousel-btn"><i className="ti ti-chevron-right"></i></button>
                                        </div>
                                    )}
                                </div>
                                <div className="birthday-carousel-container">
                                    <div
                                        className="birthday-track-horizontal"
                                        style={{ transform: `translateX(-${companyIndex * 100}%)` }}
                                    >
                                        {companyList.map((person, idx) => (
                                            <div className="birthday-track-item" key={`company-${idx}`}>
                                                <BirthdayCard person={person} onClick={openModal} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <BirthdayMessageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                person={selectedPerson}
            />
        </>
    );
};

export default BirthdayWidget;
