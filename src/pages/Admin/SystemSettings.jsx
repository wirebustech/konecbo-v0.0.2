import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Switch, TextField,
    Button, CircularProgress
} from '@mui/material';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const SystemSettings = () => {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editValues, setEditValues] = useState({});

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await adminService.getSettings();
            if (data.success) {
                setSettings(data.settings);
            }
        } catch (error) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (key, newValue) => {
        try {
            await adminService.updateSetting(key, newValue);
            toast.success("Setting updated");
            fetchSettings(); // Refresh
        } catch (error) {
            toast.error("Failed to update setting");
        }
    };

    const handleTextChange = (key, value) => {
        setEditValues(prev => ({ ...prev, [key]: value }));
    };

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 4, bgcolor: '#1A2E40', color: 'white', borderRadius: 2 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#64CCC5', fontWeight: 'bold' }}>
                System Configuration & Feature Flags
            </Typography>

            <TableContainer component={Box}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ color: '#ccc' }}>Setting Key</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Description</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Value</TableCell>
                            <TableCell sx={{ color: '#ccc' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {settings.map((setting) => (
                            <TableRow key={setting.key}>
                                <TableCell sx={{ color: 'white', fontFamily: 'monospace' }}>{setting.key}</TableCell>
                                <TableCell sx={{ color: 'white' }}>{setting.description}</TableCell>
                                <TableCell sx={{ color: 'white' }}>
                                    {setting.key.endsWith('_enabled') ? (
                                        <Switch
                                            checked={setting.value === 'true'}
                                            onChange={(e) => handleUpdate(setting.key, String(e.target.checked))}
                                            color="secondary"
                                        />
                                    ) : (
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            value={editValues[setting.key] !== undefined ? editValues[setting.key] : setting.value}
                                            onChange={(e) => handleTextChange(setting.key, e.target.value)}
                                            sx={{
                                                bgcolor: 'white',
                                                borderRadius: 1,
                                                input: { color: 'black' }
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {!setting.key.endsWith('_enabled') && (
                                        <Button
                                            variant="contained"
                                            size="small"
                                            sx={{ bgcolor: '#64CCC5', '&:hover': { bgcolor: '#5AA9A3' } }}
                                            onClick={() => handleUpdate(setting.key, editValues[setting.key] || setting.value)}
                                        >
                                            Save
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default SystemSettings;
