import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, Paper, Divider, Alert
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import authService from '../../services/authService';

const AdminProfile = () => {
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const user = authService.getCurrentUser();

    // Set initial email from local storage or auth context if available
    // But for security, user sees empty or current email

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const updateData = {
                password: formData.currentPassword,
            };
            if (formData.email) updateData.email = formData.email;
            if (formData.newPassword) updateData.newPassword = formData.newPassword;

            // Using authService logic manually here or extending authService
            // Let's call axios directly as it's a specific internal route usually
            const API_URL = window.location.hostname === 'localhost'
                ? 'http://localhost:5000/api/auth'
                : 'https://konecbo-main.azurewebsites.net/api/auth';

            await axios.put(`${API_URL}/update-credentials`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Credentials updated successfully");
            setFormData({
                ...formData,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
            <Paper sx={{ p: 4, bgcolor: '#2B3E50', color: 'white', borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#64CCC5', fontWeight: 'bold' }}>
                    Admin Account Settings
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.7 }}>
                    Update your login credentials. You must provide your current password to make changes.
                </Typography>

                <Box component="form" onSubmit={handleUpdate} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Current Email"
                        value={user?.email || 'Admin'}
                        disabled
                        variant="filled"
                        InputProps={{ style: { color: '#ccc' } }}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{ bgcolor: 'rgba(0,0,0,0.2)', borderRadius: 1 }}
                    />

                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

                    <Typography variant="h6" sx={{ fontSize: '1rem', color: '#64CCC5' }}>Update Details</Typography>

                    <TextField
                        label="New Email (Optional)"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter new email"
                        variant="outlined"
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderRadius: 1,
                            fieldset: { borderColor: 'rgba(255,255,255,0.2)' }
                        }}
                    />

                    <TextField
                        label="New Password (Optional)"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderRadius: 1,
                            fieldset: { borderColor: 'rgba(255,255,255,0.2)' }
                        }}
                    />

                    <TextField
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderRadius: 1,
                            fieldset: { borderColor: 'rgba(255,255,255,0.2)' }
                        }}
                    />

                    <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

                    <TextField
                        label="Current Password (Required)"
                        name="currentPassword"
                        type="password"
                        required
                        value={formData.currentPassword}
                        onChange={handleChange}
                        variant="outlined"
                        helperText="Required to authorize changes"
                        InputProps={{ style: { color: 'white' } }}
                        InputLabelProps={{ style: { color: '#aaa' } }}
                        FormHelperTextProps={{ style: { color: '#aaa' } }}
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.05)',
                            borderRadius: 1,
                            fieldset: { borderColor: '#64CCC5' }
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{
                            bgcolor: '#64CCC5',
                            color: '#132238',
                            fontWeight: 'bold',
                            py: 1.5,
                            '&:hover': { bgcolor: '#5AA9A3' }
                        }}
                    >
                        {loading ? 'Updating...' : 'Update Credentials'}
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default AdminProfile;
