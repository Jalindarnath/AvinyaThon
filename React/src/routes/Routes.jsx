import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";

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
        <Route 
          path="/*" 
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          } 
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;