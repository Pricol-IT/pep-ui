import React from 'react';

const upcomingBirthdays = [
    { id: 1, name: 'Siddharth Kumar', date: 'Today', dept: 'Tool Room', avatar: 'SK' },
    { id: 2, name: 'Akhil Sharma', date: 'Tomorrow', dept: 'Tool Room', avatar: 'AS' },
    { id: 3, name: 'Naveen V', date: '24 Dec', dept: 'Frontend', avatar: 'NV' },
    { id: 4, name: 'Sonia Paul', date: '26 Dec', dept: 'HR', avatar: 'SP' },
    { id: 5, name: 'Rahul M', date: '28 Dec', dept: 'Design', avatar: 'RM' },
];

const receivedMessages = [
    { id: 1, from: 'Priya Dharshini', message: 'Happy Birthday! Have a great year ahead!', time: '2 hours ago' },
    { id: 2, from: 'Arun Kumar', message: 'Wishing you a fantastic birthday filled with happiness.', time: '5 hours ago' },
];

const BirthdayPage = () => {
    return (
        <div className="birthday-page">
            <div className="page-header">
                <h1>
                    <i className="ti ti-cake"></i>
                    Birthdays & Wishes
                </h1>
                <p>Manage birthday celebrations and view your messages.</p>
            </div>

            <div className="birthday-page-grid">
                <div className="upcoming-section">
                    <div className="section-card">
                        <h2 className="section-title">
                            <i className="ti ti-calendar"></i>
                            Upcoming Birthdays
                        </h2>
                        <div className="detailed-people-list">
                            {upcomingBirthdays.map(person => (
                                <div className="detailed-person-row" key={person.id}>
                                    <div className="person-avatar-md">{person.avatar}</div>
                                    <div className="detailed-info">
                                        <div className="p-name">{person.name}</div>
                                        <div className="p-dept">{person.dept}</div>
                                    </div>
                                    <div className="p-date">{person.date}</div>
                                    <button className="wish-btn">Send Wish</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="messages-section">
                    <div className="section-card">
                        <h2 className="section-title">
                            <i className="ti ti-message-2"></i>
                            Messages Received
                        </h2>
                        <div className="received-messages-list">
                            {receivedMessages.length > 0 ? (
                                receivedMessages.map(msg => (
                                    <div className="message-item" key={msg.id}>
                                        <div className="msg-header">
                                            <span className="msg-from">{msg.from}</span>
                                            <span className="msg-time">{msg.time}</span>
                                        </div>
                                        <p className="msg-text">{msg.message}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-messages">
                                    <i className="ti ti-message-off"></i>
                                    <p>No messages received yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BirthdayPage;
