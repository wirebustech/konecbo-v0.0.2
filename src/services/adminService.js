import axios from 'axios';

const API_URL = '/api';

// Create axios instance with default config
const adminAPI = axios.create({
    baseURL: `${API_URL}/admin`,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
adminAPI.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle response errors
adminAPI.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            window.location.href = '/signin';
        }
        return Promise.reject(error.response?.data || error);
    }
);

const adminService = {
    /**
     * Get all users from SQL database
     */
    getAllUsers: async () => {
        try {
            return await adminAPI.get('/users');
        } catch (error) {
            console.error('Error fetching SQL users:', error);
            throw error;
        }
    },

    /**
     * Get dashboard statistics
     */
    getDashboardStats: async () => {
        try {
            return await adminAPI.get('/stats');
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    },

    /**
     * Update user role
     */
    updateUserRole: async (userId, role, reason) => {
        try {
            return await adminAPI.put(`/users/${userId}/role`, { role, reason });
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    },

    /**
     * Delete user
     */
    deleteUser: async (userId) => {
        try {
            return await adminAPI.delete(`/users/${userId}`);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    /**
     * Get activity logs
     */
    getActivityLogs: async (params = {}) => {
        try {
            return await adminAPI.get('/logs', { params });
        } catch (error) {
            console.error('Error fetching activity logs:', error);
            throw error;
        }
    },

    /**
     * Get System Settings
     */
    getSettings: async () => {
        return await adminAPI.get('/settings');
    },

    /**
     * Update System Setting
     */
    updateSetting: async (key, value) => {
        return await adminAPI.put('/settings', { key, value });
    },

    /**
     * Get All Reviews
     */
    getAllReviews: async () => {
        return await adminAPI.get('/reviews');
    }
};

export default adminService;
