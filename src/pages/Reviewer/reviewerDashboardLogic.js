import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../../services/authService';
import listingService from '../../services/listingService'; // Added import
import { toast } from 'react-toastify';

export const useReviewerDashboard = () => {
  const [status, setStatus] = useState('active');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [ipAddress, setIpAddress] = useState('');
  const [notif, setNotif] = useState({ open: false, msg: '', severity: 'info' });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [allListings, setAllListings] = useState([]);
  const [requestedIds, setRequestedIds] = useState([]);
  const [reviewedIds, setReviewedIds] = useState([]);
  const dropdownTimeout = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const navigate = useNavigate();

  // Fetch client IP
  useEffect(() => {
    axios
      .get('https://api.ipify.org?format=json')
      .then(res => setIpAddress(res.data.ip))
      .catch(err => console.error('Error fetching IP:', err));
  }, []);

  // Check Auth and Fetch Data
  useEffect(() => {
    const init = async () => {
      const token = authService.getToken();
      if (!token) {
        navigate('/signin');
        return;
      }

      try {
        setLoading(true);
        // FETCH PENDING LISTINGS INSTEAD OF ACTIVE
        const data = await listingService.getPendingListings();
        if (data.success) {
          setAllListings(data.listings || []);
        }
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        toast.error("Failed to load pending listings");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  // Search logic
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setShowNoResults(false);
      setDropdownVisible(false);
      return;
    }
    const searchTermLower = searchTerm.toLowerCase();
    const filtered = allListings.filter(item => {
      const title = item.title?.toLowerCase() || '';
      const summary = item.summary?.toLowerCase() || '';
      return title.includes(searchTermLower) || summary.includes(searchTermLower);
    });
    setSearchResults(filtered);
    setDropdownVisible(true);
    setShowNoResults(filtered.length === 0);
    clearTimeout(dropdownTimeout.current);
    dropdownTimeout.current = setTimeout(() => {
      setDropdownVisible(false);
    }, 5000);
  };

  const handleInputChange = e => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults([]);
      setShowNoResults(false);
      setDropdownVisible(false);
    } else {
      handleSearch();
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim()) {
      setDropdownVisible(true);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowNoResults(false);
    setDropdownVisible(false);
  };

  const handleRevoke = async () => {
    toast.info("Revoke application feature unavailable.");
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/signin');
  };

  const handleApprove = async (listingId) => {
    try {
      await listingService.approveListing(listingId);
      toast.success("Listing approved and live!");
      // Remove from local list
      setAllListings(prev => prev.filter(l => l.id !== listingId));
    } catch (e) {
      toast.error("Failed to approve listing");
    }
  };

  const handleReject = async (listingId) => {
    try {
      await listingService.rejectListing(listingId);
      toast.info("Listing rejected.");
      setAllListings(prev => prev.filter(l => l.id !== listingId));
    } catch (e) {
      toast.error("Failed to reject listing");
    }
  };

  return {
    status,
    reason,
    loading,
    ipAddress,
    notif,
    searchTerm,
    searchResults,
    dropdownVisible,
    showNoResults,
    allListings,
    requestedIds,
    reviewedIds,
    sidebarOpen,
    menuAnchorEl,
    setSidebarOpen,
    setMenuAnchorEl,
    setNotif,
    handleSearch,
    handleInputChange,
    handleInputFocus,
    handleClear,
    handleRevoke,
    handleLogout,
    handleApprove,
    handleReject
  };
};