import { databases, ID, Query } from "../config/appwriteConfig";
import { DATABASE_ID, COLLECTIONS } from "../config/appwriteConfig";

/* =======================================================
   ➕ CREATE FINANCE RECORD (when site is created)
======================================================= */
export const createFinance = async (data) => {
  try {
    return await databases.createDocument(
      DATABASE_ID,
      COLLECTIONS.SITE_FINANCE,
      ID.unique(),
      data
    );
  } catch (error) {
    console.error("Create Finance Error:", error);
  }
};

/* =======================================================
   📥 GET FINANCE BY SITE
======================================================= */
export const getFinanceBySite = async (siteId) => {
  try {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COLLECTIONS.SITE_FINANCE,
      [Query.equal("siteId", siteId)]
    );

    return res.documents[0]; // one record per site
  } catch (error) {
    console.error("Get Finance Error:", error);
  }
};

/* =======================================================
   🔄 UPDATE FINANCE (generic)
======================================================= */
export const updateFinance = async (docId, updatedData) => {
  try {
    return await databases.updateDocument(
      DATABASE_ID,
      COLLECTIONS.SITE_FINANCE,
      docId,
      updatedData
    );
  } catch (error) {
    console.error("Update Finance Error:", error);
  }
};

// UPDATE MATERIAL
export const updateMaterialExpense = async (siteId, amount) => {
  try {
    const finance = await getFinanceBySite(siteId);

    const updated = {
      materialCost: finance.materialCost + amount,
      totalExpense: finance.totalExpense + amount,
      remainingBudget:
        finance.totalBudget - (finance.totalExpense + amount),
    };

    return await updateFinance(finance.$id, updated);
  } catch (error) {
    console.error("Material Expense Error:", error);
  }
};

//LABOUR PAYMENT UPDATE ON CASHOUT
export const updateLaborCost = async (siteId, amount) => {
  try {
    const finance = await getFinanceBySite(siteId);

    const updated = {
      laborCost: finance.laborCost + amount,
      totalExpense: finance.totalExpense + amount,
      remainingBudget:
        finance.totalBudget - (finance.totalExpense + amount),
    };

    return await updateFinance(finance.$id, updated);
  } catch (error) {
    console.error("Labor Cost Error:", error);
  }
};

// ENGINEER PAYMENT UPDATE
export const updateEngineerCost = async (siteId, amount) => {
  try {
    const finance = await getFinanceBySite(siteId);

    const updated = {
      engineerCost: finance.engineerCost + amount,
      totalExpense: finance.totalExpense + amount,
      remainingBudget:
        finance.totalBudget - (finance.totalExpense + amount),
    };

    return await updateFinance(finance.$id, updated);
  } catch (error) {
    console.error("Engineer Cost Error:", error);
  }
};
export const checkBudgetAlert = (finance) => {
  const threshold = finance.totalBudget * 0.2;

  if (finance.remainingBudget < threshold) {
    return "⚠️ Low Budget Warning";
  }

  return "Budget OK";
};