import { Client, Users, ID } from 'node-appwrite';

// Initialize the Server SDK
const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
    .setKey(import.meta.env.VITE_APPWRITE_KEY); // Scope: users.write

const users = new Users(client);

export const managerCreationService = {
    /**
     * @param {string} email - Manager's email
     * @param {string} password - Temporary password
     * @param {string} name - Manager's full name
     * @param {string} siteId - The ID of the construction site (e.g. 'nashik_01')
     */
    async createManager(email, password, name, siteId) {
        try {
            // 1. Create the Auth Account
            const newManager = await users.create(
                ID.unique(), 
                email, 
                undefined, 
                password, 
                name
            );

            // 2. Assign the 'manager' label for security permissions
            // Note: users.updateLabels might return error if not enabled, wrap in try-catch if needed
            await users.updateLabels(newManager.$id, ['manager']);

            // 3. Set the 'Preferences' so the login knows their site
            await users.updatePrefs(newManager.$id, {
                role: 'manager',
                siteId: siteId
            });

            return { success: true, userId: newManager.$id };
        } catch (error) {
            console.error("Manager Creation Error:", error.message);
            return { success: false, error: error.message };
        }
    }
};