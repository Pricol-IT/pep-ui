import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnnouncementBar = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchActive = async () => {
            try {
                const res = await axios.get('/announcements/active');
                if (res.data) {
                    const actualData = Array.isArray(res.data) ? res.data[0] : res.data;
                    if (actualData) {
                        setData(actualData);
                        const isDismissed = sessionStorage.getItem(`announcement_${actualData.id}_dismissed`);
                        if (!isDismissed) {
                            setIsVisible(true);
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch announcement:', err);
            }
        };
        fetchActive();
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        if (data) {
            sessionStorage.setItem(`announcement_${data.id}_dismissed`, 'true');
        }
    };

    if (!isVisible || !data || !data.content) return null;

    return (
        <div className="announcement-bar">
            <div className="announcement-content">
                <div className="announcement-icon">
                    <i className="ti ti-confetti"></i>
                </div>
                <div className="announcement-text">
                    <span className="badge-new">{data.badge_text || 'NEW'}</span>
                    {data.content && <span className="announcement-message">{data.content}</span>}
                </div>
            </div>
            <button className="announcement-close" onClick={handleDismiss} title="Dismiss">
                <i className="ti ti-x"></i>
            </button>
        </div>
    );
};

export default AnnouncementBar;
