import { useState } from 'react'
import Sidebar from './components/Sidebar'
import WelcomeCard from './components/WelcomeCard'

import Applications from './components/Applications'
import ActivityTimeline from './components/ActivityTimeline'
import RightSidebar from './components/RightSidebar'
import QuickDock from './components/QuickDock'
import AnnouncementBar from './components/AnnouncementBar'
import './index.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-layout">


        <main className="content" id="main-content">
          <div className="content-container">
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
          </div>
        </main>
      </div>

      <QuickDock />
    </div>
  )
}

export default App
