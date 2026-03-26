import { LayoutDashboard, Building2, Users, HardHat, CalendarCheck, CreditCard, Package, FileText, BarChart3, Settings, LifeBuoy, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Building2, label: 'Sites', path: '/sites' },
    { icon: Users, label: 'Workers', path: '/workers' },
    { icon: HardHat, label: 'Engineers', path: '/engineers' },
    { icon: CalendarCheck, label: 'Attendance', path: '/attendance' },
    { icon: CreditCard, label: 'Payments', path: '/payments' },
    { icon: Package, label: 'Inventory', path: '/inventory' },
    { icon: FileText, label: 'Invoices', path: '/invoices' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4 fixed left-0 top-0">
      {/* Logo Section */}
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="bg-orange-800 p-2 rounded-lg text-white">
          <Building2 size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight">BuildTrack</h1>
          <p className="text-[10px] uppercase tracking-widest text-gray-400">Construction Management</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1">
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
      <div className="pt-4 border-t border-gray-100 space-y-1">
        <button className="w-full bg-gradient-to-r from-orange-700 to-orange-800 text-white flex items-center justify-center gap-2 py-3 rounded-xl shadow-lg shadow-orange-100 mb-4 font-semibold hover:shadow-orange-200 transition-all">
          <Plus size={20} /> New Project
        </button>
        
        <NavLink 
          to="/settings"
          className={({ isActive }) => 
            `w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive ? 'bg-orange-50 text-orange-700' : 'text-gray-500 hover:bg-gray-50'
            }`
          }
        >
          <Settings size={18} /> Settings
        </NavLink>

        <NavLink 
          to="/support"
          className={({ isActive }) => 
            `w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive ? 'bg-orange-50 text-orange-700' : 'text-gray-500 hover:bg-gray-50'
            }`
          }
        >
          <LifeBuoy size={18} /> Support
        </NavLink>
      </div>
    </div>
  );
}