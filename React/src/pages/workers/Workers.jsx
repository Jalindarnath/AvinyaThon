import { useState, useEffect } from "react";
import { UserPlus, Pencil, Trash2, Users, HardHat, X } from 'lucide-react';
import { addWorker, getWorkersBySite } from "../../../appwrite/services/worker.service.js";
import { useSite } from "../../context/SiteContext";
import { useAuth } from "../../context/AuthContext";

const Workers = () => {
  const { selectedSite } = useSite();
  const { user } = useAuth();

  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    dailyWage: 700,
  });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchWorkers();
  }, [selectedSite]);

  const fetchWorkers = async () => {
    if (!selectedSite) {
      setWorkers([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getWorkersBySite(selectedSite.$id);
      setWorkers(res.documents || []);
    } catch (err) {
      console.error("Failed to fetch workers:", err);
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
      const newWorker = {
        name: formData.name,
        role: formData.role,
        dailyWage: Number(formData.dailyWage),
        siteId: selectedSite.$id,
        manager: user?.name || "Admin",
      };

      await addWorker(newWorker);
      
      // Reset form and close
      setFormData({ name: "", role: "", dailyWage: 700 });
      setShowModal(false);
      
      // Refresh list
      await fetchWorkers();
    } catch (err) {
      console.error("Error adding worker:", err);
      alert("Failed to add worker. Please ensure all required fields are met.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="flex-1 ml-64 bg-slate-50 min-h-screen p-8">
      <div className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden relative">
        {/* Header & Tabs */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-8">
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button className="flex items-center gap-2 px-6 py-2 bg-white rounded-lg shadow-sm text-sm font-bold text-orange-800">
                <Users size={16} /> Laborers
              </button>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                {selectedSite ? (selectedSite.siteName || selectedSite.name || 'Unnamed Site') : 'No Site Selected'}
              </div>
              {selectedSite && (
                <button 
                  onClick={() => setShowModal(true)}
                  className="bg-orange-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-orange-100 hover:bg-orange-900 transition-all"
                >
                  <UserPlus size={18} /> Add New Laborer
                </button>
              )}
            </div>
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
                  <th className="px-4 py-4">Manager</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Loading workers...</td></tr>
                ) : workers.length === 0 ? (
                  <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No workers found for this site.</td></tr>
                ) : (
                  workers.map((person) => (
                    <tr key={person.$id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-bold text-xs">
                          {person.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">{person.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium tracking-wider">{person.$id.substring(0, 8)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-gray-700 uppercase tracking-tighter">{person.role}</td>
                      <td className="px-4 py-5 text-sm text-green-600 font-bold">₹{person.dailyWage}</td>
                      <td className="px-4 py-5 text-sm font-bold text-gray-600">{person.manager || 'Unassigned'}</td>
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
      </div>

      {/* Add Worker Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden relative z-10 shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-800">Add New Laborer</h3>
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
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Ramesh Kumar" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Role/Trade</label>
                <input 
                  type="text" 
                  name="role" 
                  value={formData.role}
                  onChange={handleChange}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="e.g. Mason, Helper, Painter" 
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Daily Wage (₹)</label>
                <input 
                  type="number" 
                  name="dailyWage" 
                  value={formData.dailyWage}
                  onChange={handleChange}
                  required 
                  min="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={adding}
                  className="w-full bg-orange-800 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:bg-orange-700 disabled:opacity-70 transition-all"
                >
                  {adding ? 'Adding...' : 'Add Laborer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workers;