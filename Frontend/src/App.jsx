import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SiteManagement from './components/SiteManagement';
import LaborersDirectory from './components/LaborersDirectory';
import EngineeringStaff from './components/EngineeringStaff';

function App() {
  return (
    <Router>
      <div className="flex bg-slate-50 min-h-screen">
        {/* Sidebar is outside Routes so it's always visible */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            {/* The "Dashboard" route */}
            <Route path="/" element={<Dashboard />} />
            
            {/* The "Sites" route */}
            <Route path="/sites" element={<SiteManagement />} />
            
            {/* The "Workers" route */}
            <Route path="/workers" element={<LaborersDirectory />} />
            
            {/* The "Engineers" route */}
            <Route path="/engineers" element={<EngineeringStaff />} />
            
            {/* Fallback for 404s */}
            <Route path="*" element={<div className="p-20 ml-64">Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;