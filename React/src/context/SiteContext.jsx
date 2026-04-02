import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { getSites, pingAppwrite } from "../../appwrite/services/site.service";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedSite, setSelectedSite] = useState(null);
  const [sites, setSites] = useState([]);

  // Derive role and userId from appwrite user object
  const role = user?.role || "user";
  const userId = user?.user?.$id ?? null;
  const assignedSiteId = user?.siteId ?? null;

  const fetchSites = useCallback(async () => {
    // Don't fetch until auth is loaded
    if (loading || !isAuthenticated || !userId) return;

    try {
      await pingAppwrite();
      const response = await getSites(userId, role, assignedSiteId);
      setSites(response.documents || []);
      if (response.documents?.length > 0 && !selectedSite) {
        setSelectedSite(response.documents[0]);
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  }, [loading, userId, role, assignedSiteId]);

  useEffect(() => {
    fetchSites();
  }, [fetchSites]);

  return (
    <SiteContext.Provider value={{ selectedSite, setSelectedSite, sites, setSites, fetchSites, role, userId }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = () => useContext(SiteContext);