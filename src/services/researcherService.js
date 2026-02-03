import axios from 'axios';

const API_URL = '/api/researchers';

const getAllResearchers = async (filters = {}) => {
    try {
        const params = new URLSearchParams(filters).toString();
        const response = await axios.get(`${API_URL}?${params}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching researchers:", error);
        throw error;
    }
};

const getResearcherById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching researcher ${id}:`, error);
        throw error;
    }
};

const researcherService = {
    getAllResearchers,
    getResearcherById
};

export default researcherService;
