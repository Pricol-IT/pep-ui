import React, { useEffect, useState } from 'react';

const LoginPage = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({
                x: e.clientX / window.innerWidth,
                y: e.clientY / window.innerHeight,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleMicrosoftLogin = () => {
        window.location.href = '/auth/redirect';
    };

    return (
        <div className="login-root">
            <div className="background-overlay">
                <img 
                    src="/lmage/50years-bg-new.png" 
                    alt="" 
                    className="bg-anniversary-logo"
                    style={{
                        transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
                    }}
                />
            </div>

            <main className="login-container">
                <div className="login-card">
                    <div className="logo-section">
                        <img src="/lmage/50years-center.svg" alt="50th Year Logo" className="anniversary-logo" />
                        <div className="pricol-logo-container">
                            <img src="/lmage/pricol-gold-logo-new.png" alt="Pricol Logo" className="pricol-official-logo" />
                        </div>
                    </div>

                    <div className="auth-section">
                        <button className="microsoft-btn" onClick={handleMicrosoftLogin}>
                            <div className="ms-icon">
                                <span></span><span></span><span></span><span></span>
                            </div>
                            Sign in with Pricol ID
                        </button>
                    </div>

                    <footer className="card-footer">
                        <p className="copyright">© {new Date().getFullYear()} Pricol</p>
                        <div className="footer-links">
                            <a href="https://myapp.pricol.co.in/pricol/policy/index.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                            <span className="separator">•</span>
                            <a href="https://pricol.freshservice.com/support/home" target="_blank" rel="noopener noreferrer">Support</a>
                        </div>
                    </footer>
                </div>
            </main>

            <style>{`
                .login-root {
                    --navy-bg: #002855;
                    --navy-dark: #001f44;
                    --gold: #E3B330;
                    --gold-light: #e0c896;
                    --white: #ffffff;
                    --glass-bg: rgba(255, 255, 255, 0.03);
                    --glass-border: rgba(255, 255, 255, 0.08);
                    --ms-brand: #ffffff;

                    font-family: 'Inter', sans-serif;
                    background-color: var(--navy-bg);
                    color: var(--white);
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                    position: relative;
                    background: radial-gradient(circle at center, #002d5d 0%, #001a35 100%);
                    margin: 0;
                    padding: 0;
                }

                .background-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1;
                    overflow: hidden;
                    pointer-events: none;
                }

                .bg-anniversary-logo {
                    position: absolute;
                    width: 110%;
                    height: 110%;
                    top: -5%;
                    left: -5%;
                    opacity: 0.25;
                    pointer-events: none;
                    object-fit: cover;
                    transition: transform 0.1s ease-out;
                }

                .login-container {
                    width: 100%;
                    max-width: 480px;
                    padding: 24px;
                    z-index: 10;
                }

                .login-card {
                    background: #002855;
                    backdrop-filter: blur(25px) saturate(150%);
                    -webkit-backdrop-filter: blur(25px) saturate(150%);
                    border: 1px solid var(--glass-border);
                    border-radius: 40px;
                    padding: 64px 48px;
                    text-align: center;
                    box-shadow:
                        0 40px 100px -20px rgba(0, 0, 0, 0.6),
                        inset 0 0 40px rgba(255, 255, 255, 0.02);
                    position: relative;
                }

                .logo-section {
                    margin-bottom: 60px;
                }

                .anniversary-logo {
                    width: 240px;
                    height: auto;
                    margin-bottom: 15px;
                    filter: drop-shadow(0 0 15px rgba(208, 173, 103, 0.2));
                }

                .pricol-logo-container {
                    margin-bottom: 10px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .pricol-official-logo {
                    width: 180px;
                    height: auto;
                    filter: drop-shadow(0 0 10px rgba(208, 173, 103, 0.1));
                }

                .auth-section {
                    margin-bottom: 30px;
                }

                .microsoft-btn {
                    width: 100%;
                    background: var(--white);
                    color: #444;
                    border: none;
                    border-radius: 16px;
                    padding: 16px 28px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 14px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
                }

                .microsoft-btn:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
                    background: #ffffff;
                }

                .microsoft-btn:active {
                    transform: translateY(-2px);
                }

                .ms-icon {
                    width: 22px;
                    height: 22px;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2px;
                }

                .ms-icon span {
                    background: #D0AD67;
                    width: 100%;
                    height: 100%;
                }

                .card-footer {
                    padding-top: 20px;
                    position: relative;
                }

                .card-footer::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60px;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                }

                .copyright {
                    font-size: 11px;
                    color: rgba(255, 255, 255, 0.3);
                    margin-bottom: 12px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .footer-links {
                    display: flex;
                    justify-content: center;
                    gap: 12px;
                }

                .footer-links a {
                    color: var(--gold);
                    text-decoration: none;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }

                .footer-links a:hover {
                    color: var(--gold-light);
                    text-decoration: underline;
                }

                .separator {
                    color: var(--gold);
                    font-size: 14px;
                    margin: 0 4px;
                }

                @media (max-width: 480px) {
                    .login-container {
                        padding: 16px;
                    }

                    .login-card {
                        padding: 40px 24px;
                        border-radius: 32px;
                    }

                    .logo-section {
                        margin-bottom: 40px;
                    }

                    .anniversary-logo {
                        width: 180px;
                        margin-bottom: 20px;
                    }

                    .pricol-official-logo {
                        width: 140px;
                    }

                    .microsoft-btn {
                        padding: 14px 20px;
                        font-size: 14px;
                        white-space: nowrap;
                    }

                    .ms-icon {
                        width: 18px;
                        height: 18px;
                    }

                    .footer-links a {
                        font-size: 12px;
                    }
                }

                @media (max-height: 850px) {
                    .login-card {
                        padding: 40px 48px;
                    }

                    .logo-section {
                        margin-bottom: 30px;
                    }

                    .auth-section {
                        margin-bottom: 20px;
                    }

                    .anniversary-logo {
                        width: 200px;
                        margin-bottom: 15px;
                    }

                    .pricol-official-logo {
                        width: 150px;
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
