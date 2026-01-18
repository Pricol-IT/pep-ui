import React, { useState, useEffect } from 'react';
import BirthdayMessageModal from './BirthdayMessageModal';
import { useNavigate } from 'react-router-dom';

const teamBirthdays = [
    { id: 1, name: 'Siddharth Kumar', dept: 'SAP UI5 Team', date: 'Today', avatar: 'SK', type: 'team' },
    { id: 2, name: 'Akhil Sharma', dept: 'Tool Room', date: 'Tomorrow', avatar: 'AS', type: 'team' },
];

const companyBirthdays = [
    { id: 3, name: 'Naveen V', dept: 'Frontend', date: '24 Dec', avatar: 'NV', type: 'company' },
    { id: 4, name: 'Sonia Paul', dept: 'HR', date: '26 Dec', avatar: 'SP', type: 'company' },
    { id: 5, name: 'Rahul M', dept: 'Design', date: '28 Dec', avatar: 'RM', type: 'company' },
];

const BirthdayCard = ({ person, onClick }) => (
    <div className="birthday-card-clickable" onClick={() => onClick(person)}>
        <div className={`person-avatar ${person.type === 'team' ? 'brand-bg' : 'grey-bg'}`}>
            {person.avatar}
        </div>
        <div className="person-info">
            <div className="person-name">{person.name}</div>
            <div className="person-dept" style={{ fontSize: '11px', color: 'var(--brand-600)', fontWeight: '600', marginTop: '2px' }}>{person.dept}</div>
            <div className="person-meta">{person.date} {person.type === 'team' && person.date === 'Today' ? '• Send wishes' : ''}</div>
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
    const navigate = useNavigate();

    const openModal = (person) => {
        setSelectedPerson(person);
        setIsModalOpen(true);
    };

    const nextTeam = () => setTeamIndex((prev) => (prev + 1) % teamBirthdays.length);
    const prevTeam = () => setTeamIndex((prev) => (prev - 1 + teamBirthdays.length) % teamBirthdays.length);

    const nextCompany = () => setCompanyIndex((prev) => (prev + 1) % companyBirthdays.length);
    const prevCompany = () => setCompanyIndex((prev) => (prev - 1 + companyBirthdays.length) % companyBirthdays.length);

    // Auto-advance carousels every 3 seconds
    useEffect(() => {
        const teamInterval = setInterval(nextTeam, 3000);
        const companyInterval = setInterval(nextCompany, 3000);

        return () => {
            clearInterval(teamInterval);
            clearInterval(companyInterval);
        };
    }, []);

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

                <div className="birthday-sections">
                    <div className="birthday-sub-section">
                        <div className="section-header-mini">
                            <label className="section-label-mini">My Team</label>
                            <div className="carousel-controls">
                                <button onClick={prevTeam} className="carousel-btn"><i className="ti ti-chevron-left"></i></button>
                                <button onClick={nextTeam} className="carousel-btn"><i className="ti ti-chevron-right"></i></button>
                            </div>
                        </div>
                        <div className="birthday-carousel-container">
                            <div
                                className="birthday-track-horizontal"
                                style={{ transform: `translateX(-${teamIndex * 100}%)` }}
                            >
                                {teamBirthdays.map(person => (
                                    <div className="birthday-track-item" key={`team-${person.id}`}>
                                        <BirthdayCard person={person} onClick={openModal} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="divider-sm"></div>

                    <div className="birthday-sub-section">
                        <div className="section-header-mini">
                            <label className="section-label-mini">Company Members</label>
                            <div className="carousel-controls">
                                <button onClick={prevCompany} className="carousel-btn"><i className="ti ti-chevron-left"></i></button>
                                <button onClick={nextCompany} className="carousel-btn"><i className="ti ti-chevron-right"></i></button>
                            </div>
                        </div>
                        <div className="birthday-carousel-container">
                            <div
                                className="birthday-track-horizontal"
                                style={{ transform: `translateX(-${companyIndex * 100}%)` }}
                            >
                                {companyBirthdays.map(person => (
                                    <div className="birthday-track-item" key={`company-${person.id}`}>
                                        <BirthdayCard person={person} onClick={openModal} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
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
