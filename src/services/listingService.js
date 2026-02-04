import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const listingService = {
    // Get all active listings
    getAllListings: async () => {
        try {
            const response = await api.get('/listings');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error' };
        }
    },

    // Create a new listing
    createListing: async (listingData) => {
        try {
            const response = await api.post('/listings', listingData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error' };
        }
    },

    // Get current user's listings
    getMyListings: async () => {
        try {
            const response = await api.get('/listings/my-listings');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error' };
        }
    },

    // Get specific listing
    getListingById: async (id) => {
        try {
            const response = await api.get(`/listings/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error' };
        }
    },

    // Update listing
    updateListing: async (id, listingData) => {
        try {
            const response = await api.put(`/listings/${id}`, listingData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error' };
        }
    },

    // Delete listing
    deleteListing: async (id) => {
        try {
            const response = await api.delete(`/listings/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Network error' };
        }
    }
};

export default listingService;
