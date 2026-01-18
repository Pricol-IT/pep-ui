import React from 'react';

const LoginPage = () => {
    const handleMicrosoftLogin = () => {
        window.location.href = '/auth/redirect';
    };

    return (
        <div className="login-page">
            <div className="login-bg-pattern"></div>

            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="hero-badge">
                            <img src="/lmage/50years-center.png" alt="50 Years" className="badge-img" />
                        </div>
                        <div className="brand-wrapper">
                            <img src="/lmage/pricol-gold-logo.png" alt="Pricol" className="brand-logo" />
                        </div>
                        <div className="header-text">
                            <p>Celebrating Five Decades of Innovation & Excellence</p>
                        </div>
                    </div>

                    <div className="login-body">
                        <button className="microsoft-btn" onClick={handleMicrosoftLogin}>
                            <div className="btn-shimmer"></div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 23 23">
                                <path fill="#d4af37" d="M0 0h11v11H0z" />
                                <path fill="#d4af37" d="M12 0h11v11H12z" />
                                <path fill="#d4af37" d="M0 12h11v11H0z" />
                                <path fill="#d4af37" d="M12 12h11v11H12z" />
                            </svg>
                            <span>Sign in with Microsoft</span>
                        </button>
                    </div>

                    <div className="login-footer">
                        <div className="footer-accent"></div>
                        <p>© {new Date().getFullYear()} Pricol Limited</p>
                        <div className="footer-links">
                            <a href="#">Security</a>
                            <span className="dot"></span>
                            <a href="#">Support</a>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .login-page {
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #002250;
                    overflow: hidden;
                    font-family: 'Inter', -apple-system, sans-serif;
                    margin: 0;
                    padding: 0;
                    position: relative;
                }

                .login-bg-pattern {
                    position: absolute;
                    inset: 0;
                    background-image: url('/lmage/50years-pattern.png');
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    opacity: 0.05;
                    filter: brightness(1.2);
                    z-index: 2;
                    pointer-events: none;
                }

                .login-container {
                    width: 100%;
                    max-width: 520px;
                    padding: 40px;
                    z-index: 10;
                    perspective: 1000px;
                }

                .login-card {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 40px;
                    padding: 48px 40px;
                    text-align: center;
                    position: relative;
                }

                .hero-badge {
                    margin-bottom: 24px;
                    display: flex;
                    justify-content: center;
                }

                .badge-img {
                    height: 180px;
                    width: auto;
                }

                .brand-wrapper {
                    margin-bottom: 16px;
                }

                .brand-logo {
                    height: 48px;
                    width: auto;
                }

                .header-text p {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 15px;
                    font-weight: 300;
                    letter-spacing: 0.03em;
                    margin-bottom: 40px;
                    line-height: 1.5;
                }

                .microsoft-btn {
                    width: auto;
                    min-width: 280px;
                    margin: 0 auto;
                    padding: 12px 32px;
                    background: #fff;
                    color: #d4af37;
                    border: none;
                    border-radius: 12px;
                    font-size: 15px;
                    font-weight: 400;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                .btn-shimmer {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(
                        to right,
                        transparent,
                        rgba(255, 255, 255, 0.4),
                        transparent
                    );
                    transform: skewX(-25deg);
                    transition: 0.5s;
                }

                .microsoft-btn:hover {
                    transform: translateY(-2px);
                    background: #f8fafc;
                }

                .microsoft-btn:hover .btn-shimmer {
                    left: 150%;
                    transition: 0.8s;
                }

                .login-footer {
                    margin-top: 40px;
                    position: relative;
                }

                .footer-accent {
                    width: 40px;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 0 auto 24px;
                }

                .login-footer p {
                    color: rgba(255, 255, 255, 0.25);
                    font-size: 12px;
                    margin-bottom: 12px;
                    letter-spacing: 0.05em;
                }

                .footer-links {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }

                .footer-links a {
                    color: rgba(212, 175, 55, 0.6);
                    text-decoration: none;
                    font-size: 12px;
                    transition: all 0.3s ease;
                }

                .footer-links a:hover {
                    color: #d4af37;
                    text-decoration: underline;
                }

                .dot {
                    width: 3px;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                }

                @keyframes float {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(30px, 30px); }
                }

                @media (max-width: 480px) {
                    .login-card {
                        padding: 48px 32px;
                        border-radius: 0;
                        height: 100vh;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
