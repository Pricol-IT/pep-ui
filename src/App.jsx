import { useState } from 'react'
import Sidebar from './components/Sidebar'
import WelcomeCard from './components/WelcomeCard'

import Applications from './components/Applications'
import ActivityTimeline from './components/ActivityTimeline'
import RightSidebar from './components/RightSidebar'
import QuickDock from './components/QuickDock'
import AnnouncementBar from './components/AnnouncementBar'
import './index.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProfilePage from './components/ProfilePage'
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
                    {/* Left Column - Primary Content */}
                    <div className="content-primary">
                      <AnnouncementBar />
                      <WelcomeCard />

                      <Applications />
                      <ActivityTimeline />
                    </div>

                    {/* Right Column - Sidebar Content */}
                    <RightSidebar />
                  </div>
                } />
                <Route path="/profile" element={<ProfilePage />} />
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
