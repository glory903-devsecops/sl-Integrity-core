import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ERPPage from './pages/ERPPage';
import EnginePage from './pages/EnginePage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex min-h-screen bg-sl-bg text-sl-text relative overflow-x-hidden font-dm-sans">
        {/* SVG Grain Overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[9999] mix-blend-overlay">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onOpen={() => setIsSidebarOpen(true)} />
        
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto lg:ml-0 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardPage onOpenSidebar={() => setIsSidebarOpen(true)} />} />
              <Route path="/erp" element={<ERPPage onOpenSidebar={() => setIsSidebarOpen(true)} />} />
              <Route path="/engine" element={<EnginePage onOpenSidebar={() => setIsSidebarOpen(true)} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
