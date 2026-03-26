import { UserPlus, Pencil, Trash2 } from 'lucide-react';

const engineers = [
  { 
    id: 'E-44201', 
    name: 'Elena Rodriguez', 
    specialty: 'Licensed Civil', 
    role: 'Project Lead', 
    salary: '$8,400.00', 
    dept: 'Structural Planning',
    img: 'https://i.pravatar.cc/150?u=elena' 
  },
  { 
    id: 'E-44205', 
    name: 'Marcus Chen', 
    specialty: 'QA/QC Specialist', 
    role: 'Quality Control', 
    salary: '$6,850.00', 
    dept: 'Standards Compliance',
    img: 'https://i.pravatar.cc/150?u=marcus' 
  },
];

export default function EngineeringStaff() {
  return (
    <div className="bg-white rounded-2xl border border-gray-50 shadow-sm mt-8 overflow-hidden">
      <div className="p-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-800">Engineering Staff</h3>
            <p className="text-gray-400 text-sm mt-1">Monthly professional contractors and permanent leads.</p>
          </div>
          <button className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-black transition-all">
            <UserPlus size={18} /> Add New Engineer
          </button>
        </div>

        <table className="w-full text-left">
          <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <tr>
              <th className="px-4 py-4">Engineer</th>
              <th className="px-4 py-4">Role</th>
              <th className="px-4 py-4">Monthly Salary</th>
              <th className="px-4 py-4">Department</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {engineers.map((eng) => (
              <tr key={eng.id} className="group">
                <td className="px-4 py-5 flex items-center gap-4">
                  <img src={eng.img} className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" alt={eng.name} />
                  <div>
                    <p className="font-bold text-sm text-gray-800">{eng.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{eng.id} • {eng.specialty}</p>
                  </div>
                </td>
                <td className={`px-4 py-5 text-sm font-bold ${eng.role === 'Project Lead' ? 'text-orange-800' : 'text-gray-700'}`}>
                  {eng.role}
                </td>
                <td className="px-4 py-5 text-sm text-gray-600 font-semibold">{eng.salary}</td>
                <td className="px-4 py-5 text-sm text-gray-500 font-medium">{eng.dept}</td>
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
  );
}