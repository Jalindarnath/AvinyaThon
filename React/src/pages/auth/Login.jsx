import { useState } from "react";
import { useSignIn } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { Building2, ShieldCheck, HardHat, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const ADMIN_EMAIL = "admin@samarthdevelopers.com";

const Login = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("manager");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // When switching to Admin tab, pre-fill the admin email
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setError("");
    setPassword("");
    setEmail(tab === "admin" ? ADMIN_EMAIL : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoaded) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      } else {
        setError("Sign-in could not be completed. Please try again.");
      }
    } catch (err) {
      const msg = err?.errors?.[0]?.longMessage || err?.errors?.[0]?.message || "Invalid email or password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = activeTab === "admin";

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
            type="button"
            onClick={() => handleTabSwitch("manager")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              !isAdmin
                ? "bg-orange-800 text-white shadow"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <HardHat size={15} />
            Manager
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("admin")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isAdmin
                ? "bg-indigo-700 text-white shadow"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            <ShieldCheck size={15} />
            Admin
          </button>
        </div>

        {/* Form Card */}
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className={`px-8 py-6 ${isAdmin ? "bg-indigo-700" : "bg-orange-800"} text-white`}>
            <div className="flex items-center gap-3">
              {isAdmin ? <ShieldCheck size={22} /> : <HardHat size={22} />}
              <div>
                <h2 className="text-lg font-bold">
                  {isAdmin ? "Admin Sign In" : "Manager Sign In"}
                </h2>
                <p className="text-sm opacity-75">
                  {isAdmin
                    ? "Restricted to authorized administrators only."
                    : "Access your assigned sites and manage your team."}
                </p>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="px-8 py-7 space-y-5">
            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg font-medium">
                {error}
              </div>
            )}

            {/* Admin hint */}
            {isAdmin && (
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-4 py-2.5 rounded-lg">
                <ShieldCheck size={13} className="flex-shrink-0" />
                Admin account: <strong>{ADMIN_EMAIL}</strong>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  readOnly={isAdmin}
                  placeholder={isAdmin ? ADMIN_EMAIL : "Enter your email"}
                  className={`w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 transition-all font-medium
                    ${isAdmin
                      ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed"
                      : "bg-slate-50 border-slate-200 text-slate-800 focus:ring-orange-400 focus:bg-white"
                    }`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-9 pr-11 py-2.5 text-sm rounded-xl border bg-slate-50 focus:bg-white text-slate-800 focus:outline-none focus:ring-2 transition-all font-medium
                    ${isAdmin ? "focus:ring-indigo-400 border-slate-200" : "focus:ring-orange-400 border-slate-200"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isLoaded}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed mt-2
                ${isAdmin
                  ? "bg-indigo-700 hover:bg-indigo-600 shadow-indigo-200 hover:shadow-indigo-300"
                  : "bg-orange-800 hover:bg-orange-700 shadow-orange-100 hover:shadow-orange-200"
                }`}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                `Sign In as ${isAdmin ? "Admin" : "Manager"}`
              )}
            </button>

            {/* Sign up link (only for managers) */}
            {!isAdmin && (
              <p className="text-center text-xs text-slate-500 pt-1">
                Don't have an account?{" "}
                <Link to="/signup" className="text-orange-700 font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;