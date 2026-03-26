import { Building2, Plus, Compass } from 'lucide-react';

const sitesData = [
  { name: 'Westside Heights', id: '#BT-4022', loc: 'Downtown Metro Area', status: 'ACTIVE', manager: 'David Chen', progress: 62 },
  { name: 'Riverside Plaza', id: '#BT-3891', loc: 'North Harbor District', status: 'PENDING', manager: 'Sarah Miller', progress: 0 },
  { name: 'Oakwood Residential', id: '#BT-4055', loc: 'East Hills Park', status: 'ACTIVE', manager: 'Marcus James', progress: 18 },
];

export default function SiteManagement() {
  return (
    <div className="flex-1 ml-64 bg-slate-50 min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-orange-800 text-[10px] font-bold uppercase tracking-widest mb-1">Infrastructure Hub</p>
          <h2 className="text-4xl font-extrabold text-gray-800">Site Management</h2>
        </div>
        <button className="bg-orange-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-orange-100">
          <Plus size={20} /> New Project
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-gray-50 flex justify-between items-center relative overflow-hidden">
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Active Projects</p>
            <h3 className="text-3xl font-black text-gray-800 mb-4">12</h3>
            <div className="flex gap-2">
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold">3 High Priority</span>
              <span className="bg-orange-50 text-orange-800 px-3 py-1 rounded-full text-[10px] font-bold">+2 This Quarter</span>
            </div>
          </div>
          <Compass size={120} className="text-gray-50 absolute -right-4 -bottom-4 rotate-12" />
        </div>

        <div className="bg-[#005B8E] p-8 rounded-2xl text-white">
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-2">Portfolio Completion</p>
          <h3 className="text-5xl font-black mb-6">84%</h3>
          <div className="w-full h-2 bg-blue-900/50 rounded-full mb-3">
            <div className="w-[84%] h-full bg-white rounded-full"></div>
          </div>
          <p className="text-blue-100 text-xs font-medium">9 sites completed in the last 12 months</p>
        </div>
      </div>

      {/* Site List Table */}
      <div className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100/50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <tr>
              <th className="px-6 py-5">Site Name</th>
              <th className="px-6 py-5">Location</th>
              <th className="px-6 py-5">Status</th>
              <th className="px-6 py-5">Manager</th>
              <th className="px-6 py-5">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sitesData.map((site) => (
              <tr key={site.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-6 flex items-center gap-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-orange-800"><Building2 size={20} /></div>
                  <div>
                    <p className="font-bold text-sm text-gray-800">{site.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Project {site.id}</p>
                  </div>
                </td>
                <td className="px-6 py-6 text-sm text-gray-500 font-medium">{site.loc}</td>
                <td className="px-6 py-6">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${
                    site.status === 'ACTIVE' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {site.status}
                  </span>
                </td>
                <td className="px-6 py-6 flex items-center gap-3">
                   <img src={`https://ui-avatars.com/api/?name=${site.manager}`} className="w-8 h-8 rounded-full" alt="" />
                   <span className="text-sm font-bold text-gray-700">{site.manager}</span>
                </td>
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-800" style={{ width: `${site.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{site.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
