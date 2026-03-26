import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

// Actual components for our dashboard
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import SiteManagement from "../components/SiteManagement";
import LaborersDirectory from "../components/LaborersDirectory";
import EngineeringStaff from "../components/EngineeringStaff";

const ProtectedLayout = () => {
  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/login/*" 
          element={
            <>
              <SignedIn>
                <Navigate to="/" replace />
              </SignedIn>
              <SignedOut>
                <Login />
              </SignedOut>
            </>
          } 
        />
        <Route 
          path="/signup/*" 
          element={
            <>
              <SignedIn>
                <Navigate to="/" replace />
              </SignedIn>
              <SignedOut>
                <Signup />
              </SignedOut>
            </>
          } 
        />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/" 
          element={
            <>
              <SignedIn>
                <ProtectedLayout />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          } 
        >
          <Route index element={<Dashboard />} />
          <Route path="sites" element={<SiteManagement />} />
          <Route path="workers" element={<LaborersDirectory />} />
          <Route path="engineers" element={<EngineeringStaff />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;