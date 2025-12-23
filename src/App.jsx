import { useState } from 'react'
import Sidebar from './components/Sidebar'
import WelcomeCard from './components/WelcomeCard'

import Applications from './components/Applications'
import ActivityTimeline from './components/ActivityTimeline'
import RightSidebar from './components/RightSidebar'
import QuickDock from './components/QuickDock'
import AnnouncementBar from './components/AnnouncementBar'
import CalendarWidget from './components/CalendarWidget'
import TodoWidget from './components/TodoWidget'
import './index.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProfilePage from './components/ProfilePage'
import BirthdayPage from './components/BirthdayPage'
import './index.css'

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Router>
      <div className="shell">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="main-layout">
          <main className="content" id="main-content">
            <div className="content-container">
              <Routes>
                <Route path="/" element={
                  <div className="content-grid">
                    {/* Left Column (Grid 4) */}
                    <RightSidebar />

                    {/* Right Column (Grid 8) */}
                    <div className="content-primary">
                      <AnnouncementBar />
                      <WelcomeCard />

                      <div className="dashboard-widgets-grid">
                        <CalendarWidget />
                        <TodoWidget />
                      </div>

                      <ActivityTimeline />
                    </div>
                  </div>
                } />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/birthdays" element={<BirthdayPage />} />
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
