import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Grid, Avatar, Button,
  IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Chip
} from '@mui/material';
import {
  Person as PersonIcon,
  Chat as ChatIcon,
  Delete as DeleteIcon,
  ArrowBackIos as ArrowBackIosIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import friendService from '../services/friendService';
import { useChat } from '../contexts/ChatContext';
import { toast } from 'react-toastify';

const FriendsSystem = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { setActiveChatId } = useChat();

  const fetchFriends = async () => {
    try {
      // If friends were passed via navigation state, use them? 
      // Better to fetch fresh to be safe
      const data = await friendService.getFriends();
      setFriends(data.friends || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  const handleChat = (friend) => {
    // Logic to open chat with this friend
    // We can use context to set active recipient, then open widget
    // But the widget is currently global. 
    // Ideally, we navigate to Dashboard and auto-open chat, 
    // OR we just assume ChatWidget is present here too (it is in Layout usually).

    // Let's assume we want to navigate user to dashboard where chat is prominent 
    // OR if this page has the widget, we trigger it.
    // Since this is a dedicated page, we might want to just "Message" which opens the widget.

    // We can simply use the context to set the chat and maybe open it if we had a way.
    // For now, let's navigate to dashboard with state to open chat
    navigate('/researcher-dashboard');
    // Note: Improving ChatWidget to listen to location state would be good, 
    // but users can just open the widget manually.
    toast.info(`Open the chat bubble to message ${friend.full_name}`);
  };

  const handleDisconnect = async () => {
    if (!selectedFriend) return;
    try {
      await friendService.removeFriend(selectedFriend.id); // Need to implement removeFriend in service
      setFriends(prev => prev.filter(f => f.id !== selectedFriend.id));
      toast.success(`Disconnected from ${selectedFriend.full_name}`);
    } catch (error) {
      toast.error("Failed to disconnect");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedFriend(null);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7fafc', p: 4 }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <IconButton onClick={() => navigate('/researcher-dashboard')} sx={{ mr: 2 }}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h4" fontWeight={700} color="#1A2E40">
            My Connections
          </Typography>
          <Chip
            label={`${friends.length} Friends`}
            color="primary"
            sx={{ ml: 2, fontWeight: 600, bgcolor: '#64CCC5' }}
          />
        </Box>

        {loading ? (
          <Typography>Loading connections...</Typography>
        ) : friends.length === 0 ? (
          <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h6" color="text.secondary">
              You haven't connected with any researchers yet.
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
              Browse research listings and click "Connect" to build your network.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/researcher-dashboard')}>
              Browse Research
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {friends.map(friend => (
              <Grid item xs={12} sm={6} md={4} key={friend.id}>
                <Paper sx={{
                  p: 3,
                  borderRadius: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                }}>
                  <Avatar
                    src={friend.avatar_url}
                    sx={{ width: 80, height: 80, mb: 2, bgcolor: '#1A2E40', fontSize: '2rem' }}
                  >
                    {friend.full_name?.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" fontWeight={700} align="center">
                    {friend.full_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    {friend.email}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<ChatIcon />}
                      sx={{ bgcolor: '#64CCC5', '&:hover': { bgcolor: '#5AA9A3' } }}
                      onClick={() => handleChat(friend)}
                    >
                      Message
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setSelectedFriend(friend);
                        setDeleteDialogOpen(true);
                      }}
                      sx={{ border: '1px solid #ffcdd2' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Disconnect Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Disconnect Friend</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to disconnect from <strong>{selectedFriend?.full_name}</strong>?
            You will no longer be able to message them.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDisconnect} color="error" variant="contained">Disconnect</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FriendsSystem;