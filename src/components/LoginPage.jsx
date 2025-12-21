import React from 'react';

const LoginPage = () => {
    const handleMicrosoftLogin = () => {
        window.location.href = '/auth/redirect';
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <img src="/lmage/logo.png" alt="Pricol Logo" className="login-logo" />
                        <h1>Intranet Portal</h1>
                        <p>Welcome back! Please sign in to continue.</p>
                    </div>

                    <div className="login-body">
                        <button className="microsoft-btn" onClick={handleMicrosoftLogin}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23">
                                <path fill="#f3f3f3" d="M0 0h11v11H0z" />
                                <path fill="#f3f3f3" d="M12 0h11v11H12z" />
                                <path fill="#f3f3f3" d="M0 12h11v11H0z" />
                                <path fill="#f3f3f3" d="M12 12h11v11H12z" />
                            </svg>
                            <span>Sign in with Microsoft</span>
                        </button>
                    </div>

                    <div className="login-footer">
                        <p>© {new Date().getFullYear()} Pricol Limited. All rights reserved.</p>
                        <div className="footer-links">
                            <a href="#">Security Policy</a>
                            <span className="separator">•</span>
                            <a href="#">Help Desk</a>
                        </div>
                    </div>
                </div>

                <div className="login-bg-glow"></div>
                <div className="login-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                </div>
            </div>

            <style>{`
                .login-page {
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #0f172a;
                    overflow: hidden;
                    position: relative;
                    font-family: 'Poppins', sans-serif;
                    margin: 0;
                    padding: 0;
                }

                .login-container {
                    width: 100%;
                    max-width: 420px;
                    padding: 20px;
                    z-index: 10;
                }

                .login-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 32px;
                    padding: 48px 40px;
                    text-align: center;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .login-logo {
                    height: 48px;
                    margin-bottom: 24px;
                }

                .login-header h1 {
                    color: #fff;
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    letter-spacing: -0.02em;
                }

                .login-header p {
                    color: rgba(255, 255, 255, 0.6);
                    font-size: 15px;
                    margin-bottom: 40px;
                }

                .microsoft-btn {
                    width: 100%;
                    padding: 14px;
                    background: #fff;
                    color: #000;
                    border: none;
                    border-radius: 14px;
                    font-size: 16px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
                }

                .microsoft-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(255, 255, 255, 0.2);
                    background: #f8fafc;
                }

                .microsoft-btn svg {
                    width: 20px;
                    height: 20px;
                }

                .login-footer {
                    margin-top: 40px;
                }

                .login-footer p {
                    color: rgba(255, 255, 255, 0.4);
                    font-size: 13px;
                    margin-bottom: 12px;
                }

                .footer-links {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .footer-links a {
                    color: rgba(255, 255, 255, 0.6);
                    text-decoration: none;
                    font-size: 13px;
                }

                .separator {
                    color: rgba(255, 255, 255, 0.2);
                }

                .login-bg-glow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at center, rgba(15, 132, 207, 0.15) 0%, transparent 70%);
                    pointer-events: none;
                }

                .login-shapes .shape {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(80px);
                    z-index: 1;
                }

                .shape-1 {
                    width: 300px;
                    height: 300px;
                    background: rgba(15, 132, 207, 0.2);
                    top: -150px;
                    right: -50px;
                    animation: float 20s infinite alternate;
                }

                .shape-2 {
                    width: 400px;
                    height: 400px;
                    background: rgba(15, 132, 207, 0.1);
                    bottom: -200px;
                    left: -100px;
                    animation: float 25s infinite alternate-reverse;
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @keyframes float {
                    from { transform: translate(0, 0) scale(1); }
                    to { transform: translate(50px, 50px) scale(1.1); }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
