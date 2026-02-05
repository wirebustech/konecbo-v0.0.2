import React, { useState } from 'react';
import { Badge, IconButton, Menu, Box, Typography, Button, Paper } from '@mui/material';
import { Notifications, Close } from '@mui/icons-material';

const MessageNotification = ({
    messages = [],
    unreadCount = 0,
    onMessageClick,
    selectedMessage,
    onAccept,
    onReject,
    onCloseSelected,
    onClearNotifications
}) => {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
        <Badge
            color="error"
            badgeContent={unreadCount}
            sx={{
                '& .MuiBadge-badge': {
                    right: 8,
                    top: 8
                }
            }}
        >
            <IconButton
                color="inherit"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                sx={{
                    color: '#B1EDE8',
                    '&:hover': { transform: 'scale(1.1)' }
                }}
            >
                <Notifications />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => { setAnchorEl(null); onCloseSelected && onCloseSelected(); }}
                PaperProps={{
                    sx: {
                        bgcolor: '#132238',
                        border: '1px solid #B1EDE8',
                        width: 350,
                        maxHeight: 500
                    }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Box sx={{
                        display: 'flex',
                        color: '#B1EDE8',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #2a3a57',
                        pb: 1,
                        mb: 2
                    }}>
                        <Typography variant="h6">Notifications</Typography>
                        <Box>
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{ color: '#B1EDE8', borderColor: '#B1EDE8', mr: 1, minWidth: 0, px: 1 }}
                                onClick={() => {
                                    onClearNotifications && onClearNotifications();
                                    setAnchorEl(null);
                                    onCloseSelected && onCloseSelected();
                                }}
                            >
                                Mark as read
                            </Button>
                            <IconButton onClick={() => { setAnchorEl(null); onCloseSelected && onCloseSelected(); }} size="small">
                                <Close sx={{ color: '#B1EDE8' }} />
                            </IconButton>
                        </Box>
                    </Box>
                    {/* If a collaboration-request message is selected, show accept/reject UI */}
                    {selectedMessage && (selectedMessage.type === 'collaboration-request' || selectedMessage.type === 'friend-request') ? (
                        <Paper sx={{ p: 2, mb: 1, bgcolor: 'rgba(177, 237, 232, 0.05)' }}>
                            <Typography variant="subtitle1" sx={{ color: '#B1EDE8' }}>{selectedMessage.title}</Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }}>{selectedMessage.content}</Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button variant="contained" color="success" onClick={() => { onAccept(selectedMessage); onCloseSelected && onCloseSelected(); }}>
                                    Accept
                                </Button>
                                {/* <Button variant="contained" color="error" onClick={() => { onReject(selectedMessage); onCloseSelected && onCloseSelected(); }}>
                  Reject
                </Button> */}
                                <Button variant="outlined" sx={{ color: '#B1EDE8', borderColor: '#B1EDE8' }} onClick={() => { onCloseSelected && onCloseSelected(); }}>
                                    Close
                                </Button>
                            </Box>
                        </Paper>
                    ) : messages.length === 0 ? (
                        <Typography variant="body2" sx={{ textAlign: 'center', color: '#888' }}>
                            No new messages
                        </Typography>
                    ) : (
                        messages.map(message => (
                            <Paper
                                key={message.id}
                                sx={{
                                    p: 2,
                                    mb: 1,
                                    cursor: 'pointer',
                                    color: '#B1EDE8',
                                    bgcolor: message.read ? 'inherit' : 'rgba(177, 237, 232, 0.05)',
                                    '&:hover': { bgcolor: 'rgba(177, 237, 232, 0.1)' }
                                }}
                                onClick={() => {
                                    onMessageClick && onMessageClick(message);
                                }}
                            >
                                <Typography variant="subtitle1">{message.title}</Typography>
                                <Typography variant="body2">{message.content}</Typography>
                                <Typography variant="caption" sx={{ color: '#7a8fb1' }}>
                                    {new Date(message.timestamp).toLocaleString()}
                                </Typography>
                            </Paper>
                        ))
                    )}
                </Box>
            </Menu>
        </Badge>
    );
};

export default MessageNotification;
