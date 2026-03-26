import { UserPlus, Pencil, Trash2, Users, HardHat } from 'lucide-react';

const laborers = [
  { id: 'BT-LAB-402', name: 'John Doe', role: 'Mason', wage: '$45.00', site: 'Downtown Plaza', status: 'ACTIVE', initial: 'JD' },
  { id: 'BT-LAB-115', name: 'Mike Ross', role: 'Helper', wage: '$28.00', site: 'River Heights', status: 'ACTIVE', initial: 'MR' },
  { id: 'BT-LAB-891', name: 'Sarah Hudson', role: 'Carpenter', wage: '$52.00', site: 'Bridge Project X', status: 'LEAVE', initial: 'SH' },
];

export default function LaborersDirectory() {
  return (
    <div className="bg-white rounded-2xl border border-gray-50 shadow-sm mt-8 overflow-hidden">
      {/* Header & Tabs */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button className="flex items-center gap-2 px-6 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-orange-800">
              <Users size={16} /> Laborers
            </button>
            <button className="flex items-center gap-2 px-6 py-2 text-gray-500 text-sm font-medium hover:text-gray-700">
              <HardHat size={16} /> Engineers
            </button>
          </div>
          <button className="bg-orange-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-orange-100 hover:bg-orange-900 transition-all">
            <UserPlus size={18} /> Add New Laborer
          </button>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-6">Laborers Directory</h3>

        {/* Table */}
        <div className="w-full">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              <tr>
                <th className="px-4 py-4">Name & ID</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Daily Wage</th>
                <th className="px-4 py-4">Assigned Site</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {laborers.map((person) => (
                <tr key={person.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-bold text-xs">
                      {person.initial}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">{person.name}</p>
                      <p className="text-[10px] text-gray-400 font-medium">{person.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-5 text-sm font-bold text-gray-700">{person.role}</td>
                  <td className="px-4 py-5 text-sm text-gray-500 font-medium">{person.wage}</td>
                  <td className="px-4 py-5 text-sm text-gray-500 font-medium">{person.site}</td>
                  <td className="px-4 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      person.status === 'ACTIVE' 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {person.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-right space-x-3">
                    <button className="text-gray-400 hover:text-gray-600"><Pencil size={18} /></button>
                    <button className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}