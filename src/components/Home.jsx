// Home Component for Konecbo
import React from "react";
import { Link } from "react-router-dom";
import BannerImage from "../assets/home-banner-image.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <section className="home-container">
      <Navbar />
      <section className="home-banner-container">
        <figure className="home-bannerImage-container">
          <img
          src="/favicon.ico"
          alt="Konecbo Logo"
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "2px solid #FF6B35",
            objectFit: "cover"
          }}
        />
        </figure>
        <article className="home-text-section">
          <header>
            <h1 className="primary-heading">
              Where Research Minds Meet and Innovation Begins
            </h1>
          </header>
          <p className="primary-text">
            Connect with researchers worldwide, find the perfect collaborators for your projects, and accelerate breakthrough discoveries together.
          </p>
          <nav>
            <Link to="/signup" className="secondary-button">
              Get Started Free <FiArrowRight />
            </Link>
            <Link to="/learn-more" className="secondary-button">
              Explore Research Projects <FiArrowRight />
            </Link>
          </nav>
        </article>
        <figure className="home-image-section">
          <img src={BannerImage} alt="Researcher Collaboration Visual" />
        </figure>
      </section>
      
      {/* Platform Overview Section */}
      <section className="platform-overview" style={{ padding: "4rem 2rem", backgroundColor: "#F1F8F4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: "1rem", color: "#1B5E20" }}>
            Connecting Researchers, Accelerating Discovery
          </h2>
          <p style={{ textAlign: "center", fontSize: "1.1rem", color: "#424242", marginBottom: "3rem", maxWidth: "800px", margin: "0 auto 3rem" }}>
            Konecbo is the premier global platform designed exclusively for researchers seeking meaningful collaboration. Whether you're launching groundbreaking research or looking to contribute your expertise to innovative projects, Konecbo connects you with the right people at the right time.
          </p>
          
          {/* How It Works */}
          <section style={{ marginBottom: "3rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>How It Works</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1B5E20" }}>1. Post Your Research</h4>
                <p style={{ color: "#424242" }}>Share your ongoing or upcoming research projects with the global research community. Detail your objectives, methodology, and the specific expertise you need from collaborators.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1B5E20" }}>2. Build Your Profile</h4>
                <p style={{ color: "#424242" }}>Create a comprehensive researcher profile highlighting your areas of expertise, past publications, skills, and the types of projects you're interested in joining.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1B5E20" }}>3. Connect & Collaborate</h4>
                <p style={{ color: "#424242" }}>Browse available research opportunities, reach out to potential collaborators, or respond to collaboration requests. Once connected, use our platform to discuss and plan your research partnership.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h4 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#1B5E20" }}>4. Earn Recognition</h4>
                <p style={{ color: "#424242" }}>Gain Contributor Stars for each research project you post and Collaborator Stars for every project you join, building your reputation in the research community.</p>
              </div>
            </div>
          </section>

          {/* Platform Features */}
          <section style={{ marginBottom: "3rem" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>Platform Features</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
              <div style={{ padding: "1rem" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Smart Matching:</strong> Our algorithm connects researchers based on expertise, interests, and complementary skills</p>
              </div>
              <div style={{ padding: "1rem" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Secure Messaging:</strong> Discuss project details and collaboration terms privately</p>
              </div>
              <div style={{ padding: "1rem" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Research Repository:</strong> Access a growing database of active research opportunities across all disciplines</p>
              </div>
              <div style={{ padding: "1rem" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Profile Showcase:</strong> Highlight your academic credentials, publications, and research interests</p>
              </div>
              <div style={{ padding: "1rem" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Collaboration Management:</strong> Track your active collaborations and manage communication efficiently</p>
              </div>
              <div style={{ padding: "1rem" }}>
                <p style={{ color: "#424242" }}><strong style={{ color: "#FF6B35" }}>Star Recognition System:</strong> Build credibility through Contributor and Collaborator Stars</p>
              </div>
            </div>
          </section>

          {/* By The Numbers */}
          <section style={{ backgroundColor: "#1B5E20", color: "#FFFFFF", padding: "3rem 2rem", borderRadius: "8px", textAlign: "center", borderTop: "4px solid #FF6B35" }}>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "2rem" }}>By The Numbers</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
              <div>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>50,000+</div>
                <div style={{ fontSize: "1rem" }}>Researchers Worldwide</div>
              </div>
              <div>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>15,000+</div>
                <div style={{ fontSize: "1rem" }}>Active Research Projects</div>
              </div>
              <div>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>120+</div>
                <div style={{ fontSize: "1rem" }}>Countries Represented</div>
              </div>
              <div>
                <div style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>85%</div>
                <div style={{ fontSize: "1rem" }}>Successful Collaboration Rate</div>
              </div>
            </div>
          </section>
        </div>
      </section>
      
      <Footer />
    </section>
  );
};

export default Home;
