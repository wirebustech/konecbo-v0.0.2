import React from 'react';
import { Box, Typography } from '@mui/material';

const FriendsSystem = () => {
  return (
    <Box sx={{ p: 3, textAlign: 'center', bgcolor: '#fff', borderRadius: 2 }}>
      <Typography variant="h6">Friends System Update</Typography>
      <Typography variant="body2" color="text.secondary">
        This module is currently offline for maintenance.
      </Typography>
    </Box>
  );
};

export default FriendsSystem;