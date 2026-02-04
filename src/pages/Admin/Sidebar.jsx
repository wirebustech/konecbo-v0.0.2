//Sidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import authService from "../../services/authService";
import './Sidebar.css';

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      navigate("/signin");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <aside className={`sidebar${isCollapsed ? " collapsed" : " expanded"}`}>
      <section>
        <header className="sidebar-toggle-container">
          {!isCollapsed && (
            <button
              className="sidebar-toggle-btn"
              onClick={() => setActiveTab("dashboard")}
            >
              <FaHome />
            </button>
          )}
          <button
            className="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            ☰
          </button>
        </header>
        {!isCollapsed && (
          <>
            <button
              className={`sidebar-nav-btn${activeTab === "logs" ? " active" : ""}`}
              onClick={() => setActiveTab("logs")}
            >
              <span className="sidebar-nav-text">View Logs</span>
            </button>
            <button
              className={`sidebar-nav-btn${activeTab === "researchers" ? " active" : ""}`}
              onClick={() => setActiveTab("researchers")}
            >
              <span className="sidebar-nav-text">Manage Researchers</span>
            </button>
            <button
              className={`sidebar-nav-btn${activeTab === "reviewers" ? " active" : ""}`}
              onClick={() => setActiveTab("reviewers")}
            >
              <span className="sidebar-nav-text">Manage Reviewers</span>
            </button>
            <button
              className={`sidebar-nav-btn${activeTab === "admins" ? " active" : ""}`}
              onClick={() => setActiveTab("admins")}
            >
              <span className="sidebar-nav-text">Manage Admin</span>
            </button>
            <button
              className={`sidebar-nav-btn${activeTab === "settings" ? " active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="sidebar-nav-text">System Settings</span>
            </button>
            <button
              className={`sidebar-nav-btn${activeTab === "reviewer_portal" ? " active" : ""}`}
              onClick={() => setActiveTab("reviewer_portal")}
            >
              <span className="sidebar-nav-text">Reviewer Portal</span>
            </button>
          </>
        )}
      </section>
      {!isCollapsed && (
        <footer>
          <button
            className={`sidebar-nav-btn${activeTab === "profile" ? " active" : ""}`}
            onClick={() => setActiveTab("profile")}
            style={{ marginBottom: 10, background: 'rgba(255,255,255,0.05)' }}
          >
            <span className="sidebar-nav-text">My Account</span>
          </button>
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <span className="sidebar-nav-text">Logout</span>
          </button>
        </footer>
      )}
    </aside>
  );
}
