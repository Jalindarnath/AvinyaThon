import React, { useState, useEffect } from 'react';
import { managerCreationService } from '../../../appwrite/services/createManager.service.js';
import { getSites, updateSite } from '../../../appwrite/services/site.service.js';
import { useAuth } from '../../context/AuthContext';

const CreateManager = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [siteId, setSiteId] = useState('');
  
  const [availableSites, setAvailableSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSites, setLoadingSites] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchAvailableSites();
  }, [user]);

  const fetchAvailableSites = async () => {
    if (!user || user.role !== 'admin') {
      setLoadingSites(false);
      return;
    }
    try {
      setLoadingSites(true);
      setError('');
      
      const response = await getSites(user.user?.$id, 'admin');
      
      // Filter out sites that don't have a manager assigned
      const unassignedSites = (response?.documents || []).filter(site => {
        // Site is unassigned if manager is null, undefined, or empty string
        return !site.manager || site.manager.trim() === '';
      });
      
      setAvailableSites(unassignedSites);
      
      if (unassignedSites.length > 0) {
        setSiteId(unassignedSites[0].$id);
      }
    } catch (err) {
      console.error("Failed to fetch available sites:", err);
      setError("Failed to load available sites: " + err.message);
    } finally {
      setLoadingSites(false);
    }
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // Ideally, only Admin should be able to create managers.
    if (user?.role !== 'admin') {
      setError('You are not authorized to create managers.');
      setLoading(false);
      return;
    }

    if (!siteId) {
      setError('Please select a site to assign.');
      setLoading(false);
      return;
    }

    try {
      // Find the site name to include in manager prefs if needed (though service just wants siteId)
      const result = await managerCreationService.createManager(email, password, name, siteId);
      
      if (result.success) {
        // Update the site with the newly created manager's info
        // We use the 'manager' field since 'managerId' doesn't exist in the schema
        await updateSite(siteId, {
          manager: name
        });
        
        setMessage(`Manager ${name} created successfully and assigned to the selected site`);
        setName('');
        setEmail('');
        setPassword('');
        
        // Refresh the sites dropdown so the assigned site gets removed
        await fetchAvailableSites();
      } else {
        setError(result.error || 'Failed to create manager.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto mt-10 bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-slate-800">Create New Manager</h2>
        <p className="text-slate-500 mt-2">Assign an admin or site manager with a dedicated site workspace.</p>
      </div>

      {message && (
        <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-3 border border-emerald-100">
          <span className="material-symbols-outlined">check_circle</span>
          <p className="font-medium">{message}</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100">
          <span className="material-symbols-outlined">error</span>
          <p className="font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleCreateManager} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. John Doe"
              className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f2711c] focus:border-[#f2711c] rounded-lg p-3 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Email Address (ID)</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="manager@example.com"
              className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f2711c] focus:border-[#f2711c] rounded-lg p-3 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Min. 8 characters"
            minLength="8"
            className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f2711c] focus:border-[#f2711c] rounded-lg p-3 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Assign Site</label>
          {loadingSites ? (
            <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-500">
              Loading available sites...
            </div>
          ) : availableSites.length > 0 ? (
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f2711c] focus:border-[#f2711c] rounded-lg p-3 transition-all"
            >
              {availableSites.map((site) => (
                <option key={site.$id} value={site.$id}>
                  {site.siteName} ({site.siteId})
                </option>
              ))}
            </select>
          ) : (
            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-500">
              No unassigned sites available. Please create a new site first.
            </div>
          )}
          <p className="text-xs text-slate-500 mt-1">This binds the manager to their specific project data.</p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button 
            type="submit"
            disabled={loading || availableSites.length === 0}
            className={`w-full bg-[#f2711c] hover:bg-[#d96215] text-white font-bold py-3.5 px-6 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 ${(loading || availableSites.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                <span>Creating Manager...</span>
              </>
            ) : (
              <>
                <span>Create Manager Profile</span>
                <span className="material-symbols-outlined text-[20px]">person_add</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateManager;
