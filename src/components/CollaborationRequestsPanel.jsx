import React from 'react';
import { Box, Typography } from '@mui/material';

const CollaborationRequestsPanel = () => {
  return (
    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 2, my: 2 }}>
      <Typography variant="body2" color="text.secondary">
        Collaboration Requests Unavailable
      </Typography>
    </Box>
  );
};

export default CollaborationRequestsPanel;