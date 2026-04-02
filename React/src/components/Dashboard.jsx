import { Building2, Users, Wallet, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import StatCard from './StatCard';
import { useSite } from '../context/SiteContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { selectedSite, sites } = useSite();

  return (
    <div className="flex-1 ml-64 bg-slate-50 min-h-screen p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-800 bg-orange-100 px-4 py-2 rounded-xl border border-orange-200">
            Current Site: <span className="font-bold">{selectedSite ? (selectedSite.siteName || selectedSite.name || 'Unnamed Site') : 'All Sites'}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
            {user?.role === 'admin' && (
              <button 
                onClick={() => window.location.href = '/create-manager'}
                className="bg-orange-800 text-white hover:bg-orange-700 text-xs font-bold py-2 px-4 rounded-lg shadow-sm mr-2 transition-colors flex items-center gap-1"
              >
                <Users size={14} /> New Manager
              </button>
            )}
            <div className="text-right">
              <p className="text-sm font-bold">{user?.name || 'User'}</p>
              <p className="text-[10px] text-gray-400 uppercase font-medium">{user?.role === 'admin' ? 'Project Admin' : 'Site Manager'}</p>
            </div>
            <button 
              onClick={logout}
              className="h-10 w-10 flex items-center justify-center rounded-full border-2 border-white shadow-sm bg-orange-100 text-orange-800 hover:bg-orange-200 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mb-10">
        <h2 className="text-5xl font-extrabold text-gray-800 mb-3">Executive Summary</h2>
        <p className="text-gray-500 max-w-xl leading-relaxed">
          Real-time overview of active construction sites, financial health, and workforce allocation for Q3 2023.
        </p>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {user?.role === 'admin' && (
          <StatCard title="Total Sites" value={sites?.length || sites || "5"} subtitle="active this month" trend="+1" icon={Building2} colorClass="bg-blue-50" />
        )}
        <StatCard title="Total Workers" value="120" subtitle="Active Now" icon={Users} colorClass="bg-orange-50" />
        <StatCard title="Total Expenses" value="$45,200" subtitle="Updated 14 mins ago" trend="+12%" icon={Wallet} colorClass="bg-orange-50" />
        <StatCard title="Pending Payments" value="$8,500" badge="Urgent" icon={CreditCard} colorClass="bg-red-50" />
      </div>

      {/* Bottom Section: Progress & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
          <h4 className="font-bold text-lg mb-6">Expense Breakdown</h4>
          <div className="h-48 flex items-center justify-center border-b border-dashed mb-6 text-gray-300">
            {/* You would use Chart.js or Recharts here */}
            [Chart Placeholder]
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-orange-800"></div> Direct Labor
              </span>
              <span className="font-bold">$29,380</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div> Materials
              </span>
              <span className="font-bold">$12,420</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-50 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold text-lg">Recent Activity</h4>
            <button className="text-orange-700 text-sm font-bold hover:underline">View All Activity</button>
          </div>
          {/* Activity List Mockup */}
          <div className="space-y-6">
            {[
              { ref: 'Concrete Supplies Ltd', cat: 'Inventory', date: 'Oct 24, 2023', amt: '$3,240.00' },
              { ref: 'Weekly Wages - Site A', cat: 'Labor', date: 'Oct 22, 2023', amt: '$12,850.00' },
              { ref: 'Global Heavy Mach.', cat: 'Equipment', date: 'Oct 20, 2023', amt: '$1,100.00' },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                   <div>
                     <p className="font-bold text-sm">{row.ref}</p>
                     <p className="text-[10px] text-gray-400 uppercase tracking-tighter">INV-882193</p>
                   </div>
                </div>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase">{row.cat}</span>
                <span className="text-gray-500 text-sm">{row.date}</span>
                <span className="font-bold text-sm">{row.amt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}