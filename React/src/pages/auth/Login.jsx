import { useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { Building2, ShieldCheck, HardHat } from "lucide-react";

const ADMIN_EMAIL = "admin@samarthdevelopers.com";

const Login = () => {
  const [activeTab, setActiveTab] = useState("manager");

  return (
    <div className="flex min-h-screen">
      {/* ── Left Brand Panel ── */}
      <div className="hidden lg:flex w-80 xl:w-96 flex-shrink-0 flex-col justify-center px-10 py-12 bg-gradient-to-br from-orange-950 via-orange-900 to-orange-700 text-white">
        <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
          <Building2 size={32} />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight mb-1">Samarth Developers</h1>
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-6">
          Construction Management
        </p>
        <p className="text-sm text-white/70 leading-relaxed mb-10">
          Manage your sites, teams, inventory, and finances — all in one centralised platform.
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm font-semibold">
            <HardHat size={16} className="flex-shrink-0" />
            Manager Portal
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/30 rounded-xl px-4 py-3 text-sm font-semibold">
            <ShieldCheck size={16} className="flex-shrink-0" />
            Admin Portal
          </div>
        </div>
      </div>

      {/* ── Right Auth Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 px-4 py-10 overflow-y-auto">

        {/* Tab Switcher */}
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab("manager")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "manager"
                ? "bg-orange-800 text-white shadow"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <HardHat size={15} />
            Manager
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === "admin"
                ? "bg-indigo-700 text-white shadow"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <ShieldCheck size={15} />
            Admin
          </button>
        </div>

        {/* Dynamic header — swaps based on active tab */}
        <div className="w-full max-w-md flex flex-col items-center mb-5">
          {activeTab === "manager" ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 text-orange-800 mb-3">
                <HardHat size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Manager Sign In</h2>
              <p className="text-sm text-slate-500 mt-1">
                Access your assigned sites and manage your team.
              </p>
            </div>
          ) : (
            <div className="text-center w-full">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 mb-3">
                <ShieldCheck size={24} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Admin Sign In</h2>
              <p className="text-sm text-slate-500 mt-1">
                Full system access. Restricted to authorized administrators only.
              </p>
              {/* Admin email hint */}
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-4 py-2.5 rounded-lg mt-4">
                <ShieldCheck size={14} className="flex-shrink-0" />
                <span>
                  Admin ID: <strong className="font-bold">{ADMIN_EMAIL}</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Single persistent SignIn widget — avoids 422 conflicts from dual mounting */}
        <SignIn routing="path" path="/login" signUpUrl="/signup" />
      </div>
    </div>
  );
};

export default Login;