import { useNavigate } from "react-router-dom";
import './TermsAndConditions.css';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
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
      <section className="home-banner-container" style={{ paddingTop: "4rem", marginBottom: "3rem", marginLeft: "5rem" }}>
        <article className="home-text-section" style={{ flex: "1.5" }}>
          <header>
            <p style={{ fontSize: "1rem", color: "#FF6B35", fontWeight: 600, marginBottom: "0.5rem" }}>
              Privacy Policy
            </p>
            <h1 className="primary-heading">
              Your Privacy Matters
            </h1>
          </header>
          <p className="primary-text">
            At Konecbo, we are committed to protecting your privacy and ensuring the security of your personal information. This policy explains how we collect, use, and safeguard your data when you use our platform.
          </p>
          <p className="primary-text" style={{ marginTop: "1rem", fontSize: "0.9rem", color: "#666", fontStyle: "italic" }}>
            Last Updated: November 1, 2025
          </p>
        </article>
        <figure className="home-image-section" style={{ flex: "1" }}>
          <div style={{ 
            width: "95%", 
            height: "300px", 
            backgroundColor: "#F1F8F4", 
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid rgba(46, 125, 50, 0.2)"
          }}>
            <span style={{ fontSize: "3rem", color: "#1B5E20" }}>🔒</span>
          </div>
        </figure>
      </section>

      {/* Content Sections */}
      <section className="platform-overview" style={{ padding: "4rem 2rem", backgroundColor: "#F1F8F4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* Information We Collect */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              Information We Collect
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Personal Information</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Name, email address, and contact information</li>
                  <li>Academic credentials and institutional affiliation</li>
                  <li>Research interests and expertise areas</li>
                  <li>Profile information including biography and publications</li>
                  <li>Communication preferences</li>
                  <li>Payment information (for premium features)</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Automatically Collected</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Device information and IP address</li>
                  <li>Browser type and operating system</li>
                  <li>Usage data and platform interactions</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Log data and analytics information</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Research-Related</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Research project descriptions and collaboration calls</li>
                  <li>Messages and communications with other users</li>
                  <li>Collaboration history and star ratings</li>
                  <li>Publication lists and research outputs</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              How We Use Your Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Platform Services:</strong> Provide and maintain the Konecbo platform, create and manage your account</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Connections:</strong> Facilitate connections between researchers and match with collaboration opportunities</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Communication:</strong> Process transactions, send notifications, and respond to inquiries</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Improvement:</strong> Improve our services through analytics and communicate platform updates</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Security:</strong> Detect and prevent fraud or abuse, comply with legal obligations</p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              Information Sharing and Disclosure
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>With Other Users</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Your profile information is visible to other registered users</li>
                  <li>Research project postings are publicly visible within the platform</li>
                  <li>Messages are only visible to conversation participants</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>With Third Parties</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Service providers who assist in platform operations</li>
                  <li>Payment processors for transaction handling</li>
                  <li>Analytics services for platform improvement</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>We Never</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Sell your personal information to third parties</li>
                  <li>Share your private messages without consent</li>
                  <li>Disclose sensitive research information without permission</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Data Security & Rights */}
          <section style={{ marginBottom: "3rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Data Security</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and assessments</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure data storage infrastructure</li>
                  <li>Regular backups and disaster recovery procedures</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Your Rights and Choices</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data in portable format</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Control profile visibility settings</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Regional Privacy Rights */}
          <section style={{ backgroundColor: "#1B5E20", color: "#FFFFFF", padding: "3rem 2rem", borderRadius: "8px", borderTop: "4px solid #FF6B35" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", textAlign: "center" }}>Regional Privacy Rights</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#FF6B35" }}>European Users (GDPR)</h3>
                <p style={{ lineHeight: "1.8" }}>You have additional rights under GDPR including data portability, right to be forgotten, and the right to lodge complaints with supervisory authorities.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#FF6B35" }}>California Users (CCPA)</h3>
                <p style={{ lineHeight: "1.8" }}>California residents have rights regarding access to and deletion of personal information under the California Consumer Privacy Act.</p>
              </div>
            </div>
            <div style={{ marginTop: "2rem", textAlign: "center", paddingTop: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}>
              <p style={{ marginBottom: "0.5rem" }}><strong>Contact Us About Privacy:</strong></p>
              <p style={{ marginBottom: "0.5rem" }}><strong>Email:</strong> privacy@konecbo.com</p>
              <p><strong>Address:</strong> Data Protection Officer, Konecbo, 1250 Innovation Drive, Suite 400, San Francisco, CA 94103</p>
            </div>
          </section>
        </div>
      </section>
      
      <Footer />
    </section>
  );
};

export default PrivacyPolicy;
