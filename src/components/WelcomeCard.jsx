import { useAuth } from '../context/AuthContext';

const WelcomeCard = () => {
    const { user } = useAuth();

    // Time-sensitive greeting helper
    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return "Good Morning";
        if (hour >= 12 && hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="welcome-container">
            {/* 6/12 width */}
            <div className="welcome-message-only">
                <h2>
                    <span className="text-gradient-blue">{getTimeGreeting()},</span><br />
                    <span className="text-gradient-gold">{user?.name || 'Rubesh K R'}!</span> <span className="text-gradient-blue">Welcome back!</span>
                </h2>
            </div>

            {/* 3/12 width */}
            <div className="stat-card-mini">
                <div className="stat-icon-circle blue">
                    <i className="ti ti-calendar-time"></i>
                </div>
                <div className="stat-content">
                    <span className="stat-value">09:30 AM</span>
                    <span className="stat-label">Today's Check-in</span>
                </div>
            </div>

            {/* 3/12 width */}
            <div className="stat-card-mini">
                <div className="stat-icon-circle orange">
                    <i className="ti ti-list-check"></i>
                </div>
                <div className="stat-content">
                    <span className="stat-value">12 <small>/ 28</small></span>
                    <span className="stat-label">Tasks Overview</span>
                </div>
            </div>
        </div>
    );
};

export default WelcomeCard;
