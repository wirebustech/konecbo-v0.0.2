import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

const AdminPage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7fafc', p: 5, textAlign: 'center' }}>
      <Paper sx={{ p: 5, borderRadius: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h4" sx={{ color: '#132238', mb: 2, fontWeight: 700 }}>
          Admin Portal Update
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 4 }}>
          The Admin Portal is currently undergoing scheduled maintenance for a database migration.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ bgcolor: '#64CCC5' }}>
          Return to Home
        </Button>
      </Paper>
    </Box>
  );
};

export default AdminPage;