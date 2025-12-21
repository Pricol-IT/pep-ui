import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-cover"></div>
                <div className="profile-info-main">
                    <div className="profile-avatar-large">
                        <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0f84cf&color=fff&size=256`} alt={user?.name} />
                    </div>
                    <div className="profile-name-section">
                        <h1>{user?.name}</h1>
                        <p className="profile-tagline">{user?.job_title || 'Employee'} • {user?.department || 'Department'}</p>
                    </div>
                </div>
            </div>

            <div className="profile-grid">
                <div className="profile-card">
                    <div className="card-header">
                        <i className="fas fa-briefcase"></i>
                        <h2>Job Information</h2>
                    </div>
                    <div className="card-body">
                        <div className="info-group">
                            <label>Job title</label>
                            <span>{user?.job_title || 'Not specified'}</span>
                        </div>
                        <div className="info-group">
                            <label>Company name</label>
                            <span>{user?.company_name || 'PRICOL LIMITED'}</span>
                        </div>
                        <div className="info-group">
                            <label>Department</label>
                            <span>{user?.department || 'Not specified'}</span>
                        </div>
                        <div className="info-group">
                            <label>Employee ID</label>
                            <span>{user?.employee_id || 'Not specified'}</span>
                        </div>
                        <div className="info-group">
                            <label>Office location</label>
                            <span>{user?.office_location || 'Not specified'}</span>
                        </div>
                        <div className="info-group">
                            <label>Manager</label>
                            <span className="manager-link">{user?.manager_name || 'Not specified'}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-card">
                    <div className="card-header">
                        <i className="fas fa-address-book"></i>
                        <h2>Contact Information</h2>
                    </div>
                    <div className="card-body">
                        <div className="info-group">
                            <label>Email</label>
                            <span>{user?.email}</span>
                        </div>
                        <div className="info-group">
                            <label>Mobile phone</label>
                            <span>{user?.mobile_phone || 'Not specified'}</span>
                        </div>
                        <div className="info-group">
                            <label>Business phone</label>
                            <span>Not specified</span>
                        </div>
                        <div className="info-group">
                            <label>Work Country</label>
                            <span>India</span>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .profile-page {
                    padding: 16px;
                    max-width: 1000px;
                    margin: 0 auto;
                }

                .profile-header {
                    background: white;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: var(--shadow-1);
                    margin-bottom: 16px;
                    position: relative;
                }

                .profile-cover {
                    height: 100px;
                    background: linear-gradient(135deg, var(--brand-700), var(--brand-500));
                }

                .profile-info-main {
                    padding: 0 24px 20px;
                    display: flex;
                    align-items: flex-end;
                    gap: 16px;
                    margin-top: -40px;
                }

                .profile-avatar-large {
                    width: 100px;
                    height: 100px;
                    border-radius: 20px;
                    border: 4px solid white;
                    overflow: hidden;
                    background: white;
                    box-shadow: var(--shadow-1);
                }

                .profile-avatar-large img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .profile-name-section h1 {
                    margin: 0;
                    font-size: 22px;
                    font-weight: 700;
                    color: var(--ink-900);
                }

                .profile-tagline {
                    margin: 2px 0 0;
                    color: var(--ink-500);
                    font-size: 14px;
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                }

                .profile-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: var(--shadow-1);
                    border: 1px solid var(--ink-100);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 16px;
                }

                .card-header i {
                    color: var(--brand-600);
                    font-size: 16px;
                }

                .card-header h2 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 700;
                    color: var(--ink-900);
                }

                .card-body {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .info-group {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                    border-bottom: 1px solid var(--ink-50);
                    padding-bottom: 8px;
                }

                .info-group:last-child {
                    border-bottom: none;
                }

                .info-group label {
                    font-size: 10px;
                    font-weight: 600;
                    color: var(--ink-300);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .info-group span {
                    font-size: 14px;
                    color: var(--ink-700);
                    font-weight: 500;
                }

                .manager-link {
                    color: var(--brand-600) !important;
                    cursor: pointer;
                }

                @media (max-width: 768px) {
                    .profile-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .profile-info-main {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                        margin-top: -40px;
                        padding: 0 16px 20px;
                    }
                }
            `}</style>
        </div>
    );
};

export default ProfilePage;
