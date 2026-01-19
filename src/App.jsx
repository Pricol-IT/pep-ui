import { useState } from 'react'
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

import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProfilePage from './components/ProfilePage'
import BirthdayPage from './components/BirthdayPage'
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

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Router>
      <div className="shell">
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
      <AppContent />
    </AuthProvider>
  )
}

export default App
