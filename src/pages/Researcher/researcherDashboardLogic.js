// researcherDashboardLogic.js - Backend logic for ResearcherDashboard
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import authService from '../../services/authService';
import listingService from '../../services/listingService';
import friendService from '../../services/friendService'; // Added
import { toast } from 'react-toastify';

export function useResearcherDashboard() {
  // State
  const [allListings, setAllListings] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [collabListings, setCollabListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const dropdownTimeout = useRef(null);
  const [filteredListings, setFilteredListings] = useState([]);
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]); // Added
  const [friends, setFriends] = useState([]); // Added
  const [showContactForm, setShowContactForm] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [cardMenuAnchor, setCardMenuAnchor] = useState(null);
  const [cardMenuId, setCardMenuId] = useState(null);
  const [showReviewersDialog, setShowReviewersDialog] = useState(false);
  const [reviewersForProject, setReviewersForProject] = useState([]);
  const [reviewRequests, setReviewRequests] = useState([]);
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [dropdownHover, setDropdownHover] = useState(false);
  const pendingReviewRef = useRef(null);
  const navigate = useNavigate();

  // Effects

  // 1. IP Address
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await axios.get("https://api.ipify.org?format=json");
        setIpAddress(response.data.ip);
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };
    fetchIpAddress();
  }, []);

  // 2. Auth Check & User Profile
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      if (!token) {
        navigate('/signin');
        return;
      }

      const user = authService.getCurrentUser();
      if (user) {
        setUserId(user.id || 'current-user');
        setUserName(user.name || user.fullName || 'Researcher');

        // We assume profile exists if user is logged in for now, or check via API
        setHasProfile(true);
      } else {
        // Fallback verification via API
        try {
          const profile = await authService.getProfile();
          if (profile) {
            setUserId(profile.id);
            setUserName(profile.full_name || profile.name);
            setHasProfile(true);
          }
        } catch (e) {
          navigate('/signin');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  // 3. Fetch Data
  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        console.log("Fetching listings and friends...");
        const allResponse = await listingService.getAllListings();
        setAllListings(allResponse.listings || []);

        const myResponse = await listingService.getMyListings();
        setMyListings(myResponse.listings || []);

        // Fetch Friends & Requests
        const friendsData = await friendService.getFriends();
        setFriends(friendsData.friends || []);

        const requestsData = await friendService.getRequests();
        setFriendRequests(requestsData.requests || []);

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // toast.error("Could not load listings"); // Optional: don't spam if backend is offline
      }
    };
    fetchData();

    // Placeholder: Fetch Messages
    setMessages([]);
    setReviewRequests([]);
    // Collab listings logic to be implemented
    setCollabListings([]);

  }, [userId]);


  useEffect(() => {
    setFilteredListings(myListings);
  }, [myListings]);

  // Handlers
  const handleAcceptReviewRequest = async (requestId) => {
    toast.info("Feature unavailable during system migration.");
  };

  const handleDeclineReviewRequest = async (requestId) => {
    toast.info("Feature unavailable during system migration.");
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setDropdownVisible(false);
      return;
    }
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = allListings.filter(item => {
      const title = item.title?.toLowerCase() || '';
      const researcherName = item.researcherName?.toLowerCase() || '';
      return title.includes(searchTermLower) || researcherName.includes(searchTermLower);
    });
    setSearchResults(filtered);
    setDropdownVisible(true);
    setShowNoResults(filtered.length === 0);
  };

  const markMessageAsRead = async (messageId) => {
    // Stub
  };

  const handleMessageClick = (message) => {
    // Stub
    setSelectedMessage(message);
  };

  const handleAddListing = () => {
    navigate('/researcher/add-listing');
    // Warning: Add Listing page might also need migration!
  };

  const handleCollaborate = () => navigate('/researcher/collaborate');

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setDropdownVisible(false);
    clearTimeout(dropdownTimeout.current);
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setDropdownVisible(false);
  };

  const logEvent = async ({ userId, role, userName, action, details, ip, target }) => {
    // Stub - logging to firestore removed
    console.log("Log Event:", { userId, role, userName, action, details });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/signin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleAcceptCollab = async (message) => {
    if (message.type === 'friend-request') {
      try {
        await friendService.acceptRequest(message.id);
        toast.success("Friend request accepted!");

        // Refresh data
        const friendsData = await friendService.getFriends();
        setFriends(friendsData.friends || []);
        setFriendRequests(prev => prev.filter(r => r.id !== message.id));
      } catch (err) {
        toast.error(err.message || "Failed to accept");
      }
      return;
    }

    toast.info("Collaboration feature currently unavailable.");
  };

  const handleRejectCollab = async (message) => {
    if (message.type === 'friend-request') {
      // Reject logic (not strictly in backend yet, but we can treat as ignore or add reject endpoint later)
      toast.info("Request ignored temporarily."); // Todo: implement reject endpoint
      return;
    }
    toast.info("Collaboration feature currently unavailable.");
  };

  const handleClearNotifications = async () => {
    setMessages([]);
    // Don't clear friend requests from just clicking "clear" usually, but for now we keep UI simple
  };

  // Combine messages + review requests (stubbed)
  // Combine friend requests into notifications
  const combinedNotifications = [
    ...friendRequests.map(req => ({
      id: req.id,
      title: "Friend Request",
      content: `${req.full_name} (${req.email}) sent you a friend request.`,
      timestamp: new Date(req.created_at),
      read: false,
      type: 'friend-request',
      senderName: req.full_name
    })),
    ...messages
  ];

  const handleShowReviewers = async (listingId) => {
    toast.info("Reviewers feature currently unavailable.");
  };

  const handleToggleSummary = (id) => {
    setExpandedSummaries(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDropdownMouseEnter = () => setDropdownHover(true);
  const handleDropdownMouseLeave = () => {
    setDropdownHover(false);
    setDropdownVisible(false);
  };

  const handleDeleteListing = async () => {
    if (!listingToDelete) return;
    try {
      await listingService.deleteListing(listingToDelete);
      toast.success("Listing deleted successfully");
      setMyListings(prev => prev.filter(item => item.id !== listingToDelete));
      setAllListings(prev => prev.filter(item => item.id !== listingToDelete));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete listing");
    } finally {
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  return {
    allListings, setAllListings,
    myListings, setMyListings,
    userId, setUserId,
    hasProfile, setHasProfile,
    collabListings, setCollabListings,
    searchTerm, setSearchTerm,
    searchResults, setSearchResults,
    dropdownVisible, setDropdownVisible,
    showNoResults, setShowNoResults,
    dropdownTimeout,
    filteredListings, setFilteredListings,
    userName, setUserName,
    messages, setMessages,
    friends, setFriends, // Exported
    friendRequests, setFriendRequests, // Exported
    showContactForm, setShowContactForm,
    ipAddress, setIpAddress,
    anchorEl, setAnchorEl,
    selectedMessage, setSelectedMessage,
    cardMenuAnchor, setCardMenuAnchor,
    cardMenuId, setCardMenuId,
    showReviewersDialog, setShowReviewersDialog,
    reviewersForProject, setReviewersForProject,
    reviewRequests, setReviewRequests,
    expandedSummaries, setExpandedSummaries,
    deleteDialogOpen, setDeleteDialogOpen,
    listingToDelete, setListingToDelete,
    dropdownHover, setDropdownHover,
    pendingReviewRef,
    handleAcceptReviewRequest,
    handleDeclineReviewRequest,
    handleSearch,
    markMessageAsRead,
    handleMessageClick,
    handleAddListing,
    handleCollaborate,
    handleInputChange,
    handleClear,
    logEvent,
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
  };
}