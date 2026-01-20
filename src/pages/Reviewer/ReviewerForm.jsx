import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

const ReviewerForm = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7fafc', p: 3 }}>
      <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 4, maxWidth: 600, mx: 'auto', mt: 5 }}>
        <Typography variant="h5">Application Unavailable</Typography>
        <Typography sx={{ mt: 2 }}>We are not accepting new reviewer applications during the system migration.</Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 3, bgcolor: '#64CCC5' }}>
          Back Home
        </Button>
      </Paper>
    </Box>
  );
};
export default ReviewerForm;
