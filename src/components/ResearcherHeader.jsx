import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, IconButton, Menu, MenuItem, Typography,
    Button
} from '@mui/material';
import { Menu as MenuIcon, Close } from '@mui/icons-material';
import authService from '../services/authService';
import MessageNotification from './MessageNotification';

const ResearcherHeader = ({
    user,
    notifications = [],
    onClearNotifications,
    onMessageClick,
    selectedMessage,
    onAccept,
    onReject,
    onCloseSelected,
    pageTitle // Optional prop to override welcome message
}) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [userInfo, setUserInfo] = useState(user || null);

    useEffect(() => {
        if (user) {
            setUserInfo(user);
        } else if (!userInfo) {
            const u = authService.getCurrentUser();
            setUserInfo(u);
        }
    }, [user]);

    const handleLogout = async () => {
        await authService.logout();
        navigate('/signin');
    };

    const handleCollaborate = () => navigate('/researcher/collaborate');
    const handleAddListing = () => navigate('/researcher/add-listing');

    const userName = userInfo?.full_name || userInfo?.fullName || userInfo?.name || 'Researcher';
    const hasProfile = true; // Simplified; assume true or check auth

    return (
        <header
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'linear-gradient(90deg, var(--dark-blue) 70%, var(--light-blue) 100%)',
                color: 'var(--white)',
                borderBottom: '2px solid var(--light-blue)',
                padding: '1.5rem 2rem',
                boxShadow: '0 2px 12px rgba(30,60,90,0.08)'
            }}
        >
            <nav style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Logo / Favicon */}
                <img
                    src="/favicon.ico"
                    alt="Favicon"
                    style={{
                        width: 48,
                        height: 48,
                        marginRight: 16,
                        borderRadius: '50%',
                        border: '2.5px solid #B1EDE8',
                        objectFit: 'cover',
                        boxShadow: '0 2px 8px #5AA9A340',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/researcher-dashboard')}
                />
                {/* Arrow Removed per request */}

                <section>
                    {pageTitle ? (
                        <h1 style={{ fontWeight: 700, fontSize: '2rem', margin: 0, letterSpacing: 0.5 }}>
                            {pageTitle}
                        </h1>
                    ) : (
                        <>
                            <h1 style={{ fontWeight: 700, fontSize: '2rem', margin: 0, letterSpacing: 0.5 }}>
                                Welcome, {userName}
                            </h1>
                            <p style={{ color: 'var(--accent-teal)', margin: 0, fontSize: '1.1rem' }}>
                                Manage your research and collaborate
                            </p>
                        </>
                    )}
                </section>
            </nav>

            <nav style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Notifications (Optional: Only functional if props provided) */}
                <MessageNotification
                    messages={notifications}
                    unreadCount={notifications.filter(msg => !msg.read).length}
                    onMessageClick={onMessageClick}
                    selectedMessage={selectedMessage}
                    onAccept={onAccept}
                    onReject={onReject}
                    onCloseSelected={onCloseSelected}
                    onClearNotifications={onClearNotifications}
                />

                <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    sx={{
                        bgcolor: 'var(--light-blue)',
                        color: 'var(--dark-blue)',
                        '&:hover': { bgcolor: '#5AA9A3' }
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    PaperProps={{
                        sx: {
                            bgcolor: 'var(--dark-blue)',
                            minWidth: 200,
                            color: 'var(--light-blue)',
                            borderRadius: '0.8rem'
                        }
                    }}
                >
                    <MenuItem onClick={() => {
                        navigate(userInfo?.hasProfile ? '/researcher-profile' : '/researcher-edit-profile');
                    }}>
                        My Profile
                    </MenuItem>
                    <MenuItem onClick={handleAddListing}>New Research</MenuItem>
                    <MenuItem onClick={() => navigate('/friends')}>Friends</MenuItem>
                    <MenuItem onClick={handleCollaborate}>Collaborate</MenuItem>
                    <MenuItem onClick={() => navigate('/researcher-dashboard')}>Dashboard</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </nav>
        </header >
    );
};

export default ResearcherHeader;
