import './TermsAndConditions.css';
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LearnMoreImage from "../assets/learn-more-transparent.png";


const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <section className="home-container">
      <Navbar />
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "6rem",
          left: "5rem",
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

      {/* Hero Section - Modernized Layout */}
      <section style={{
        backgroundColor: "#f9f9f9",
        padding: "5rem 2rem",
        display: "flex",
        justifyContent: "center",
        overflow: "hidden"
      }}>
        <div style={{
          maxWidth: "1200px",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4rem",
          flexWrap: "wrap"
        }}>
          <article style={{ flex: "1 1 500px", minWidth: "300px" }}>
            <header>
              <p style={{
                fontSize: "1rem",
                color: "#FF6B35",
                fontWeight: 700,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "1rem"
              }}>
                Learn More
              </p>
              <h1 style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                color: "#1B5E20",
                lineHeight: "1.2",
                fontWeight: 800,
                marginBottom: "1.5rem"
              }}>
                Deep Dive into Konecbo
              </h1>
            </header>
            <p style={{
              fontSize: "1.125rem",
              color: "#4a4a4a",
              lineHeight: "1.7",
              marginBottom: "1.5rem"
            }}>
              Discover how Konecbo empowers researchers to connect, collaborate, and accelerate scientific discovery. Whether you're seeking collaborators or looking to join exciting research projects, this guide will help you make the most of our platform.
            </p>
          </article>
          <figure style={{
            flex: "1 1 400px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: 0,
            position: "relative"
          }}>
            <img
              src={LearnMoreImage}
              alt="Deep Dive into Konecbo"
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.1))",
                borderRadius: "12px"
              }}
            />
          </figure>
        </div>
      </section>

      {/* Content Sections */}
      <section className="platform-overview" style={{ padding: "4rem 2rem", backgroundColor: "#F1F8F4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          {/* For Researchers Seeking Collaborators */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              For Researchers Seeking Collaborators
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Step 1: Create Your Project Posting</h3>
                <p style={{ color: "#424242", marginBottom: "1rem" }}>When you have a research project that needs additional expertise, create a detailed collaboration call:</p>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li><strong style={{ color: "#FF6B35" }}>Project Title & Summary:</strong> Give your research a clear, compelling title and brief overview</li>
                  <li><strong style={{ color: "#FF6B35" }}>Research Objectives:</strong> Outline what you're trying to achieve</li>
                  <li><strong style={{ color: "#FF6B35" }}>Methodology:</strong> Describe your research approach</li>
                  <li><strong style={{ color: "#FF6B35" }}>Required Expertise:</strong> Specify the skills, knowledge, or resources you need</li>
                  <li><strong style={{ color: "#FF6B35" }}>Time Commitment:</strong> Indicate expected duration and intensity</li>
                  <li><strong style={{ color: "#FF6B35" }}>Collaboration Type:</strong> Full partnership, specific task contribution, advisory role, etc.</li>
                  <li><strong style={{ color: "#FF6B35" }}>Expected Outcomes:</strong> Publications, patents, presentations, or other deliverables</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Step 2: Review Applicants</h3>
                <p style={{ color: "#424242", marginBottom: "1rem" }}>As researchers express interest in your project:</p>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Review their profiles, past work, and credentials</li>
                  <li>Check their Collaborator Star rating to see their track record</li>
                  <li>Initiate conversations with promising candidates</li>
                  <li>Discuss expectations, roles, and collaboration terms</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Step 3: Select Collaborators</h3>
                <p style={{ color: "#424242", marginBottom: "1rem" }}>Once you've found the right match:</p>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Formalize your collaboration agreement</li>
                  <li>Use Konecbo's messaging system to coordinate</li>
                  <li>Update your project status as you progress</li>
                  <li>Earn your Contributor Star for bringing valuable research to the platform</li>
                </ul>
              </div>
            </div>
          </section>

          {/* For Researchers Seeking Opportunities */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              For Researchers Seeking Opportunities
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Step 1: Build Your Profile</h3>
                <p style={{ color: "#424242", marginBottom: "1rem" }}>Create a comprehensive profile that showcases:</p>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Academic background and credentials</li>
                  <li>Research interests and expertise areas</li>
                  <li>Past publications and projects</li>
                  <li>Skills and methodologies you're proficient in</li>
                  <li>Languages spoken</li>
                  <li>Availability and preferred collaboration types</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Step 2: Discover Projects</h3>
                <p style={{ color: "#424242", marginBottom: "1rem" }}>Browse the platform using filters:</p>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Discipline and sub-discipline</li>
                  <li>Research methodology</li>
                  <li>Geographic location (if relevant)</li>
                  <li>Time commitment required</li>
                  <li>Collaboration type</li>
                  <li>Project stage (planning, data collection, analysis, writing)</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Step 3: Express Interest</h3>
                <p style={{ color: "#424242", marginBottom: "1rem" }}>When you find projects that align with your expertise:</p>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Submit a collaboration proposal explaining your fit</li>
                  <li>Highlight relevant experience and skills</li>
                  <li>Propose how you can contribute value</li>
                  <li>Be clear about your availability and expectations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Star System */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              The Star System Explained
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Contributor Stars ⭐</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Earned by posting research projects that seek collaborators</li>
                  <li>Reflects your role as someone who creates collaboration opportunities</li>
                  <li>Multiple projects = multiple stars</li>
                  <li>Shows your active contribution to the research community</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Collaborator Stars ⭐</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Earned by successfully joining and contributing to research projects</li>
                  <li>Reflects your reliability and value as a research partner</li>
                  <li>Builds your reputation for quality collaboration</li>
                  <li>Increases your visibility to project leads</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Why Stars Matter</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Build trust in the community</li>
                  <li>Increase your profile visibility</li>
                  <li>Demonstrate your active participation</li>
                  <li>Create a track record of successful research partnerships</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Safety & Security */}
          <section style={{ marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", color: "#1B5E20", textAlign: "center" }}>
              Safety & Security
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Research Protection</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Share only what you're comfortable sharing publicly</li>
                  <li>Detailed methodologies can be discussed in private messages</li>
                  <li>You control what information is visible at each stage</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Identity Verification</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Optional institutional email verification</li>
                  <li>ORCID integration for credential validation</li>
                  <li>Professional references and recommendations</li>
                </ul>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "#FFFFFF", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", borderTop: "3px solid #FF6B35" }}>
                <h3 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#1B5E20" }}>Dispute Resolution</h3>
                <ul style={{ color: "#424242", paddingLeft: "1.5rem" }}>
                  <li>Clear collaboration agreements recommended</li>
                  <li>Mediation support for collaboration conflicts</li>
                  <li>Community guidelines enforcement</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section style={{ backgroundColor: "#1B5E20", color: "#FFFFFF", padding: "3rem 2rem", borderRadius: "8px", borderTop: "4px solid #FF6B35" }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "2rem", textAlign: "center" }}>Success Stories</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
              <div style={{ padding: "1.5rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#FF6B35" }}>Dr. Maria Santos & Dr. James Chen</h3>
                <p style={{ lineHeight: "1.8" }}>Connected on Konecbo for a climate change study. Maria needed data analysis expertise; James wanted to expand into environmental research. Their collaboration resulted in three publications in top-tier journals.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#FF6B35" }}>Graduate Student Network</h3>
                <p style={{ lineHeight: "1.8" }}>Five PhD students from different continents found each other on Konecbo while researching similar topics in neuroscience. They formed a collaborative study group that led to a joint research project and ongoing peer support.</p>
              </div>
              <div style={{ padding: "1.5rem", backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "8px" }}>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "1rem", color: "#FF6B35" }}>Cross-Disciplinary Innovation</h3>
                <p style={{ lineHeight: "1.8" }}>A computer scientist looking to apply machine learning to healthcare connected with a medical researcher studying rare diseases. Their unlikely partnership produced an AI diagnostic tool now being tested in clinical trials.</p>
              </div>
            </div>
          </section>
        </div>
      </section>

      <Footer />
    </section>
  );
};

export default LearnMore;
