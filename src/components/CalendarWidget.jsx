import React, { useState } from 'react';

const CalendarWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const renderCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const daysInPrevMonth = getDaysInMonth(year, month - 1);

        const days = [];

        // Previous month (padding)
        for (let i = 0; i < firstDay; i++) {
            days.push(
                <div key={`prev-${i}`} className="calendar-day prev-month">
                    {daysInPrevMonth - firstDay + i + 1}
                </div>
            );
        }

        // Current month
        const today = new Date();
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            days.push(
                <div key={`curr-${i}`} className={`calendar-day ${isToday ? 'today' : ''}`}>
                    {i}
                </div>
            );
        }

        // Fill remaining slots to maintain grid (optional, but good for layout)
        // The CSS grid probably handles flow, but we can add next month days if needed.
        // The original HTML had 31 days + 2 prev days = 33 days. 
        // Grid 7 cols. 33 / 7 = 4 rows + 5.

        return days;
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <div className="calendar-card">
            <h3 className="card-title">
                <i className="ti ti-calendar"></i>
                Calendar
            </h3>
            <div className="calendar-header">
                <button className="calendar-nav" onClick={handlePrevMonth}>
                    <i className="ti ti-chevron-left"></i>
                </button>
                <span className="calendar-month">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
                <button className="calendar-nav" onClick={handleNextMonth}>
                    <i className="ti ti-chevron-right"></i>
                </button>
            </div>
            <div className="calendar-grid">
                <div className="calendar-day-header">Sun</div>
                <div className="calendar-day-header">Mon</div>
                <div className="calendar-day-header">Tue</div>
                <div className="calendar-day-header">Wed</div>
                <div className="calendar-day-header">Thu</div>
                <div className="calendar-day-header">Fri</div>
                <div className="calendar-day-header">Sat</div>

                {renderCalendarDays()}
            </div>
        </div>
    );
};

export default CalendarWidget;
