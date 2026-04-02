import { useState, useEffect } from 'react';
import { UserPlus, Pencil, Trash2, X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useAuth } from '../context/AuthContext';
import { addEngineer, getEngineersBySite } from '../../appwrite/services/engineer.service.js';

export default function EngineeringStaff() {
  const { selectedSite } = useSite();
  const { user } = useAuth();
  
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    monthlySalary: 75000,
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchEngineers();
  }, [selectedSite]);

  const fetchEngineers = async () => {
    if (!selectedSite) {
      setEngineers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getEngineersBySite(selectedSite.$id);
      setEngineers(res.documents || []);
    } catch (err) {
      console.error("Failed to fetch engineers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSite) {
      alert("Please select a site first.");
      return;
    }
    
    setAdding(true);
    try {
      const newEngineer = {
        name: formData.name,
        role: formData.role || null,
        monthlySalary: Number(formData.monthlySalary),
        siteId: selectedSite.$id,
        manager: user?.name || "Admin",
      };

      await addEngineer(newEngineer);
      
      setFormData({ name: "", role: "", monthlySalary: 75000 });
      setShowModal(false);
      await fetchEngineers();
    } catch (err) {
      console.error("Error adding engineer:", err);
      alert("Failed to add engineer. Check that you have 'Create' permission set for Engineers in the Appwrite Console.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex-1 ml-64 bg-slate-50 min-h-screen p-8">
      <div className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden relative">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Engineering Staff</h3>
              <p className="text-gray-400 text-sm mt-1">Monthly professional contractors and permanent leads.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                {selectedSite ? (selectedSite.siteName || selectedSite.name || 'Unnamed Site') : 'No Site Selected'}
              </div>
              {selectedSite && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-black transition-all"
                >
                  <UserPlus size={18} /> Add New Engineer
                </button>
              )}
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              <tr>
                <th className="px-4 py-4">Engineer</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Monthly Salary</th>
                <th className="px-4 py-4">Manager</th>
                <th className="px-4 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Loading engineers...</td></tr>
              ) : engineers.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No engineers found for this site.</td></tr>
              ) : (
                engineers.map((eng) => (
                  <tr key={eng.$id} className="group hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800 font-bold text-sm">
                        {eng.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{eng.name}</p>
                        <p className="text-[10px] text-gray-400 font-medium tracking-wider">{eng.$id.substring(0, 8)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-5 text-sm font-bold text-gray-700">
                      {eng.role || 'General Engineer'}
                    </td>
                    <td className="px-4 py-5 text-sm text-zinc-800 font-bold">₹{eng.monthlySalary}</td>
                    <td className="px-4 py-5 text-sm font-bold text-gray-600">{eng.manager || 'Unassigned'}</td>
                    <td className="px-4 py-5 text-right space-x-3">
                      <button className="text-gray-400 hover:text-gray-600"><Pencil size={18} /></button>
                      <button className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Engineer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative z-10 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Add New Engineer</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  placeholder="e.g. Elena Rodriguez" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Role/Specialty</label>
                <input 
                  type="text" 
                  name="role" 
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                  placeholder="e.g. Project Lead, QA Specialist" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Monthly Salary (₹)</label>
                <input 
                  type="number" 
                  name="monthlySalary" 
                  value={formData.monthlySalary}
                  onChange={handleChange}
                  required 
                  min="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={adding}
                  className="w-full bg-zinc-900 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-zinc-800 disabled:opacity-70 transition-all"
                >
                  {adding ? 'Adding...' : 'Add Engineer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}