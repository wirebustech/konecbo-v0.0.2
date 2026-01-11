// TermsAndConditions.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TermsAndConditions.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <section className="home-container">
      <Navbar />
      <button 
        onClick={() => navigate(-1)} 
        style={{
          position: "absolute",
          top: "6rem",
          left: "2rem",
          zIndex: 100,
          padding: "0.5rem 1rem",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          border: "1px solid rgba(46, 125, 50, 0.2)",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "0.9rem",
          color: "#1B5E20",
          fontWeight: 500,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <ArrowBackIosIcon style={{ fontSize: "1rem", verticalAlign: "middle" }} /> Back
      </button>

      {/* Hero Section */}
      <section className="home-banner-container" style={{ paddingTop: "2rem", marginBottom: "3rem" }}>
        <article className="home-text-section" style={{ flex: "1.5" }}>
          <header>
            <p style={{ fontSize: "1rem", color: "#FF6B35", fontWeight: 600, marginBottom: "0.5rem" }}>
              Terms and Conditions
            </p>
            <h1 className="primary-heading">
              Our Terms of Service
            </h1>
          </header>
          <p className="primary-text">
            By accessing and using Konecbo, you agree to be bound by these Terms and Conditions. Please read them carefully to understand your rights and responsibilities when using our platform.
          </p>
          <p className="primary-text" style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666", fontStyle: "italic" }}>
            Last Updated: November 1, 2025
          </p>
        </article>
        <figure className="home-image-section" style={{ flex: "1" }}>
          <div style={{ 
            width: "100%", 
            height: "300px", 
            backgroundColor: "#F1F8F4", 
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(46, 125, 50, 0.2)"
          }}>
            <span style={{ fontSize: "3rem", color: "#1B5E20" }}>📋</span>
          </div>
        </figure>
      </section>

      {/* Content Sections */}
      <section className="platform-overview" style={{ padding: "4rem 2rem", backgroundColor: "#F1F8F4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Key Terms Overview */}
          <section style={{ marginBottom: "3rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1B5E20" }}>1. Agreement to Terms</h2>
                <p style={{ color: "#424242", lineHeight: "1.8" }}>By accessing and using Konecbo ("the Platform"), you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the Platform.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1B5E20" }}>2. Eligibility</h2>
                <p style={{ color: "#424242", marginBottom: "1rem" }}>To use Konecbo, you must:</p>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Be at least 18 years of age</li>
                  <li>Be engaged in legitimate research activities</li>
                  <li>Have the authority to enter into this agreement</li>
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1B5E20" }}>3. User Accounts</h2>
                <p style={{ color: "#424242", marginBottom: "0.5rem" }}><strong style={{ color: "#FF6B35" }}>Account Creation:</strong> You are responsible for maintaining account confidentiality and providing accurate information.</p>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Account Termination:</strong> You may close your account at any time. We reserve the right to terminate accounts that violate these terms.</p>
              </div>
            </div>
          </section>

          {/* User Conduct */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              4. User Conduct and Responsibilities
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Users Agree To:</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Use the Platform for legitimate research collaboration purposes</li>
                  <li>Respect intellectual property rights of others</li>
                  <li>Maintain professional and respectful communication</li>
                  <li>Provide accurate information about expertise and credentials</li>
                  <li>Honor collaboration commitments made through the Platform</li>
                  <li>Report inappropriate behavior or content</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Users Agree NOT To:</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Post false, misleading, or fraudulent information</li>
                  <li>Impersonate others or misrepresent affiliations</li>
                  <li>Harass, abuse, or threaten other users</li>
                  <li>Share sensitive research information without proper authorization</li>
                  <li>Use the Platform for commercial solicitation unrelated to research</li>
                  <li>Attempt to compromise Platform security</li>
                  <li>Scrape or automatically collect data from the Platform</li>
                  <li>Violate any applicable laws or regulations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content and IP */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              5. Content and Intellectual Property
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Your Content</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>You retain ownership of content you post</li>
                  <li>You grant Konecbo a license to display and distribute your content within the Platform</li>
                  <li>You represent that you have rights to share posted content</li>
                  <li>You are responsible for the accuracy of your content</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Konecbo's Property</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>The Platform, its design, and features are owned by Konecbo</li>
                  <li>Our trademarks and branding are protected</li>
                  <li>You may not copy, modify, or reverse engineer the Platform</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Research Content</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Research ideas and methodologies shared remain your intellectual property</li>
                  <li>We recommend formal collaboration agreements for significant projects</li>
                  <li>Konecbo is not responsible for disputes over research ownership</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Research Collaboration */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              6. Research Collaboration
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Nature of Relationship</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Konecbo facilitates connections but is not party to collaborations</li>
                  <li>Users are responsible for their own collaboration agreements</li>
                  <li>We recommend formalizing significant collaborations in writing</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Collaboration Agreements</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Users should clearly define roles, responsibilities, and expectations</li>
                  <li>Authorship, data ownership, and IP rights should be agreed upon</li>
                  <li>Payment or compensation arrangements are between users</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Dispute Resolution</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Konecbo provides mediation support but does not arbitrate disputes</li>
                  <li>Users are encouraged to resolve conflicts professionally</li>
                  <li>Repeated violations may result in account suspension</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Star System & Premium Features */}
          <section style={{ marginBottom: "3rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1B5E20" }}>7. Star System</h2>
                <p style={{ color: "#424242", marginBottom: "0.5rem" }}><strong style={{ color: "#FF6B35" }}>Earning Stars:</strong> Contributor Stars for posting projects, Collaborator Stars for joining projects.</p>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Star Integrity:</strong> Attempting to artificially inflate ratings violates these terms.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1B5E20" }}>8. Premium Features</h2>
                <p style={{ color: "#424242", marginBottom: "0.5rem" }}><strong style={{ color: "#FF6B35" }}>Free Services:</strong> Basic Platform access and core collaboration features are freely available.</p>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Premium Features:</strong> Enhanced visibility, advanced search, priority support, and additional storage.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", color: "#1B5E20" }}>9. Privacy</h2>
                <p style={{ color: "#424242" }}>Your use of the Platform is also governed by our <Link to="/privacy-policy" style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</Link>, which is incorporated into these Terms by reference.</p>
              </div>
            </div>
          </section>

          {/* Legal Information */}
          <section style={{ backgroundColor: "#1B5E20", color: "#FFFFFF", padding: "3rem 2rem", borderRadius: "8px", borderTop: "4px solid #FF6B35" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", textAlign: "center" }}>Legal Information</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#FF6B35" }}>Disclaimers & Liability</h3>
                <p style={{ lineHeight: "1.8", fontSize: "0.95rem" }}>Konecbo is provided "as is" without warranties. We do not guarantee successful collaborations or uninterrupted service. Liability is limited to amounts paid in the past 12 months.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#FF6B35" }}>Governing Law</h3>
                <p style={{ lineHeight: "1.8", fontSize: "0.95rem" }}>These Terms are governed by the laws of the State of California, USA. Disputes should be addressed to support@konecbo.com. Mediation may be required before litigation.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#FF6B35" }}>Termination</h3>
                <p style={{ lineHeight: "1.8", fontSize: "0.95rem" }}>You may close your account at any time. We may suspend or terminate accounts that violate these Terms. We may discontinue the Platform with 90 days' notice.</p>
              </div>
            </div>
            <div style={{ marginTop: "2rem", textAlign: "center", paddingTop: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}>
              <p style={{ marginBottom: "0.5rem" }}><strong>Contact Information:</strong></p>
              <p style={{ marginBottom: "0.5rem" }}><strong>Email:</strong> legal@konecbo.com</p>
              <p><strong>Address:</strong> Konecbo Legal Department, 1250 Innovation Drive, Suite 400, San Francisco, CA 94103</p>
            </div>
          </section>
        </div>
      </section>
      
      <Footer />
    </section>
  );
};

export default TermsAndConditions;