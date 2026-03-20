import React, { useState } from 'react';

const activities = [
    {
        id: 1,
        type: 'hr',
        title: 'Payslip uploaded for Oct-2023',
        meta: 'Your salary details are now available · 2 hours ago',
        icon: 'file-invoice',
        unread: true,
        dotClass: ''
    },
    {
        id: 2,
        type: 'hr',
        title: 'Leave request approved',
        meta: 'Your vacation request has been approved · 1 day ago',
        icon: 'calendar-check',
        unread: false,
        dotClass: 'success'
    },
    {
        id: 3,
        type: 'announcements',
        title: 'New company announcement',
        meta: 'Important updates about company policies · 3 days ago',
        icon: 'megaphone',
        unread: false,
        dotClass: 'info'
    }
];

const ActivityTimeline = () => {
    const [filter, setFilter] = useState('all');
    const [activityList, setActivityList] = useState(activities);

    const filteredActivities = activityList.filter(item => filter === 'all' || item.type === filter);

    const markAllRead = () => {
        setActivityList(prev => prev.map(item => ({ ...item, unread: false })));
    };

    return (
        <div className="activity-section timeline">
            <div className="section-header">
                <h2 className="section-title">
                    <i className="ti ti-activity"></i>
                    Recent Activity
                </h2>
            </div>
            <div className="timeline-list" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '200px', 
                background: '#fff', 
                borderRadius: '16px',
                border: '1px solid #f0f0f0',
                marginTop: '15px'
            }}>
                <div style={{ textAlign: 'center', color: '#999' }}>
                    <div className="coming-soon-icon" style={{ 
                        width: '60px', 
                        height: '60px', 
                        borderRadius: '50%', 
                        background: '#f8f9fa', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        margin: '0 auto 15px'
                    }}>
                        <i className="ti ti-hourglass-empty" style={{ fontSize: '28px', color: 'var(--brand-500)' }}></i>
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Coming Soon</h3>
                    <p style={{ fontSize: '14px', maxWidth: '250px', margin: '0 auto' }}>We're working on bringing your recent activities here. Stay tuned!</p>
                </div>
            </div>
        </div>
    );
};

export default ActivityTimeline;
