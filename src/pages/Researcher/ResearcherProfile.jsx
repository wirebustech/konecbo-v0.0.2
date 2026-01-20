import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const ResearcherProfile = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7fafc', p: 3 }}>
      <Button
        startIcon={<ArrowBackIosIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>
      <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4, maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Typography variant="h4" sx={{ color: '#132238', mb: 2, fontWeight: 700 }}>
          Researcher Profile Upgrade
        </Typography>
        <Typography variant="body1" sx={{ color: '#555', mb: 4 }}>
          We are upgrading the profile system. Your profile is safe, but editing and viewing details are temporarily disabled during migration.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/researcher-dashboard')} sx={{ bgcolor: '#64CCC5' }}>
          Return to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default ResearcherProfile;