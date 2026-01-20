import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

export const useReviewerDashboard = () => {
  const [status, setStatus] = useState('');
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

  // Check Auth
  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      navigate('/signin');
      return;
    }
    setLoading(false);
  }, [navigate]);

  // Stub data fetching
  useEffect(() => {
    // Mock data or empty
    setAllListings([]);
    setRequestedIds([]);
    setReviewedIds([]);
    setStatus('in_progress'); // Mock status
  }, []);

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
      const researcherName = item.researcherName?.toLowerCase() || '';
      return title.includes(searchTermLower) || researcherName.includes(searchTermLower);
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
      setDropdownVisible(true);
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
    toast.info("Feature unavailable.");
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/signin');
  };

  const handleRequestReviewAndNotify = async (listing) => {
    toast.info("Feature unavailable.");
  };

  return {
    // State
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
    // Setters
    setSidebarOpen,
    setMenuAnchorEl,
    setNotif,
    // Handlers
    handleSearch,
    handleInputChange,
    handleInputFocus,
    handleClear,
    handleRevoke,
    handleLogout,
    handleRequestReviewAndNotify,
  };
};