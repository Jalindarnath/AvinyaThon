import { Client, Users, ID, Query } from 'node-appwrite';

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
     * @param {string} siteId - The ID of the construction site. Pass '' for unassigned.
     */
    async createManager(email, password, name, siteId = '') {
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
            await users.updateLabels(newManager.$id, ['manager']);

            // 3. Set the 'Preferences' so the login knows their site
            await users.updatePrefs(newManager.$id, {
                role: 'manager',
                siteId: siteId || ''
            });

            return { success: true, userId: newManager.$id };
        } catch (error) {
            console.error("Manager Creation Error:", error.message);
            return { success: false, error: error.message };
        }
    },

    /**
     * Update a manager's siteId preference in Appwrite Auth.
     * Pass siteId as '' to unassign the manager from their site.
     * @param {string} userId - Appwrite Auth user ID
     * @param {string} siteId - New site ID or '' to unassign
     */
    async updateManagerPrefs(userId, siteId = '') {
        try {
            // Fetch current prefs to preserve other fields
            const currentUser = await users.get(userId);
            const existingPrefs = currentUser.prefs || {};

            await users.updatePrefs(userId, {
                ...existingPrefs,
                siteId: siteId || ''
            });
            return { success: true };
        } catch (error) {
            console.error("Manager Prefs Update Error:", error.message);
            return { success: false, error: error.message };
        }
    },

    /**
     * Fetches all users from Auth collection who have 'manager' role in preferences or 'manager' label
     */
    async getAllManagers() {
        try {
            const response = await users.list([
                Query.limit(100),
                Query.orderDesc('$createdAt')
            ]);
            
            // Filter managers: those with 'manager' label OR role: 'manager' in prefs
            const authManagers = response.users.filter(user => {
                const hasLabel = user.labels && user.labels.includes('manager');
                const hasRole = user.prefs && user.prefs.role === 'manager';
                return hasLabel || hasRole;
            }).map(user => ({
                $id: user.$id,
                manager: user.name,
                email: user.email,
                siteId: (user.prefs && user.prefs.siteId) ? user.prefs.siteId : ''
            }));

            return { success: true, documents: authManagers };
        } catch (error) {
            console.error("Manager Fetching Error:", error.message);
            return { success: false, documents: [], error: error.message };
        }
    }
};