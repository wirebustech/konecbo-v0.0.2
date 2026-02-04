import axios from 'axios';

const API_URL = '/api/friends';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

const friendService = {
    // Send friend request
    sendRequest: async (userId) => {
        try {
            const response = await api.post(`/request/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to send friend request' };
        }
    },

    // Accept friend request
    acceptRequest: async (requestId) => {
        try {
            const response = await api.post(`/accept/${requestId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to accept friend request' };
        }
    },

    // Get all friends
    getFriends: async () => {
        try {
            const response = await api.get('/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch friends' };
        }
    },

    // Get pending requests
    getRequests: async () => {
        try {
            const response = await api.get('/requests');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch friend requests' };
        }
    },

    // Check status with a user
    checkStatus: async (userId) => {
        try {
            const response = await api.get(`/status/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to check friend status' };
        }
    }
};

export default friendService;
