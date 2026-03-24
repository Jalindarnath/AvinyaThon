import React from "react";
import { UserButton, useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user } = useUser();

  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-700 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[260px] bg-slate-800 text-white flex flex-col shadow-lg z-10 shrink-0">
        <div className="p-6 border-b border-slate-700 flex items-center justify-center">
          <h2 className="text-xl font-bold text-center text-sky-400 tracking-wide">
            Samarth Developers
          </h2>
        </div>
        <nav className="py-6 flex-1">
          <ul className="list-none flex flex-col">
            <li className="px-6 py-4 text-base font-medium cursor-pointer transition-all duration-200 border-l-4 bg-slate-950 text-sky-400 border-sky-400">
              Dashboard
            </li>
            <li className="px-6 py-4 text-base font-medium text-slate-300 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:bg-slate-700 hover:text-white">
              Projects
            </li>
            <li className="px-6 py-4 text-base font-medium text-slate-300 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:bg-slate-700 hover:text-white">
              Team
            </li>
            <li className="px-6 py-4 text-base font-medium text-slate-300 cursor-pointer transition-all duration-200 border-l-4 border-transparent hover:bg-slate-700 hover:text-white">
              Settings
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top Navbar */}
        <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm shrink-0">
          <div className="topbar-search">
            <input 
              type="text" 
              placeholder="Search..." 
              className="px-4 py-2 border border-slate-300 rounded-md w-[300px] text-sm outline-none transition-colors duration-200 focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="font-medium text-slate-600">Welcome, {user?.firstName || 'User'}!</span>
            <UserButton afterSignOutUrl="/login" />
          </div>
        </header>

        {/* Dashboard Content area */}
        <div className="p-8 overflow-y-auto flex-1">
          <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
              <h3 className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-semibold">Active Projects</h3>
              <p className="text-3xl font-bold text-slate-900">12</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
              <h3 className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-semibold">Team Members</h3>
              <p className="text-3xl font-bold text-slate-900">24</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-100">
              <h3 className="text-sm text-slate-500 mb-2 uppercase tracking-wide font-semibold">Tasks Completed</h3>
              <p className="text-3xl font-bold text-slate-900">148</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
