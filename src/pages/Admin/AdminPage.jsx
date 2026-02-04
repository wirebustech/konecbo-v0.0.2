import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import ViewLogs from "./ViewLogs";
import ManageResearchers from "./ManageResearchers";
import ManageReviewers from "./ManageReviewers";
import ManageAdmins from "./ManageAdmins";
import SystemSettings from "./SystemSettings"; // New
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
        {activeTab === "admins" && <ManageAdmins />}
        {activeTab === "settings" && <SystemSettings />} {/* New Tab */}
      </main>
    </div>
  );
}