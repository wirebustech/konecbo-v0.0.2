import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, Grid, Card, CardContent, CardActions, Chip, CircularProgress } from '@mui/material';
import { Description, Folder, Chat, ArrowBackIos, Settings, Launch } from '@mui/icons-material';
import researcherService from '../../services/researcherService';
import { toast } from 'react-toastify';

const CollaboratePage = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const data = await researcherService.getSystemConfig();
        if (data.success) {
          setConfig(data.settings || {});
        }
      } catch (error) {
        console.error("Failed to load config");
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleLaunchGoogleDocs = () => {
    const clientId = config['google_client_id'];
    if (!clientId) {
      toast.info("Google Docs integration is enabled but Client ID is not configured by Admin.");
      return;
    }
    // Simulation of API/OAuth flow launch
    window.open(`https://docs.google.com/document/create?usp=drive_web&client_id=${clientId}`, '_blank'); // Simplified example URL
  };

  const tools = [
    {
      id: 'google_docs',
      title: 'Google Docs',
      icon: <Description fontSize="large" sx={{ color: '#4285F4' }} />,
      description: 'Collaborate on documents in real-time using Google Docs integration.',
      enabled: config['google_docs_enabled'] === 'true',
      action: handleLaunchGoogleDocs,
      buttonText: 'Open Docs'
    },
    {
      id: 'file_sharing',
      title: 'File Sharing',
      icon: <Folder fontSize="large" sx={{ color: '#FFCA28' }} />,
      description: 'Securely upload and share research data files with your team.',
      enabled: config['file_sharing_enabled'] === 'true',
      action: () => toast.info("File Sharing interface coming soon!"),
      buttonText: 'Manage Files'
    },
    {
      id: 'chat',
      title: 'Team Chat',
      icon: <Chat fontSize="large" sx={{ color: '#34A853' }} />,
      description: 'Instant messaging for quick coordination with other researchers.',
      enabled: config['chat_enabled'] === 'true',
      action: () => navigate('/friends'), // Assuming friends/chat system
      buttonText: 'Open Chat'
    }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F1F8F4', p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            startIcon={<ArrowBackIos />}
            onClick={() => navigate('/researcher-dashboard')}
            sx={{ color: '#132238' }}
          >
            Dashboard
          </Button>
          <Typography variant="h4" sx={{ color: '#132238', fontWeight: 700, flex: 1, textAlign: 'center' }}>
            Collaboration Tools
          </Typography>
          <Box sx={{ width: 100 }} /> {/* Spacer for centering */}
        </Box>

        <Grid container spacing={4}>
          {tools.map((tool) => (
            <Grid item xs={12} md={4} key={tool.id}>
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                opacity: tool.enabled ? 1 : 0.6,
                transition: 'transform 0.2s',
                '&:hover': tool.enabled ? { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)' } : {}
              }}>
                <CardContent sx={{ flex: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>{tool.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {tool.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tool.description}
                  </Typography>
                  {!tool.enabled && (
                    <Chip label="Disabled by Admin" size="small" color="default" variant="outlined" />
                  )}
                </CardContent>
                <CardActions sx={{ p: 3, pt: 0, justifyContent: 'center' }}>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!tool.enabled}
                    onClick={tool.action}
                    startIcon={tool.id === 'google_docs' ? <Launch /> : null}
                    sx={{
                      bgcolor: '#132238',
                      borderRadius: 2,
                      py: 1,
                      '&:hover': { bgcolor: '#2C3E50' }
                    }}
                  >
                    {tool.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="body2" color="#888">
            Need a new tool? Contact Admin support to request feature integration via the <span style={{ fontFamily: 'monospace' }}>system_settings</span> config.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CollaboratePage;