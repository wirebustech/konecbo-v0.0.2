import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';

const ViewLogs = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 5, textAlign: 'center' }}>
      <Paper sx={{ p: 5, borderRadius: 4, maxWidth: 600, mx: 'auto' }}>
        <Typography variant="h5">Logs Unavailable</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          System logs are being migrated to the new database.
        </Typography>
        <Button variant="outlined" onClick={() => navigate('/admin')} sx={{ mt: 3 }}>
          Back
        </Button>
      </Paper>
    </Box>
  );
};

export default ViewLogs;
