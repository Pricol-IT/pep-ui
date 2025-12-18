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
                <div className="activity-toolbar">
                    <div className="activity-filters" role="tablist">
                        <button className={`activity-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                        <button className={`activity-tab ${filter === 'hr' ? 'active' : ''}`} onClick={() => setFilter('hr')}>HR</button>
                        <button className={`activity-tab ${filter === 'system' ? 'active' : ''}`} onClick={() => setFilter('system')}>System</button>
                        <button className={`activity-tab ${filter === 'announcements' ? 'active' : ''}`} onClick={() => setFilter('announcements')}>Announcements</button>
                    </div>
                    <button className="mark-read-btn" title="Mark all as read" onClick={markAllRead}>
                        <i className="ti ti-mail-opened"></i> Mark all read
                    </button>
                </div>
            </div>
            <div className="timeline-list">
                {filteredActivities.map(item => (
                    <div key={item.id} className={`timeline-item ${item.unread ? 'unread' : ''}`} data-type={item.type}>
                        <div className={`timeline-dot ${item.dotClass || ''}`}></div>
                        <div className="timeline-card">
                            <div className="timeline-title"><i className={`ti ti-${item.icon}`}></i> {item.title}</div>
                            <div className="timeline-meta">{item.meta}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTimeline;
