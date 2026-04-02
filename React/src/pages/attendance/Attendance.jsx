import { useState, useEffect } from "react";
import { CalendarCheck, Users, HardHat, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useSite } from "../../context/SiteContext";
import { useAuth } from "../../context/AuthContext";
import { getWorkersBySite } from "../../../appwrite/services/worker.service.js";
import { getEngineersBySite } from "../../../appwrite/services/engineer.service.js";
import { addAttendance, updateAttendance, getAttendanceBySiteAndDate } from "../../../appwrite/services/attendance.service.js";

const Attendance = () => {
  const { selectedSite } = useSite();
  const { user } = useAuth();
  
  const [personnel, setPersonnel] = useState([]);
  const [dbRecords, setDbRecords] = useState({}); // mapped by personId for finalized records
  const [localStatuses, setLocalStatuses] = useState({}); // local state before submit
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  
  // Get today's local date string YYYY-MM-DD
  const todayObj = new Date();
  const today = `${todayObj.getFullYear()}-${String(todayObj.getMonth() + 1).padStart(2, '0')}-${String(todayObj.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    fetchData();
  }, [selectedSite]);

  const fetchData = async () => {
    if (!selectedSite) {
      setPersonnel([]);
      setDbRecords({});
      setLocalStatuses({});
      setLoading(false);
      setIsLocked(false);
      return;
    }

    setLoading(true);
    try {
      // 1. Fetch today's context
      const attendanceRes = await getAttendanceBySiteAndDate(selectedSite.$id, today);
      const recordsMap = {};
      const hasRecords = attendanceRes.documents.length > 0;
      
      attendanceRes.documents.forEach(record => {
        recordsMap[record.personId] = record;
      });
      setDbRecords(recordsMap);
      setIsLocked(hasRecords);

      // 2. Fetch Workers and Engineers
      const [workersRes, engineersRes] = await Promise.all([
        getWorkersBySite(selectedSite.$id),
        getEngineersBySite(selectedSite.$id)
      ]);

      const workers = (workersRes.documents || []).map(w => ({ ...w, _type: 'labour' }));
      const engineers = (engineersRes.documents || []).map(e => ({ ...e, _type: 'engineer' }));
      
      let combined = [...engineers, ...workers];
      
      // Initialize local statuses for everyone to be "absent" by default to prevent missing blanks
      const initialLocal = {};
      combined.forEach(p => {
        initialLocal[p.$id] = "absent";
      });
      setLocalStatuses(initialLocal);
      
      setPersonnel(combined);
    } catch (err) {
      console.error("Failed to fetch attendance data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (personId, newStatus) => {
    if (isLocked) return;
    setLocalStatuses(prev => ({
      ...prev,
      [personId]: newStatus
    }));
  };

  const handleSubmitAttendance = async () => {
    if (!selectedSite || !user || isLocked) return;
    
    if (!window.confirm("Submit today's attendance? You cannot edit records once submitted.")) return;

    setSubmitting(true);
    try {
      // Batch create all records
      const promises = personnel.map(person => {
        const markedStatus = localStatuses[person.$id] || "absent";
        return addAttendance({
          type: person._type,
          status: markedStatus,
          manager: user?.name || "Admin",
          date: new Date().toISOString(),
          siteId: selectedSite.$id,
          personId: person.$id
        });
      });

      await Promise.all(promises);
      
      alert("Attendance saved successfully!");
      fetchData(); // Refreshes and locks the view
    } catch (error) {
      console.error("Error saving batch attendance:", error);
      alert("Failed to save attendance. Check permissions in Appwrite Console.");
    } finally {
      setSubmitting(false);
    }
  };

  const StatusButton = ({ personId, status, currentStatus, icon: Icon, activeColorClass, defaultColorClass }) => {
    const isActive = currentStatus === status;
    
    return (
      <button 
        disabled={isLocked || submitting}
        onClick={() => handleStatusChange(personId, status)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border capitalize ${
          isActive 
            ? activeColorClass 
            : `${defaultColorClass} opacity-70 ${!isLocked && 'hover:opacity-100'}`
        } ${isLocked || submitting ? 'cursor-not-allowed grayscale-[0.5]' : ''}`}
      >
        <Icon size={14} /> {status}
      </button>
    );
  };

  return (
    <div className="flex-1 ml-64 bg-slate-50 min-h-screen p-8">
      <div className="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden relative">
        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <CalendarCheck className="text-orange-800" /> Daily Attendance Tracker
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                Mark present/absent states for all site personnel for <strong>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isLocked ? (
                <div className="flex items-center gap-2 bg-zinc-100 text-zinc-600 px-4 py-2 rounded-xl border border-zinc-200 text-sm font-bold">
                  <CheckCircle2 size={16} className="text-zinc-500" /> Attendance Finalized
                </div>
              ) : (
                personnel.length > 0 && (
                  <button 
                    onClick={handleSubmitAttendance}
                    disabled={submitting}
                    className="bg-orange-800 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold shadow-lg shadow-orange-100 hover:bg-orange-900 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Saving...' : 'Submit Attendance'}
                  </button>
                )
              )}
              <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                {selectedSite ? (selectedSite.siteName || selectedSite.name || 'Unnamed Site') : 'No Site Selected'}
              </div>
            </div>
          </div>

          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              <tr>
                <th className="px-4 py-4">Personnel</th>
                <th className="px-4 py-4">Type</th>
                <th className="px-4 py-4">Role</th>
                <th className="px-4 py-4">Current Status</th>
                <th className="px-4 py-4 text-right">Mark Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Loading personnel and records...</td></tr>
              ) : personnel.length === 0 ? (
                <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">No personnel found for this site. Ensure workers and engineers exist.</td></tr>
              ) : (
                personnel.map((person) => {
                  const currentStatus = isLocked 
                      ? dbRecords[person.$id]?.status || "unmarked" 
                      : localStatuses[person.$id] || "absent";
                  
                  return (
                    <tr key={person.$id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-5 flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                          person._type === 'engineer' ? 'bg-zinc-100 text-zinc-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {person.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">{person.name}</p>
                          <p className="text-[10px] text-gray-400 font-medium tracking-wider">{person.$id.substring(0, 8)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-max capitalize ${
                          person._type === 'engineer' ? 'bg-zinc-800 text-white' : 'bg-orange-50 text-orange-800 border border-orange-100'
                        }`}>
                          {person._type === 'engineer' ? <HardHat size={12}/> : <Users size={12}/>}
                          {person._type}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-gray-700 uppercase tracking-tighter">
                        {person.role || 'General'}
                      </td>
                      <td className="px-4 py-5">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md capitalize ${
                          currentStatus === 'present' ? 'text-green-700 bg-green-50' :
                          currentStatus === 'absent' ? 'text-red-700 bg-red-50' : 
                          'text-gray-400 bg-gray-100'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <StatusButton 
                            personId={person.$id} 
                            status="present" 
                            currentStatus={currentStatus} 
                            icon={CheckCircle2} 
                            activeColorClass="bg-green-50 border-green-200 text-green-700" 
                            defaultColorClass="bg-white border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600"
                          />
                          <StatusButton 
                            personId={person.$id} 
                            status="absent" 
                            currentStatus={currentStatus} 
                            icon={XCircle} 
                            activeColorClass="bg-red-50 border-red-200 text-red-700" 
                            defaultColorClass="bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
