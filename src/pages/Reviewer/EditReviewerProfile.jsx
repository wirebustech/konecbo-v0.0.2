import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

const EditReviewerProfile = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7fafc', p: 3 }}>
      <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4, maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Typography variant="h5">Edit Functionality Unavailable</Typography>
        <Button variant="contained" onClick={() => navigate('/reviewer')} sx={{ mt: 3, bgcolor: '#64CCC5' }}>
          Back
        </Button>
      </Paper>
    </Box>
  );
};
export default EditReviewerProfile;