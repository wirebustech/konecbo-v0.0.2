import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResearcherDashboard.css';
import axios from "axios";
import { useResearcherDashboard } from './researcherDashboardLogic';
import ResearcherHeader from '../../components/ResearcherHeader'; // Added
// MUI Components
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
  DialogActions,
  Stack,
  Grid
} from '@mui/material';
import { Notifications, Menu as MenuIcon, Close } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import CollaborationRequestsPanel from '../../components/CollaborationRequestsPanel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatWidget from '../../components/Chat/ChatWidget';

function getFirstNSentences(text, n = 1) {
  if (!text) return "";
  const sentences = text.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+/g) || [];
  return sentences.slice(0, n).join(" ");
}

const ResearcherDashboard = () => {
  const {
    setAllListings,
    myListings, setMyListings,
    userId, setUserId,
    hasProfile, setHasProfile,
    collabListings, setCollabListings,
    searchTerm,
    searchResults,
    dropdownVisible, setDropdownVisible,
    showNoResults,
    filteredListings, setFilteredListings,
    userName, setUserName,
    friends,
    setMessages,

    setIpAddress,
    anchorEl, setAnchorEl,
    selectedMessage, setSelectedMessage,
    cardMenuAnchor, setCardMenuAnchor,
    cardMenuId, setCardMenuId,
    showReviewersDialog, setShowReviewersDialog,
    reviewersForProject,
    reviewRequests, setReviewRequests,
    expandedSummaries,
    deleteDialogOpen, setDeleteDialogOpen,
    setListingToDelete,

    pendingReviewRef,
    handleAcceptReviewRequest,
    handleDeclineReviewRequest,
    handleSearch,
    handleMessageClick,
    handleAddListing,
    handleCollaborate,
    handleInputChange,
    handleClear,
    handleLogout,
    handleAcceptCollab,
    handleRejectCollab,
    handleClearNotifications,
    combinedNotifications,
    handleShowReviewers,
    handleToggleSummary,
    handleDropdownMouseEnter,
    handleDropdownMouseLeave,
    handleDeleteListing,
    showCollaboratorsDialog, setShowCollaboratorsDialog,
    collaboratorsForProject,
    handleShowCollaborators,
    handleAcknowledgeCollaborator,
    myCollaborations
  } = useResearcherDashboard();

  const navigate = useNavigate();

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--background-main, #f7fafc)' }}>
      {/* Header */}
      <ResearcherHeader
        user={{ full_name: userName, hasProfile }}
        notifications={combinedNotifications}
        onMessageClick={handleMessageClick}
        selectedMessage={selectedMessage}
        onAccept={handleAcceptCollab}
        onReject={handleRejectCollab}
        onCloseSelected={() => setSelectedMessage(null)}
        onClearNotifications={handleClearNotifications}
        contributorStars={myListings ? myListings.filter(l => l.status === 'active').length : 0}
        collaboratorStars={myCollaborations ? myCollaborations.filter(c => c.status === 'acknowledged').length : 0}
      />

      {/* Main Content */}
      <section style={{ flex: 1, padding: 32, background: 'var(--background-main, #f7fafc)' }}>
        {/* Search Section */}
        <section style={{ maxWidth: 800, margin: '0 auto', marginBottom: 32 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            style={{
              padding: 12,
              display: 'flex',
              gap: 12,
              background: 'var(--background-paper, #fff)',
              borderRadius: 18,
              boxShadow: '0 2px 12px rgba(30,60,90,0.06)',
              position: 'relative'
            }}
          >
            <TextField
              id="search-input"
              fullWidth
              variant="outlined"
              placeholder="Search research by title or researcher name..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setDropdownVisible(true)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '1.2rem',
                  borderColor: 'var(--dark-blue)'
                }
              }}
            />
            <Button
              type="button"
              variant="contained"
              onClick={handleClear}
              sx={{
                bgcolor: 'var(--light-blue)',
                color: 'var(--dark-blue)',
                borderRadius: '1.5rem',
                minWidth: '100px',
                px: 3,
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#5AA9A3',
                  color: 'var(--white)'
                }
              }}
            >
              Clear
            </Button>
            <Button
              type="button"
              variant="contained"
              onClick={handleSearch}
              sx={{
                bgcolor: 'var(--light-blue)',
                color: 'var(--dark-blue)',
                borderRadius: '1.5rem',
                minWidth: '100px',
                px: 3,
                fontWeight: 600,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#5AA9A3',
                  color: 'var(--white)'
                }
              }}
            >
              Search
            </Button>
            {/* Search Dropdown */}
            {dropdownVisible && (
              <section
                id="search-dropdown"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
                style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  right: 0,
                  zIndex: 999,
                  background: 'var(--background-paper, #fff)',
                  boxShadow: '0 8px 32px rgba(30,60,90,0.18)',
                  maxHeight: 400,
                  overflowY: 'auto',
                  borderRadius: 18,
                  border: '1.5px solid #B1EDE8',
                  padding: 12,
                  marginTop: 6,
                  transition: 'box-shadow 0.2s',
                }}
              >
                {searchResults.length === 0 ? (
                  <Typography sx={{ p: 2, color: '#888', textAlign: 'center', fontSize: '1.08rem' }}>
                    {showNoResults ? "No research listings found." : "Start typing to search"}
                  </Typography>
                ) : (
                  searchResults.map(item => (
                    <Paper
                      key={item.id}
                      elevation={3}
                      sx={{
                        mb: 2,
                        p: 2.5,
                        borderRadius: 4,
                        cursor: 'pointer',
                        border: '1.5px solid #e3e8ee',
                        transition: 'box-shadow 0.18s, border 0.18s, background 0.18s',
                        '&:hover': {
                          boxShadow: '0 6px 24px #B1EDE880',
                          border: '2px solid #5AA9A3',
                          background: '#eafcfa',
                          transform: 'scale(1.015)'
                        },
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 2,
                        minHeight: 90,
                      }}
                      onClick={() => {
                        setDropdownVisible(false);
                        navigate(`/listing/${item.id}`);
                      }}
                    >
                      <Box sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center'
                      }}>
                        <Typography variant="h6" sx={{ color: 'var(--dark-blue)', fontWeight: 700, fontSize: '1.13rem', mb: 0.5, lineHeight: 1.2 }}>
                          {item.title}
                        </Typography>
                        <Typography sx={{ color: '#5AA9A3', fontSize: '1rem', mb: 0.5, fontWeight: 500 }}>
                          By: {item.researcherName}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#444',
                            fontSize: '0.99rem',
                            mb: 0.5,
                            lineHeight: 1.5,
                            maxHeight: 48,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2, // Show up to 2 lines, then ellipsis
                            WebkitBoxOrient: 'vertical',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word'
                          }}
                        >
                          {getFirstNSentences(item.summary, 1)}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          borderRadius: 3,
                          bgcolor: 'var(--light-blue)',
                          color: 'var(--dark-blue)',
                          fontWeight: 700,
                          px: 2.5,
                          minWidth: 0,
                          textTransform: 'none',
                          boxShadow: '0 2px 10px rgba(100,204,197,0.10)',
                          ml: 2,
                          alignSelf: 'center',
                          '&:hover': {
                            bgcolor: '#5AA9A3',
                            color: 'var(--white)'
                          }
                        }}
                        onClick={e => {
                          e.stopPropagation();
                          setDropdownVisible(false);
                          navigate(`/listing/${item.id}`);
                        }}
                      >
                        View
                      </Button>
                    </Paper>
                  ))
                )}
              </section>
            )}
          </form>
        </section>

        {/* Listings Grid - Now horizontal scroll and reviewer card style */}
        <section style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 24, fontSize: '1.7rem', fontWeight: 700, color: 'var(--dark-blue)' }}>My Research</h2>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#e3e8ee', borderRadius: 4 },
          }}>
            {filteredListings.map((item, idx) => {
              const sentences = (item.summary?.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+/g) || []);
              const isLong = sentences.length > 1;
              const expanded = expandedSummaries[item.id];
              return (
                <Box
                  key={`my-${item.id}-${idx}`}
                  sx={{
                    maxWidth: 370,
                    minWidth: 290,
                    bgcolor: "#fff",
                    color: "#222",
                    borderRadius: "1.2rem",
                    boxShadow: "0 6px 24px rgba(30, 60, 90, 0.12), 0 1.5px 4px rgba(30, 60, 90, 0.10)",
                    border: "1px solid #e3e8ee",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    m: 0,
                    transition: "box-shadow 0.2s, transform 0.2s",
                    '&:hover': {
                      boxShadow: "0 12px 32px rgba(30, 60, 90, 0.18), 0 2px 8px rgba(30, 60, 90, 0.12)",
                      transform: "translateY(-4px) scale(1.03)",
                      borderColor: "#B1EDE8",
                    },
                    position: 'relative'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 1, pt: 2, pb: 0 }}>
                    <IconButton
                      size="small"
                      onClick={e => {
                        setCardMenuAnchor(e.currentTarget);
                        setCardMenuId(item.id);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  <Box sx={{ flex: 1, pt: 0, px: 2, pb: 2 }}>
                    <Typography variant="h6" sx={{ color: "var(--dark-blue)", fontWeight: 700, fontSize: "1.2rem", mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography sx={{ color: "#222", mb: 1, fontSize: '1rem', lineHeight: 1.6 }}>
                      {expanded
                        ? item.summary
                        : getFirstNSentences(item.summary, 1)
                      }
                      {isLong && (
                        <Button
                          size="small"
                          sx={{
                            ml: 1,
                            color: 'var(--light-blue)',
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 0.5,
                            minWidth: 0,
                            background: 'none',
                            boxShadow: 'none',
                            fontSize: '0.98rem',
                            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
                          }}
                          onClick={() => handleToggleSummary(item.id)}
                        >
                          {expanded ? "Show less" : "Show more"}
                        </Button>
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ pt: 0, px: 2, pb: 2 }}>
                    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: 'var(--light-blue)',
                          color: 'var(--dark-blue)',
                          borderRadius: '1.5rem',
                          fontWeight: 600,
                          px: 2,
                          py: 0.5,
                          minWidth: 0,
                          boxShadow: '0 2px 10px rgba(100,204,197,0.08)',
                          textTransform: "none",
                          '&:hover': { bgcolor: '#5AA9A3', color: 'var(--white)' },
                          flex: 1
                        }}
                        onClick={() => navigate(`/listing/${item.id}`)}
                      >
                        View Listing
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: 'var(--light-blue)',
                          color: 'var(--dark-blue)',
                          borderRadius: '1.5rem',
                          fontWeight: 600,
                          px: 2,
                          py: 0.5,
                          minWidth: 0,
                          boxShadow: '0 2px 10px rgba(100,204,197,0.08)',
                          textTransform: "none",
                          '&:hover': { bgcolor: '#5AA9A3', color: 'var(--white)' },
                          flex: 1
                        }}
                        onClick={() => navigate(`/collaboration/${item.id}`, { state: { userRole: 'researcher' } })}
                      >
                        Collaboration Room
                      </Button>
                    </Stack>
                  </Box>
                </Box>
              );
            })}
          </Box>
          {/* 3-dot menu for research cards */}
          <Menu
            anchorEl={cardMenuAnchor}
            open={Boolean(cardMenuAnchor)}
            onClose={() => setCardMenuAnchor(null)}
          >
            <MenuItem
              onClick={() => {
                setListingToDelete(cardMenuId);
                setDeleteDialogOpen(true);
                setCardMenuAnchor(null);
              }}
            >
              Delete Project
            </MenuItem>
            <MenuItem
              onClick={async () => {
                await handleShowReviewers(cardMenuId);
              }}
            >
              See Reviewers
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleShowCollaborators(cardMenuId);
              }}
            >
              Manage Collaborators
            </MenuItem>
          </Menu>

          {/* Collaborators Dialog */}
          <Dialog
            open={showCollaboratorsDialog}
            onClose={() => setShowCollaboratorsDialog(false)}
            PaperProps={{
              sx: { bgcolor: '#fff', color: '#222', borderRadius: 2, minWidth: 400, maxWidth: 600 }
            }}
          >
            <DialogTitle>Manage Collaborators</DialogTitle>
            <DialogContent>
              {collaboratorsForProject.length === 0 ? (
                <Typography>No collaborators joined yet.</Typography>
              ) : (
                collaboratorsForProject.map(c => (
                  <Box key={c.id} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={700}>{c.full_name}</Typography>
                      <Typography variant="body2">{c.email}</Typography>
                      <Typography variant="caption" sx={{
                        color: c.status === 'acknowledged' ? 'green' : 'orange',
                        textTransform: 'uppercase',
                        fontWeight: 600
                      }}>
                        {c.status}
                      </Typography>
                    </Box>
                    {c.status !== 'acknowledged' && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: 'var(--light-blue)', color: 'var(--dark-blue)', fontWeight: 700 }}
                        onClick={() => handleAcknowledgeCollaborator(c.id)}
                      >
                        Acknowledge Input
                      </Button>
                    )}
                  </Box>
                ))
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowCollaboratorsDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>
          {/* Reviewers Dialog */}
          <Dialog
            open={showReviewersDialog}
            onClose={() => setShowReviewersDialog(false)}
            PaperProps={{
              sx: {
                bgcolor: '#fff',
                color: '#222',
                borderRadius: 2,
                minWidth: 350,
                maxWidth: 500
              }
            }}
          >
            <DialogTitle>Reviewers for this Project</DialogTitle>
            <DialogContent>
              {reviewersForProject.length === 0 ? (
                <Typography>No reviewers yet.</Typography>
              ) : (
                reviewersForProject.map(r => (
                  <Box key={r.id} sx={{ mb: 2, p: 1, borderBottom: '1px solid #eee' }}>
                    <Typography variant="subtitle1">{r.reviewerName}</Typography>
                    <Typography variant="body2">{r.reviewerEmail}</Typography>
                    <Typography variant="body2" sx={{ color: r.status === 'accepted' ? 'green' : r.status === 'pending' ? 'orange' : 'red' }}>
                      Status: {r.status}
                    </Typography>
                  </Box>
                ))
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowReviewersDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </section>

        {/* Collaborations Section */}
        <section style={{ marginTop: 48, maxWidth: 1200, marginLeft: 'auto', marginRight: 'auto' }}>
          <h2 style={{ marginBottom: 24, fontSize: '1.7rem', fontWeight: 700, color: 'var(--dark-blue)' }}>My Collaborations</h2>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            overflowX: 'auto',
            pb: 2,
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-thumb': { bgcolor: '#e3e8ee', borderRadius: 4 },
          }}>
            {collabListings.map((listing, idx) => (
              <Box
                key={`collab-${listing.id}-${idx}`}
                sx={{
                  maxWidth: 370,
                  minWidth: 290,
                  bgcolor: "#fff",
                  color: "#222",
                  borderRadius: "1.2rem",
                  boxShadow: "0 6px 24px rgba(30, 60, 90, 0.12), 0 1.5px 4px rgba(30, 60, 90, 0.10)",
                  border: "1px solid #e3e8ee",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  m: 0,
                  transition: "box-shadow 0.2s, transform 0.2s",
                  '&:hover': {
                    boxShadow: "0 12px 32px rgba(30, 60, 90, 0.18), 0 2px 8px rgba(30, 60, 90, 0.12)",
                    transform: "translateY(-4px) scale(1.03)",
                    borderColor: "#B1EDE8",
                  },
                  position: 'relative'
                }}
              >
                <Box sx={{ flex: 1, pt: 0, px: 2, pb: 2 }}>
                  <Typography variant="h6" sx={{ color: "var(--dark-blue)", fontWeight: 700, fontSize: "1.2rem", mb: 1 }}>
                    {listing.title}
                  </Typography>
                  <Typography sx={{ color: "#222", mb: 1, fontSize: '1rem', lineHeight: 1.6 }}>
                    {getFirstNSentences(listing.summary, 5)}
                  </Typography>
                </Box>
                <Box sx={{ pt: 0, px: 2, pb: 2 }}>
                  <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: 'var(--light-blue)',
                        color: 'var(--dark-blue)',
                        borderRadius: '1.5rem',
                        fontWeight: 600,
                        px: 2,
                        py: 0.5,
                        minWidth: 0,
                        boxShadow: '0 2px 10px rgba(100,204,197,0.08)',
                        textTransform: "none",
                        '&:hover': { bgcolor: '#5AA9A3', color: 'var(--white)' },
                        flex: 1
                      }}
                      onClick={() => navigate(`/listing/${listing.id}`)}
                    >
                      View Project
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: 'var(--light-blue)',
                        color: 'var(--dark-blue)',
                        borderRadius: '1.5rem',
                        fontWeight: 600,
                        px: 2,
                        py: 0.5,
                        minWidth: 0,
                        boxShadow: '0 2px 10px rgba(100,204,197,0.08)',
                        textTransform: "none",
                        '&:hover': { bgcolor: '#5AA9A3', color: 'var(--white)' },
                        flex: 1
                      }}
                      onClick={() => navigate(`/collaboration/${listing.id}`, { state: { userRole: 'researcher' } })}
                    >
                      Collaboration Room
                    </Button>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </section>

        {/* Friends Section */}
        <section style={{ maxWidth: 1200, margin: '48px auto 0 auto' }}>
          <h2 style={{ marginBottom: 24, fontSize: '1.7rem', fontWeight: 700, color: 'var(--dark-blue)' }}>My Connections</h2>
          {friends && friends.length > 0 ? (
            <Grid container spacing={2}>
              {friends.map(friend => (
                <Grid item xs={12} sm={6} md={4} key={friend.id}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      borderRadius: 3,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                      border: '1px solid #eee'
                    }}
                  >
                    <Box sx={{
                      width: 50, height: 50, borderRadius: '50%', bgcolor: '#e3f2fd',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1976d2'
                    }}>
                      <PersonIcon />
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>{friend.full_name}</Typography>
                      <Typography variant="caption" color="textSecondary">{friend.email}</Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', color: '#666', bgcolor: '#fff', borderRadius: 3 }}>
              <Typography>No connections yet. Find researchers and click "Connect" on their projects!</Typography>
            </Paper>
          )}
        </section>

        {/* Pending Review Requests */}
        <section ref={pendingReviewRef} style={{ maxWidth: 800, margin: '32px auto' }}>
          <h2 style={{ color: 'var(--dark-blue)', fontWeight: 700, marginBottom: 16 }}>Pending Review Requests</h2>
          {reviewRequests.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center', color: '#888', bgcolor: '#f5f7fa', borderRadius: 2 }}>
              No pending review requests.
            </Paper>
          ) : (
            reviewRequests.map(req => (
              <Paper key={req.id} sx={{ p: 2.5, mb: 2, bgcolor: '#1a2a42', color: '#B1EDE8', borderRadius: 2, boxShadow: '0 2px 8px #0001' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Reviewer: {req.reviewerName} {req.reviewerEmail && <span style={{ color: '#B1EDE8', fontWeight: 400 }}>({req.reviewerEmail})</span>}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Project: <strong>{req.projectTitle}</strong>
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: '#B1EDE8', opacity: 0.9 }}>
                  {getFirstNSentences(req.projectSummary, 5)}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Button variant="contained" color="success" onClick={() => handleAcceptReviewRequest(req.id)}>
                    Accept
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleDeclineReviewRequest(req.id)}>
                    Decline
                  </Button>
                </Box>
              </Paper>
            ))
          )}
        </section>


        {/* Delete Listing Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Project</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this project? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button color="error" onClick={handleDeleteListing}>Delete</Button>
          </DialogActions>
        </Dialog>
      </section>

      <ChatWidget currentUserRole="researcher" />
    </main>
  );
};

export default ResearcherDashboard;