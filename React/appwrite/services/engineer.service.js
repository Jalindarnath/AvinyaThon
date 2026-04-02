import { databases, ID, Query } from "../config/appwriteConfig";
import { DATABASE_ID, COLLECTIONS } from "../config/appwriteConfig";

//  Add Engineer
export const addEngineer = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ENGINEERS,
    ID.unique(),
    data
  );
};

//  Get Engineers by Site
export const getEngineersBySite = async (siteId) => {
  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ENGINEERS,
    siteId ? [Query.equal("siteId", siteId)] : []
  );
};