import React, { useState } from 'react';

const BirthdayMessageModal = ({ isOpen, onClose, person }) => {
    const [message, setMessage] = useState('');
    const [isSent, setIsSent] = useState(false);

    if (!isOpen || !person) return null;

    const handleSend = () => {
        if (!message.trim()) return;
        // Logic to send message would go here (API call)
        console.log(`Sending message to ${person.name}: ${message}`);
        setIsSent(true);
        setTimeout(() => {
            setIsSent(false);
            setMessage('');
            onClose();
        }, 2000);
    };

    return (
        <div className="location-modal-overlay" onClick={onClose}>
            <div className="location-modal-card birthday-modal" onClick={e => e.stopPropagation()}>
                <button className="location-modal-close" onClick={onClose}>
                    <i className="ti ti-x"></i>
                </button>

                {!isSent ? (
                    <>
                        <div className="modal-header-simple">
                            <div className="person-avatar-large">
                                {person.avatar || person.name.charAt(0)}
                            </div>
                            <h3>Send Wishes to {person.name}</h3>
                            <p>Write a nice message for their special day!</p>
                        </div>

                        <div className="modal-body-simple">
                            <textarea
                                className="birthday-textarea"
                                placeholder="Happy Birthday! Have a wonderful day filled with joy and success..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                autoFocus
                            ></textarea>

                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={onClose}>Cancel</button>
                                <button
                                    className="send-btn"
                                    onClick={handleSend}
                                    disabled={!message.trim()}
                                >
                                    <i className="ti ti-send"></i>
                                    Send Wishes
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="success-state">
                        <div className="success-icon">
                            <i className="ti ti-circle-check"></i>
                        </div>
                        <h3>Message Sent!</h3>
                        <p>Your warm wishes have been shared with {person.name}.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BirthdayMessageModal;
