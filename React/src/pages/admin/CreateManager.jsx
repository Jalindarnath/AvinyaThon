import React, { useState, useEffect } from 'react';
import { managerCreationService } from '../../../appwrite/services/createManager.service.js';
import { getSites, updateSite } from '../../../appwrite/services/site.service.js';
import {
  getManagers,
  createManagerRecord,
  updateManagerRecord,
} from '../../../appwrite/services/manager.service.js';
import { useAuth } from '../../context/AuthContext';
import {
  Loader2,
  UserPlus,
  CheckCircle,
  AlertCircle,
  Edit2,
  X,
  RefreshCw,
  UserCheck,
  UserX,
  ArrowRightLeft,
} from 'lucide-react';

/* ─────────────────────────────────────────── helpers ─────────────────────────── */
const Badge = ({ children, color = 'orange' }) => {
  const colors = {
    orange: 'bg-[#f2711c]/10 text-[#f2711c] border-[#f2711c]/20',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    slate: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[color]}`}
    >
      {children}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════════════════════ */
const CreateManager = () => {
  /* ── form state ── */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [siteId, setSiteId] = useState('');
  const [assignSiteNow, setAssignSiteNow] = useState(true); // toggle: assign site immediately

  /* ── data state ── */
  const [allSites, setAllSites] = useState([]);
  const [allSiteMap, setAllSiteMap] = useState({});
  const [managers, setManagers] = useState([]);

  /* ── loading / feedback ── */
  const [loading, setLoading] = useState(false);
  const [loadingSites, setLoadingSites] = useState(true);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /* ── edit-manager modal ── */
  const [editingManager, setEditingManager] = useState(null); // manager record being edited
  const [editSiteId, setEditSiteId] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  /* ── active tab ── */
  const [activeTab, setActiveTab] = useState('assigned'); // 'assigned' | 'available'

  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [user]);

  /* ─────────────────────── data loaders ─────────────────────── */
  const fetchData = async () => {
    await Promise.all([fetchAllSites(), fetchAllManagers()]);
  };

  const fetchAllSites = async () => {
    if (!user || user.role !== 'admin') {
      setLoadingSites(false);
      return;
    }
    try {
      setLoadingSites(true);
      const response = await getSites(user.user?.$id, 'admin');
      const sites = response?.documents || [];

      const map = {};
      sites.forEach((s) => (map[s.$id] = s.siteName));
      setAllSiteMap(map);
      setAllSites(sites);

      // Pre-select first unassigned site for the create form
      const unassigned = sites.filter((s) => !s.manager || s.manager.trim() === '');
      if (unassigned.length > 0) setSiteId(unassigned[0].$id);
      else setSiteId('');
    } catch (err) {
      setError('Failed to load sites: ' + err.message);
    } finally {
      setLoadingSites(false);
    }
  };

  const fetchAllManagers = async () => {
    try {
      setLoadingManagers(true);

      // 1. Fetch from the Managers *collection* — gives us the correct Appwrite doc $id
      //    needed for updateManagerRecord.
      const collectionRes = await getManagers();
      const collectionDocs = collectionRes?.documents || [];

      // 2. Fetch from Auth — gives us the Auth user $id needed for updateManagerPrefs.
      const authRes = await managerCreationService.getAllManagers();
      const authByEmail = {};
      if (authRes.success) {
        authRes.documents.forEach((m) => {
          authByEmail[m.email.toLowerCase()] = m.$id; // Auth userId keyed by email
        });
      }

      // 3. Merge: attach authUserId to each collection document.
      const merged = collectionDocs.map((doc) => ({
        ...doc,
        authUserId: authByEmail[doc.email?.toLowerCase()] || null,
      }));

      setManagers(merged);
    } catch (err) {
      console.error('Failed to fetch managers:', err);
    } finally {
      setLoadingManagers(false);
    }
  };

  /* ─────────────────────── derived lists ─────────────────────── */
  const unassignedSites = allSites.filter(
    (s) => !s.manager || s.manager.trim() === ''
  );

  const assignedManagers = managers.filter((m) => m.siteId && m.siteId !== '');
  const availableManagers = managers.filter((m) => !m.siteId || m.siteId === '');

  /* ─────────────────────── create manager ─────────────────────── */
  const handleCreateManager = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (user?.role !== 'admin') {
      setError('You are not authorized to create managers.');
      setLoading(false);
      return;
    }

    const targetSiteId = assignSiteNow ? siteId : '';

    if (assignSiteNow && !targetSiteId) {
      setError('Please select a site to assign, or turn off "Assign site now".');
      setLoading(false);
      return;
    }

    try {
      const result = await managerCreationService.createManager(
        email,
        password,
        name,
        targetSiteId
      );

      if (result.success) {
        // If assigning a site, update the site record
        if (assignSiteNow && targetSiteId) {
          await updateSite(targetSiteId, { manager: name });
        }

        // Save to Managers collection (siteId can be '' if unassigned)
        await createManagerRecord(email, name, targetSiteId);

        setMessage(
          assignSiteNow
            ? `Manager "${name}" created and assigned to site successfully.`
            : `Manager "${name}" created and added to the available pool.`
        );
        setName('');
        setEmail('');
        setPassword('');

        await fetchData();
      } else {
        setError(result.error || 'Failed to create manager.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────── open edit modal ─────────────────────── */
  const openEditModal = (manager) => {
    setEditingManager(manager);
    setEditSiteId(manager.siteId || '');
    setMessage('');
    setError('');
  };

  const closeEditModal = () => {
    setEditingManager(null);
    setEditSiteId('');
  };

  /* ─────────────────────── save edit (change site) ─────────────── */
  const handleSaveEdit = async () => {
    if (!editingManager) return;
    setEditLoading(true);

    try {
      const prevSiteId = editingManager.siteId;
      const newSiteId = editSiteId;

      // 1. Clear manager from old site (if any)
      if (prevSiteId && prevSiteId !== newSiteId) {
        await updateSite(prevSiteId, { manager: '' });
      }

      // 2. Assign manager to new site (if any)
      if (newSiteId) {
        await updateSite(newSiteId, { manager: editingManager.manager });
      }

      // 3. Update Managers *collection* document using the collection doc $id
      await updateManagerRecord(editingManager.$id, newSiteId);

      // 4. Update Auth prefs using the Auth user ID (authUserId)
      if (editingManager.authUserId) {
        await managerCreationService.updateManagerPrefs(editingManager.authUserId, newSiteId);
      }

      setMessage(
        newSiteId
          ? `"${editingManager.manager}" reassigned to "${allSiteMap[newSiteId] || newSiteId}".`
          : `"${editingManager.manager}" moved to available pool.`
      );
      closeEditModal();
      await fetchData();
    } catch (err) {
      setError('Update failed: ' + err.message);
    } finally {
      setEditLoading(false);
    }
  };

  /* ─────────────────────── quick-assign available manager ─────── */
  const handleQuickAssign = async (manager, newSiteId) => {
    if (!newSiteId) return;
    setLoadingManagers(true);
    try {
      // Update site record
      await updateSite(newSiteId, { manager: manager.manager });

      // Update Managers collection doc ($id = collection document ID)
      await updateManagerRecord(manager.$id, newSiteId);

      // Update Auth prefs (authUserId = Appwrite Auth user ID)
      if (manager.authUserId) {
        await managerCreationService.updateManagerPrefs(manager.authUserId, newSiteId);
      }

      setMessage(
        `"${manager.manager}" assigned to "${allSiteMap[newSiteId] || newSiteId}".`
      );
      await fetchData();
    } catch (err) {
      setError('Quick assign failed: ' + err.message);
    } finally {
      setLoadingManagers(false);
    }
  };

  /* ─────────────────────── remove manager from site ───────────── */
  const handleRemoveFromSite = async (manager) => {
    if (!window.confirm(`Remove "${manager.manager}" from their site and move to available pool?`))
      return;

    setLoadingManagers(true);
    try {
      // 1. Clear manager field on the Site document
      if (manager.siteId) {
        await updateSite(manager.siteId, { manager: '' });
      }

      // 2. Clear siteId in the Managers *collection* doc (manager.$id = collection doc ID)
      await updateManagerRecord(manager.$id, '');

      // 3. Clear Auth prefs (manager.authUserId = Appwrite Auth user ID)
      if (manager.authUserId) {
        await managerCreationService.updateManagerPrefs(manager.authUserId, '');
      }

      setMessage(`"${manager.manager}" removed from site and moved to available pool.`);
      await fetchData();
    } catch (err) {
      setError('Remove failed: ' + err.message);
    } finally {
      setLoadingManagers(false);
    }
  };

  /* ═══════════════════════════════ JSX ═══════════════════════════ */
  return (
    <div className="p-6 max-w-4xl mx-auto mt-8 space-y-8">

      {/* ── Header ── */}
      <div>
        <h2 className="text-3xl font-bold text-slate-800">Manager Management</h2>
        <p className="text-slate-500 mt-1">
          Create, assign, reassign, or free up site managers from one place.
        </p>
      </div>

      {/* ── Alerts ── */}
      {message && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-center gap-3 border border-emerald-100">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{message}</p>
          <button onClick={() => setMessage('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="font-medium">{error}</p>
          <button onClick={() => setError('')} className="ml-auto">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ══════════════ CREATE MANAGER FORM ══════════════ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#f2711c]" />
          Create New Manager
        </h3>

        <form onSubmit={handleCreateManager} className="space-y-5">
          {/* Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. John Doe"
                className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f2711c] focus:border-[#f2711c] rounded-lg p-3 transition-all outline-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="manager@example.com"
                className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f2711c] focus:border-[#f2711c] rounded-lg p-3 transition-all outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Min. 8 characters"
              minLength="8"
              className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f2711c] focus:border-[#f2711c] rounded-lg p-3 transition-all outline-none"
            />
          </div>

          {/* Assign Site Toggle */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={assignSiteNow}
                onChange={(e) => setAssignSiteNow(e.target.checked)}
              />
              <div className="w-10 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-[#f2711c] rounded-full peer peer-checked:bg-[#f2711c] transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4"></div>
            </label>
            <span className="text-sm font-semibold text-slate-700">
              {assignSiteNow ? 'Assign site now' : 'Add to available pool (no site yet)'}
            </span>
          </div>

          {/* Site Selector */}
          {assignSiteNow && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Assign Site</label>
              {loadingSites ? (
                <div className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-500 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Loading sites…
                </div>
              ) : unassignedSites.length > 0 ? (
                <select
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                  required={assignSiteNow}
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f2711c] focus:border-[#f2711c] rounded-lg p-3 transition-all outline-none"
                >
                  {unassignedSites.map((site) => (
                    <option key={site.$id} value={site.$id}>
                      {site.siteName} ({site.siteId})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="w-full bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  No unassigned sites available. Toggle off to add manager to available pool.
                </div>
              )}
              <p className="text-xs text-slate-400">Only unassigned sites are listed here.</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || (assignSiteNow && unassignedSites.length === 0)}
            className={`w-full bg-[#f2711c] hover:bg-[#d96215] text-white font-bold py-3.5 px-6 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 ${
              loading || (assignSiteNow && unassignedSites.length === 0)
                ? 'opacity-60 cursor-not-allowed'
                : ''
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Manager…</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>{assignSiteNow ? 'Create & Assign Manager' : 'Create Manager (Add to Pool)'}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* ══════════════ MANAGERS LIST ══════════════ */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Tab Bar */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('assigned')}
            className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'assigned'
                ? 'border-b-2 border-[#f2711c] text-[#f2711c] bg-[#f2711c]/5'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Assigned Managers
            <Badge color="orange">{assignedManagers.length}</Badge>
          </button>
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-3.5 text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'available'
                ? 'border-b-2 border-[#f2711c] text-[#f2711c] bg-[#f2711c]/5'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            <UserX className="w-4 h-4" />
            Available Pool
            <Badge color="slate">{availableManagers.length}</Badge>
          </button>
          <button
            onClick={fetchData}
            title="Refresh"
            className="px-4 text-slate-400 hover:text-[#f2711c] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content */}
        {loadingManagers ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#f2711c]" />
          </div>
        ) : activeTab === 'assigned' ? (
          /* ── ASSIGNED MANAGERS ── */
          assignedManagers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Manager</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Site</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedManagers.map((manager) => (
                    <tr key={manager.$id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 text-slate-800 font-semibold">{manager.manager}</td>
                      <td className="p-4 text-slate-500 text-sm">{manager.email}</td>
                      <td className="p-4">
                        <Badge color="orange">
                          {allSiteMap[manager.siteId] || manager.siteId}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(manager)}
                            title="Change site"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-[#f2711c]/10 hover:text-[#f2711c] rounded-lg transition-all"
                          >
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                            Change Site
                          </button>
                          <button
                            onClick={() => handleRemoveFromSite(manager)}
                            title="Move to available pool"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-all"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-14 px-6">
              <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No managers assigned to sites yet.</p>
              <p className="text-slate-400 text-sm mt-1">Create a manager above or assign one from the available pool.</p>
            </div>
          )
        ) : (
          /* ── AVAILABLE POOL ── */
          availableManagers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Manager</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Quick Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {availableManagers.map((manager) => (
                    <tr key={manager.$id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="p-4 text-slate-800 font-semibold">{manager.manager}</td>
                      <td className="p-4 text-slate-500 text-sm">{manager.email}</td>
                      <td className="p-4">
                        <Badge color="slate">Available</Badge>
                      </td>
                      <td className="p-4 text-right">
                        {unassignedSites.length > 0 ? (
                          <div className="flex items-center justify-end gap-2">
                            <select
                              defaultValue=""
                              onChange={(e) => {
                                if (e.target.value) handleQuickAssign(manager, e.target.value);
                              }}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50 focus:ring-1 focus:ring-[#f2711c] outline-none"
                            >
                              <option value="" disabled>Select site…</option>
                              {unassignedSites.map((site) => (
                                <option key={site.$id} value={site.$id}>
                                  {site.siteName}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No free sites</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-14 px-6">
              <UserX className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">Available pool is empty.</p>
              <p className="text-slate-400 text-sm mt-1">
                Create a manager without assigning a site, or remove a manager from their site.
              </p>
            </div>
          )
        )}
      </div>

      {/* ══════════════ EDIT / CHANGE SITE MODAL ══════════════ */}
      {editingManager && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#f2711c]" />
                <h4 className="font-bold text-slate-800">Update Manager Details</h4>
              </div>
              <button
                onClick={closeEditModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              {/* Manager info (read-only) */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-1 border border-slate-200">
                <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Manager</p>
                <p className="font-bold text-slate-800">{editingManager.manager}</p>
                <p className="text-sm text-slate-500">{editingManager.email}</p>
                <div className="pt-1">
                  <Badge color="orange">
                    Currently: {allSiteMap[editingManager.siteId] || editingManager.siteId || 'Unassigned'}
                  </Badge>
                </div>
              </div>

              {/* New site picker */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Change Site Assignment
                </label>
                <select
                  value={editSiteId}
                  onChange={(e) => setEditSiteId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-[#f2711c] focus:border-[#f2711c] rounded-lg p-3 transition-all outline-none"
                >
                  <option value="">— No site (move to available pool) —</option>
                  {/* Show all sites; already-assigned ones shown as their current manager */}
                  {allSites.map((site) => {
                    const isCurrent = site.$id === editingManager.siteId;
                    const hasOtherManager = site.manager && site.manager.trim() !== '' && !isCurrent;
                    return (
                      <option key={site.$id} value={site.$id} disabled={hasOtherManager}>
                        {site.siteName}
                        {isCurrent ? ' ✓ (current)' : ''}
                        {hasOtherManager ? ` — already has ${site.manager}` : ''}
                      </option>
                    );
                  })}
                </select>
                <p className="text-xs text-slate-400">
                  Sites already assigned to another manager are disabled.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={editLoading}
                className="px-5 py-2 text-sm font-bold text-white bg-[#f2711c] hover:bg-[#d96215] rounded-lg transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {editLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" /> Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateManager;
