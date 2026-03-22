import { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './components/Sidebar'
import WelcomeCard from './components/WelcomeCard'

import Applications from './components/Applications'
import ActivityTimeline from './components/ActivityTimeline'
import RightSidebar from './components/RightSidebar'
import QuickDock from './components/QuickDock'
import AnnouncementBar from './components/AnnouncementBar'
import CalendarWidget from './components/CalendarWidget'
import BirthdayWidget from './components/BirthdayWidget'
import NewJoiners from './components/NewJoiners'
import './index.css'

import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TaskProvider } from './context/TaskContext'
import ProfilePage from './components/ProfilePage'
import BirthdayPage from './components/BirthdayPage'
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './components/admin/AdminDashboard'
import AccessRequestStatus from './components/admin/AccessRequestStatus'
import CompanyLocationManager from './components/admin/CompanyLocationManager'
import AnnouncementManager from './components/admin/AnnouncementManager'
import OfficeAddressManager from './components/admin/OfficeAddressManager'
import './index.css'

function ProtectedRoute({ children, pageName }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const hasAccess = (page) => {
    if (!user) return false;
    if (!user.page_accesses || user.page_accesses.length === 0) return true;
    return user.page_accesses.some(access =>
      access.page_name.toLowerCase() === page.toLowerCase() && access.can_access
    );
  };

  if (!hasAccess(pageName)) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You do not have permission to access the "{pageName}" page.</p>
        <button onClick={() => navigate('/')}>Go to Dashboard</button>
        <style>{`
          .access-denied {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 60vh;
            color: #fff;
            text-align: center;
          }
          .access-denied h2 { color: #d4af37; margin-bottom: 1rem; }
          .access-denied button {
            margin-top: 2rem;
            padding: 0.5rem 2rem;
            background: #d4af37;
            border: none;
            border-radius: 4px;
            cursor: pointer;
          }
        `}</style>
      </div>
    );
  }

  return children;
}

function ClickTracker() {
  const { user } = useAuth();

  useEffect(() => {
    const handleClick = (e) => {
      if (!user) return;

      const target = e.target.closest('a') || e.target.closest('[data-track]');
      if (target) {
        const url = target.href || target.getAttribute('data-url') || window.location.pathname;
        const text = target.getAttribute('data-track') || target.innerText || 'unknown';

        // Fire and forget click tracking
        if (text && text !== 'unknown') {
          axios.post('/api/track-click', { url, text }).catch(() => {});
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [user]);

  return null;
}

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Router>
      <div className="shell">
        <ClickTracker />
        <div className="dashboard-bg-pattern"></div>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="main-layout">
          <main className="content" id="main-content">
            <div className="content-container">
              <Routes>
                <Route path="/" element={
                  <ProtectedRoute pageName="dashboard">
                    <div className="content-grid">
                      {/* Left Column (Grid 4) */}
                      <RightSidebar />

                      {/* Right Column (Grid 8) */}
                      <div className="content-primary">
                        <AnnouncementBar />
                        <WelcomeCard />

                        <div className="dashboard-widgets-grid">
                          <CalendarWidget />
                          <div className="dashboard-widgets-column">
                            <BirthdayWidget />
                            <NewJoiners />
                          </div>
                        </div>

                        <ActivityTimeline />
                      </div>
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute pageName="profile">
                    <ProfilePage />
                  </ProtectedRoute>
                } />
                <Route path="/birthdays" element={
                  <ProtectedRoute pageName="birthdays">
                    <BirthdayPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="access-request" element={<AccessRequestStatus />} />
                  <Route path="company-location" element={<CompanyLocationManager />} />
                  <Route path="announcements" element={<AnnouncementManager />} />
                  <Route path="office-address" element={<OfficeAddressManager />} />
                </Route>
              </Routes>
            </div>
          </main>
        </div>

        <QuickDock />
      </div>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  )
}

export default App
