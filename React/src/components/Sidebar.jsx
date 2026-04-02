import { LayoutDashboard, Building2, Users, HardHat, CalendarCheck, CreditCard, Package, FileText, BarChart3, Settings, LifeBuoy, Plus } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const { selectedSite, setSelectedSite, sites } = useSite();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    // Only add 'Sites' nav item if user is an admin
    ...(isAdmin ? [{ icon: Building2, label: 'Sites', path: '/sites' }] : []),
    { icon: Users, label: 'Workers', path: '/workers' },
    { icon: HardHat, label: 'Engineers', path: '/engineers' },
    { icon: CalendarCheck, label: 'Attendance', path: '/attendance' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: FileText, label: 'Invoices', path: '/invoices' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
  ];

  const handleCreateSiteNavigate = () => {
    navigate('/create-site');
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4 fixed left-0 top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-2 mb-4 px-2">
        <div className="bg-orange-800 p-2 rounded-lg text-white">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">Samarth Developers</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Construction Mgt</p>
        </div>
      </div>

      {/* Global Site Selector */}
      {sites.length > 0 && (
        <div className="mb-6 px-2">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1 block">Active Site</label>
          <select 
            className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedSite?.$id || ''}
            onChange={(e) => {
              const site = sites.find(s => s.$id === e.target.value);
              setSelectedSite(site);
            }}
          >
            {sites.map(site => (
              <option key={site.$id} value={site.$id}>
                {site.siteName || site.name || 'Unnamed Site'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => 
              `w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-orange-50 text-orange-700' : 'text-gray-500 hover:bg-gray-50'
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Section */}
      {isAdmin && (
        <div className="pt-4 border-t border-gray-100 space-y-1">
          <button 
            onClick={handleCreateSiteNavigate}
            className="w-full bg-gradient-to-r from-orange-700 to-orange-800 text-white flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg shadow-orange-100 mb-4 font-semibold hover:shadow-orange-200 transition-all cursor-pointer"
          >
            <Plus size={20} /> New Site
          </button>
        </div>
      )}
    </div>
  );
}