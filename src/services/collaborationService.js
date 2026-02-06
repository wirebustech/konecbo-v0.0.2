import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/collaborations';

const getAuthHeader = () => {
    const token = authService.getToken();
    return { headers: { Authorization: `Bearer ${token}` } };
};

const joinCollaboration = async (listingId) => {
    const response = await axios.post(`${API_URL}/join`, { listingId }, getAuthHeader());
    return response.data;
};

const acknowledgeCollaborator = async (collaborationId) => {
    const response = await axios.post(`${API_URL}/acknowledge`, { collaborationId }, getAuthHeader());
    return response.data;
};

const getCollaborators = async (listingId) => {
    const response = await axios.get(`${API_URL}/listing/${listingId}`, getAuthHeader());
    return response.data;
};

const getMyCollaborations = async () => {
    const response = await axios.get(`${API_URL}/my`, getAuthHeader());
    return response.data;
};

const collaborationService = {
    joinCollaboration,
    acknowledgeCollaborator,
    getCollaborators,
    getMyCollaborations
};

export default collaborationService;
