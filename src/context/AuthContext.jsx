import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import LoginPage from '../components/LoginPage';

const AuthContext = createContext();

// Configure axios for relative paths (working with Vite proxy)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = '';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/auth/user');
            setUser(response.data);
            setLoading(false);
        } catch (error) {
            setUser(null);
            setLoading(false);
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

        // If we have a code in the URL but we are on port 5173, 
        // it means Azure redirected to the frontend instead of the backend.
        if (urlParams.has('code') && !window.location.pathname.includes('auth/callback')) {
            window.location.href = `/auth/callback?${urlParams.toString()}`;
            return;
        }

        if (urlParams.get('login') === 'success') {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        if (urlParams.get('error')) {
            setLoading(false);
            return;
        }

        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await axios.post('/auth/logout');
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {loading ? (
                <div className="auth-loading">
                    <div className="loader"></div>
                    <p>Authenticating with SSO...</p>
                    <style>{`
                        .auth-loading {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: #0f172a;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            z-index: 9999;
                            color: #fff;
                            font-family: 'Poppins', sans-serif;
                        }
                        .auth-loading p {
                            margin-top: 24px;
                            font-size: 16px;
                            opacity: 0.7;
                        }
                        .loader {
                            width: 48px;
                            height: 48px;
                            border: 3px solid rgba(255, 255, 255, 0.1);
                            border-radius: 50%;
                            border-top-color: #0f84cf;
                            animation: spin 1s ease-in-out infinite;
                        }
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            ) : user ? (
                children
            ) : (
                <LoginPage />
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
