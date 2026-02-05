// App.js - Main application entry point and route configuration
// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignInPageHybrid from "./pages/SignInPageHybrid";
import SignUpPage from "./pages/SignUpPage";
import SignUpPageSimple from "./pages/SignUpPageSimple";
import LandingPage from "./pages/LandingPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import About from "./components/About";
import LearnMore from "./pages/LearnMore";
import { useLocation } from 'react-router-dom';
// Admin
import AdminPage from "./pages/Admin/AdminPage";
import ViewLogs from "./pages/Admin/ViewLogs";

// Reviewer
import ReviewerPage from "./pages/Reviewer/ReviewerPage";
import ReviewerForm from "./pages/Reviewer/ReviewerForm";      // reviewer signup/apply form
import ReviewForm from "./components/ReviewForm";          // actual review submission form
import TermsAndConditions from "./pages/TermsAndConditions";
import ReviewerProfile from "./pages/Reviewer/ReviewerProfile"; // Reviewer profile page
import EditReviewerProfile from "./pages/Reviewer/EditReviewerProfile"; // Reviewer profile edit page

// Researcher
import ListingDetailPage from "./pages/Researcher/ListingDetailPage";
import NotificationHandler from './components/NotificationHandler';
import ResearcherDashboard from "./pages/Researcher/ResearcherDashboard";
import ResearcherProfile from "./pages/Researcher/ResearcherProfile";
import EditProfile from "./pages/Researcher/EditProfile";
import AddListing from "./pages/Researcher/AddListing";
import EditListing from "./pages/Researcher/EditListing";
import CollaboratePage from "./pages/Researcher/CollaboratePage";
import ChatRoom from "./pages/Researcher/ChatRoom";
import FriendsSystem from './components/FriendsSystem';
import CollaborationDashboard from "./pages/Researcher/CollaborationDashboard";
import FriendProfile from "./components/FriendProfile";
// Removed duplicate import


import axios from "axios";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ProtectedRoute: Only allows access if authToken is present
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/signin" />;
};

function App() {
  // Fetch IP for logging user login events
  const fetchIpAddress = async () => {
    try {
      const { data } = await axios.get("https://api.ipify.org?format=json");
      return data.ip;
    } catch {
      return "N/A";
    }
  };
  const location = useLocation();

  return (
    <>
      {/* Handles real-time notifications and toast messages */}
      <NotificationHandler />
      <ToastContainer position="bottom-right" />

      {/* Application routes */}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPageHybrid />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signup-simple" element={<SignUpPageSimple />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/friend-profile/:userId" element={<FriendProfile />} />
        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <ProtectedRoute>
              <ViewLogs />
            </ProtectedRoute>
          }
        />

        {/* Footer / Legal */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />


        {/* Reviewer routes */}
        <Route
          path="/reviewer"
          element={
            <ProtectedRoute>
              <ReviewerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reviewer/edit-profile"
          element={
            <ProtectedRoute>
              <EditReviewerProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/reviewer-profile" element={<ReviewerProfile />} />
        <Route path="/reviewer-form" element={<ReviewerForm />} />
        <Route path="/reviewer/apply" element={<ReviewerForm />} />
        <Route
          path="/review/:listingId"
          element={
            <ProtectedRoute>
              <ReviewForm />
            </ProtectedRoute>
          }
        />

        {/* Researcher routes */}
        <Route
          path="/researcher-dashboard"
          element={
            <ProtectedRoute>
              <ResearcherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher-profile"
          element={
            <ProtectedRoute>
              <ResearcherProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher-edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/add-listing"
          element={
            <ProtectedRoute>
              <AddListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/edit-listing/:id"
          element={
            <ProtectedRoute>
              <EditListing />
            </ProtectedRoute>
          }
        />
        <Route
          path="/listing/:id"
          element={
            <ProtectedRoute>
              <ListingDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/researcher/collaborate"
          element={
            <ProtectedRoute>
              <CollaboratePage />
            </ProtectedRoute>
          }
        />
        <Route path="/chat/:chatId" element={<ChatRoom />} />
        <Route path="/friends" element={<FriendsSystem />} />
        <Route
          path="/collaboration/:chatId"
          element={
            <CollaborationDashboard
              userRole={location.state?.userRole || 'reviewer'}
            />} />

        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
