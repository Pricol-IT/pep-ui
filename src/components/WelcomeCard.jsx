import React from 'react';

const WelcomeCard = () => {
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            // Could add a toast here
            alert('Copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy matches', err);
        });
    };

    return (
        <div className="welcome-card">
            {/* Top Row: Welcome Header */}
            <div className="welcome-header-section">
                <div className="welcome-header">
                    <h2>Welcome back, Rubesh!</h2>
                    <p className="role-subtitle">Developer • Information Technology</p>
                </div>
            </div>



            {/* Bottom Row: Profile Image */}
            <div className="profile-column">
                <div className="profile-image">
                    <img src="https://lms.mypricol.net.in/pluginfile.php/58/user/icon/space/f1?rev=143" alt="Imanuel Stephan" />
                </div>
            </div>

            {/* Bottom Row: Column 1 */}
            <div className="content-column-1">
                <div className="contact-info">
                    <div className="contact-item">
                        <span className="contact-label">Email:</span>
                        <span className="contact-value">rubesh.ramesh@pricol.com</span>
                        <button className="copy-btn-small" onClick={() => copyToClipboard('rubesh.ramesh@pricol.com')} title="Copy Email">
                            <i className="ti ti-copy"></i>
                        </button>
                    </div>

                    <div className="contact-item">
                        <span className="contact-label">Phone:</span>
                        <span className="contact-value">7548811151</span>
                        <button className="copy-btn-small" onClick={() => copyToClipboard('7548811151')} title="Copy Phone">
                            <i className="ti ti-copy"></i>
                        </button>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default WelcomeCard;
