import React, { useState } from 'react';
import BirthdayMessageModal from './BirthdayMessageModal';
import { useNavigate } from 'react-router-dom';

const teamBirthdays = [
    { id: 1, name: 'Siddharth Kumar', meta: 'Today • Send wishes', avatar: 'SK', type: 'team' },
    { id: 2, name: 'Akhil Sharma', meta: 'Tomorrow • Tool Room', avatar: 'AS', type: 'team' },
];

const companyBirthdays = [
    { id: 3, name: 'Naveen V', meta: '24 Dec • Frontend', avatar: 'NV', type: 'company' },
    { id: 4, name: 'Sonia Paul', meta: '26 Dec • HR', avatar: 'SP', type: 'company' },
    { id: 5, name: 'Rahul M', meta: '28 Dec • Design', avatar: 'RM', type: 'company' },
];

const BirthdayWidget = () => {
    const [selectedPerson, setSelectedPerson] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModal = (person) => {
        setSelectedPerson(person);
        setIsModalOpen(true);
    };

    const BirthdayCard = ({ person }) => (
        <div className="person-row birthday-card-clickable" onClick={() => openModal(person)}>
            <div className={`person-avatar ${person.type === 'team' ? 'brand-bg' : 'grey-bg'}`}>
                {person.avatar}
            </div>
            <div className="person-info">
                <div className="person-name">{person.name}</div>
                <div className="person-meta">{person.meta}</div>
            </div>
            <div className="card-action-hint">
                <i className="ti ti-message-plus"></i>
            </div>
        </div>
    );

    return (
        <div className="birthday-widget-container">
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
                        <label className="section-label-mini">My Team</label>
                        <div className="birthday-carousel">
                            <div className="birthday-scroll-track">
                                {teamBirthdays.map(person => (
                                    <BirthdayCard key={person.id} person={person} />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="divider-sm"></div>

                    <div className="birthday-sub-section">
                        <label className="section-label-mini">Company Members</label>
                        <div className="birthday-carousel">
                            <div className="birthday-scroll-track">
                                {companyBirthdays.map(person => (
                                    <BirthdayCard key={person.id} person={person} />
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
        </div>
    );
};

export default BirthdayWidget;
