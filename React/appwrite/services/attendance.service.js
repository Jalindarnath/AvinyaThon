import { databases, ID, Query } from "../config/appwriteConfig";
import { DATABASE_ID, COLLECTIONS } from "../config/appwriteConfig";

// Add Attendance Record
export const addAttendance = async (data) => {
  return databases.createDocument(
    DATABASE_ID,
    COLLECTIONS.ATTENDANCE,
    ID.unique(),
    data
  );
};

// Get Attendance for a specific site and date
export const getAttendanceBySiteAndDate = async (siteId, dateString) => {
  // dateString should be YYYY-MM-DD
  const startDate = `${dateString}T00:00:00.000Z`;
  const endDate = `${dateString}T23:59:59.999Z`;

  return databases.listDocuments(
    DATABASE_ID,
    COLLECTIONS.ATTENDANCE,
    [
      Query.equal("siteId", siteId),
      Query.greaterThanEqual("date", startDate),
      Query.lessThanEqual("date", endDate)
    ]
  );
};

// Update Attendance Record
export const updateAttendance = async (documentId, data) => {
  return databases.updateDocument(
    DATABASE_ID,
    COLLECTIONS.ATTENDANCE,
    documentId,
    data
  );
};
