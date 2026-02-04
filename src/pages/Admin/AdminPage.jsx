import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import ViewLogs from "./ViewLogs";
import ManageResearchers from "./ManageResearchers";
import ManageReviewers from "./ManageReviewers";
import ManageReviews from "./ManageReviews";
import ManageAdmins from "./ManageAdmins";
import SystemSettings from "./SystemSettings";
import AdminProfile from "./AdminProfile";
import ReviewerPage from "../Reviewer/ReviewerPage"; // Integrating Reviewer Portal directly 
import ChatWidget from "../../components/Chat/ChatWidget";
import "./AdminPage.css";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="admin-page-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1A2E40' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="admin-content" style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "logs" && <ViewLogs />}
        {activeTab === "researchers" && <ManageResearchers />}
        {activeTab === "reviewers" && <ManageReviewers />}
        {activeTab === "reviews" && <ManageReviews />}
        {activeTab === "admins" && <ManageAdmins />}
        {activeTab === "settings" && <SystemSettings />}
        {activeTab === "profile" && <AdminProfile />}
        {activeTab === "reviewer_portal" && (
          <div style={{ background: '#F0F2F5', minHeight: '100%', borderRadius: 8, padding: 10 }}>
            {/* We wrap ReviewerPage to isolate scope if needed */}
            <ReviewerPage adminView={true} />
          </div>
        )}
        <ChatWidget currentUserRole="admin" />
      </main>
    </div>
  );
}