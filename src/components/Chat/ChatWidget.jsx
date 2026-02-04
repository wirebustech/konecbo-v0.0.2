import React, { useState, useEffect } from 'react';
import {
    Box, Paper, Typography, TextField, IconButton, Button,
    List, ListItem, ListItemAvatar, Avatar, ListItemText,
    Badge, Fab, Divider, Tooltip
} from '@mui/material';
import {
    Chat as ChatIcon, Close as CloseIcon, Send as SendIcon,
    Person as PersonIcon, SupportAgent as SupportIcon
} from '@mui/icons-material';
import { useChat } from '../../contexts/ChatContext';
import authService from '../../services/authService';

const ChatWidget = ({ currentUserRole }) => {
    const { socket, isConnected, messages, sendMessage } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const [activeRecipient, setActiveRecipient] = useState(null);
    const [inputText, setInputText] = useState("");
    const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

    // Filter messages for active conversation
    const conversation = messages.filter(
        m => (m.sender_id === activeRecipient?.id || m.recipient_id === activeRecipient?.id)
            && (m.sender_id === currentUser?.id || m.recipient_id === currentUser?.id)
    );

    const handleSend = () => {
        if (!inputText.trim() || !activeRecipient) return;
        sendMessage(activeRecipient.id, inputText);
        setInputText("");
    };

    // Mock User List for Demo - In real app, fetch from API /users or /friends
    // If Admin, show researchers. If Researcher, show Admin + Peers.
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await authService.getChatUsers();
                if (data.success) {
                    setUsers(data.users);
                }
            } catch (error) {
                console.error("Failed to load chat users", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
            {/* Chat Window */}
            {isOpen && (
                <Paper
                    elevation={10}
                    sx={{
                        width: 350,
                        height: 500,
                        mb: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        borderRadius: 3,
                        bgcolor: 'background.paper'
                    }}
                >
                    {/* Header */}
                    <Box sx={{
                        p: 2,
                        bgcolor: '#1A2E40',
                        color: 'white',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {activeRecipient ? activeRecipient.name : 'Messages'}
                        </Typography>
                        <Box>
                            {activeRecipient && (
                                <Button
                                    size="small"
                                    onClick={() => setActiveRecipient(null)}
                                    sx={{ color: '#aaa', minWidth: 'auto', mr: 1 }}
                                >
                                    Back
                                </Button>
                            )}
                            <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#f5f5f5' }}>
                        {!activeRecipient ? (
                            // User List
                            <List>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        START A CONVERSATION
                                    </Typography>
                                </Box>
                                {users.map(user => (
                                    <React.Fragment key={user.id}>
                                        <ListItem button onClick={() => setActiveRecipient(user)}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: user.role === 'admin' ? '#E53935' : '#1976D2' }}>
                                                    {user.role === 'admin' ? <SupportIcon /> : <PersonIcon />}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={user.full_name || user.email}
                                                secondary={user.role}
                                            />
                                        </ListItem>
                                        <Divider variant="inset" component="li" />
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            // Chat Messages
                            <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {conversation.length === 0 && (
                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
                                        No messages yet. Say hello!
                                    </Typography>
                                )}
                                {conversation.map((msg, idx) => {
                                    const isMe = msg.sender_id === currentUser?.id || msg.sender_id === currentUser?.userId; // Adjust for JWT payload structure
                                    return (
                                        <Box
                                            key={idx}
                                            sx={{
                                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                                bgcolor: isMe ? '#1A2E40' : 'white',
                                                color: isMe ? 'white' : 'text.primary',
                                                p: 1.5,
                                                borderRadius: 2,
                                                maxWidth: '80%',
                                                boxShadow: 1,
                                                borderBottomRightRadius: isMe ? 0 : 2,
                                                borderBottomLeftRadius: isMe ? 2 : 0
                                            }}
                                        >
                                            <Typography variant="body2">{msg.content}</Typography>
                                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.7, fontSize: '0.65rem', textAlign: 'right' }}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </Typography>
                                        </Box>
                                    );
                                })}
                            </Box>
                        )}
                    </Box>

                    {/* Input Area */}
                    {activeRecipient && (
                        <Box sx={{ p: 1.5, bgcolor: 'white', borderTop: '1px solid #eee', display: 'flex', gap: 1 }}>
                            <TextField
                                size="small"
                                fullWidth
                                placeholder="Type a message..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <IconButton color="primary" onClick={handleSend} disabled={!isConnected || !inputText.trim()}>
                                <SendIcon />
                            </IconButton>
                        </Box>
                    )}

                    {/* Status Bar */}
                    <Box sx={{ px: 2, py: 0.5, bgcolor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Box sx={{
                            width: 8, height: 8, borderRadius: '50%',
                            bgcolor: isConnected ? '#4CAF50' : '#F44336',
                            mr: 1
                        }} />
                        <Typography variant="caption" color="text.secondary">
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </Typography>
                    </Box>
                </Paper>
            )}

            {/* Floating Action Button */}
            <Tooltip title="Open Chat" placement="left">
                <Fab
                    color="primary"
                    onClick={() => setIsOpen(!isOpen)}
                    sx={{
                        bgcolor: '#1A2E40',
                        '&:hover': { bgcolor: '#2B3E50' },
                        width: 60, height: 60
                    }}
                >
                    {isOpen ? <CloseIcon /> : (
                        <Badge color="error" variant="dot" invisible={messages.length === 0}>
                            <ChatIcon />
                        </Badge>
                    )}
                </Fab>
            </Tooltip>
        </Box>
    );
};

export default ChatWidget;
