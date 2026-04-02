import { Client, Account, ID } from 'appwrite';

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) 
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);

export const loginService = {
    // Standard login function
    async login(email, password) {
        try {
            // Create session
            await account.createEmailPasswordSession(email, password);
            
            // Fetch the user's "backpack" (Preferences and Labels)
            const user = await account.get();
            
            return {
                success: true,
                role: user.labels?.includes('admin') ? 'admin' : (user.prefs?.role || 'user'),
                siteId: user.prefs?.siteId || null,
                name: user.name,
                user: user
            };
        } catch (error) {
            console.error("Login failed", error);
            throw new Error(error.message);
        }
    },

    async getCurrentUser() {
        try {
            const user = await account.get();
            return {
                success: true,
                role: user.labels?.includes('admin') ? 'admin' : (user.prefs?.role || 'user'),
                siteId: user.prefs?.siteId || null,
                name: user.name,
                user: user
            };
        } catch (error) {
            return null;
        }
    },

    async logout() {
        try {
            await account.deleteSession('current');
        } catch (error) {
            console.error("Logout failed", error);
        }
    }
};