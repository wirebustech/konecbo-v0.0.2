import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { toast } from 'react-toastify';
import './ResearcherDashboard.css';

function AddListing() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.info("The 'Add Listing' feature is currently unavailable while we migrate our database. Please check back later.");
  };

  return (
    <main className="researcher-dashboard">
      <header className="researcher-header">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          style={{ color: 'var(--white)', marginRight: '1.5rem' }}
        >
          <ArrowBackIosIcon />
        </button>
        <section className="header-title">
          <h1>New Research</h1>
          <p>Create a new research listing.</p>
        </section>
      </header>

      <section className="dashboard-content">
        <div style={{ padding: '2rem', textAlign: 'center', background: 'white', borderRadius: '1rem' }}>
          <h2>System Update in Progress</h2>
          <p>We are migrating our database system. New listings cannot be created at this time.</p>
          <button onClick={() => navigate('/researcher-dashboard')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Back to Dashboard
          </button>
        </div>
      </section>
    </main>
  );
}

export default AddListing;