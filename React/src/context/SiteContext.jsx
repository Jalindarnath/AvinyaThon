import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/clerk-react";
import { getSites, pingAppwrite } from "../../appwrite/services/site.service";

const ADMIN_EMAIL = "admin@samarthdevelopers.com";

const SiteContext = createContext();

export const SiteProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [selectedSite, setSelectedSite] = useState(null);
  const [sites, setSites] = useState([]);

  // Derive role from the logged-in Clerk user
  const role = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL ? "ADMIN" : "MANAGER";
  const userId = user?.id ?? null;

  const fetchSites = useCallback(async () => {
    // Don't fetch until Clerk has resolved the user session
    if (!isLoaded || !userId) return;

    try {
      await pingAppwrite();
      const response = await getSites(userId, role);
      setSites(response.documents || []);
      if (response.documents?.length > 0 && !selectedSite) {
        setSelectedSite(response.documents[0]);
      }
    } catch (error) {
      console.error("Error fetching sites:", error);
    }
  }, [isLoaded, userId, role]);

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