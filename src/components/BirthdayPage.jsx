import React, { useState, useEffect } from 'react';

const BirthdayPage = () => {
    const [birthdays, setBirthdays] = useState({ today: [], tomorrow: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBirthdays = async () => {
            try {
                const response = await fetch('/birthdays', {
                    headers: { 'Accept': 'application/json' }
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

    if (loading) return <div className="birthday-page"><div className="page-header">Loading...</div></div>;

    const renderBirthdayList = (list, title, icon) => (
        <div className="section-card" style={{ marginBottom: '20px' }}>
            <h2 className="section-title">
                <i className={`ti ${icon}`}></i>
                {title}
            </h2>
            <div className="detailed-people-list">
                {list.length > 0 ? (
                    list.map((person, idx) => (
                        <div className="detailed-person-row" key={`${title}-${idx}`}>
                            <div className="person-avatar-md brand-bg">{person.initials}</div>
                            <div className="detailed-info">
                                <div className="p-name">{person.name}</div>
                                <div className="p-dept">{person.designation}</div>
                                <div className="p-company" style={{ fontSize: '11px', color: '#666' }}>{person.company}</div>
                            </div>
                            <div className="p-date">{person.display_date}</div>
                            <button className="wish-btn">Send Wish</button>
                        </div>
                    ))
                ) : (
                    <div className="empty-state" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                        No birthdays {title.toLowerCase()}.
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="birthday-page">
            <div className="page-header">
                <h1>
                    <i className="ti ti-cake"></i>
                    Birthdays & Wishes
                </h1>
                <p>View upcoming birthdays and send your best wishes.</p>
            </div>

            <div className="birthday-page-grid">
                <div className="upcoming-section" style={{ gridColumn: 'span 2' }}>
                    {renderBirthdayList(birthdays.today, "Today's Birthdays", "ti-calendar")}
                    {renderBirthdayList(birthdays.tomorrow, "Tomorrow's Birthdays", "ti-calendar-event")}
                </div>
            </div>
        </div>
    );
};

export default BirthdayPage;
