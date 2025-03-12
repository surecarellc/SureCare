import React from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import googleImage from "./components/google.png";
import { useRef } from "react";


const AboutPage = () => {
  const navigate = useNavigate();
  
  // Refs for each section to detect when they are in view
  const whoWeAreRef = useRef(null);
  const teamRef = useRef(null);
  const missionRef = useRef(null);

  // Check if sections are in view
  const whoWeAreInView = useInView(whoWeAreRef, { once: false, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: false, amount: 0.3 });
  const missionInView = useInView(missionRef, { once: false, amount: 0.3 });

  const goToLaunchPage = () => navigate("/");
  const goToSignIn = () => navigate("/signin");
  const goToHelpPage = () => navigate("/help");

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.5 }}
      className="d-flex flex-column min-vh-100 align-items-center text-center p-0"
    >
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-dark px-0"
        style={{ position: "fixed", top: 0, left: 0, right: 0, width: "100vw", zIndex: 1000 }}
      >
        <div className="container-fluid d-flex justify-content-between">
          
          <button 
            onClick={goToLaunchPage}
            style={{ fontSize: "2rem", fontWeight: "700", cursor: "pointer", background: "none", border: "none" }}
          >
            <span style={{ color: "#241A90" }}>Sure</span>
            <span style={{ color: "#3AADA4" }}>Care</span>
          </button>

          <div className="d-flex">
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              About
            </button>
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={goToHelpPage}
            >
              Help
            </button>
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={goToSignIn}
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Who We Are Section */}
      <motion.div
        ref={whoWeAreRef}
        variants={sectionVariants}
        initial="hidden"
        animate={whoWeAreInView ? "visible" : "hidden"}
        className="d-flex flex-column justify-content-center align-items-center text-black py-5 w-100"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <h1 className="display-4 font-weight-bold mt-5" style={{ fontFamily: "Outfit, sans-serif" }}>
          Who We Are
        </h1>
        <p
          className="lead mx-auto"
          style={{ fontFamily: "Outfit, sans-serif", fontWeight: "300", maxWidth: "800px" }}
        >
          SureCare is a healthcare technology company dedicated to bringing transparency,
          affordability, and accessibility to medical services in the United States. We believe
          that every American deserves to know the real cost of healthcare before stepping into a
          doctor’s office or hospital. Our mission is to empower consumers with accurate pricing,
          provider quality insights, and expert guidance to help them make informed medical
          decisions.
        </p>
      </motion.div>

      {/* Team Section */}
      <motion.div
        ref={teamRef}
        variants={sectionVariants}
        initial="hidden"
        animate={teamInView ? "visible" : "hidden"}
        className="w-100 py-5"
        style={{ backgroundColor: "#3AADA4" }}
      >
        <div className="row justify-content-center mx-auto gx-2" style={{ maxWidth: "1200px" }}>
          {/* Team Member 1 */}
          <div className="col-md-6 mb-4">
            <div className="d-flex flex-column align-items-center">
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={googleImage}
                  alt="Team Member 1"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h5 style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "white" }}>
                Jane Doe
              </h5>
              <p
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: "300",
                  maxWidth: "250px",
                  color: "white",
                }}
              >
                Co-founder and CEO. Passionate about making healthcare accessible for all.
              </p>
            </div>
          </div>

          {/* Team Member 2 */}
          <div className="col-md-6 mb-4">
            <div className="d-flex flex-column align-items-center">
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={googleImage}
                  alt="Team Member 2"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h5 style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "white" }}>
                John Smith
              </h5>
              <p
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: "300",
                  maxWidth: "250px",
                  color: "white",
                }}
              >
                CTO. Expert in healthcare tech solutions and innovation.
              </p>
            </div>
          </div>

          {/* Team Member 3 */}
          <div className="col-md-6 mb-4">
            <div className="d-flex flex-column align-items-center">
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={googleImage}
                  alt="Team Member 3"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h5 style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "white" }}>
                Alice Johnson
              </h5>
              <p
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: "300",
                  maxWidth: "250px",
                  color: "white",
                }}
              >
                COO. Dedicated to operational excellence in healthcare.
              </p>
            </div>
          </div>

          {/* Team Member 4 */}
          <div className="col-md-6 mb-4">
            <div className="d-flex flex-column align-items-center">
              <div
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginBottom: "1rem",
                }}
              >
                <img
                  src={googleImage}
                  alt="Team Member 4"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h5 style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "white" }}>
                Bob Wilson
              </h5>
              <p
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontWeight: "300",
                  maxWidth: "250px",
                  color: "white",
                }}
              >
                CFO. Focused on financial transparency and growth.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Our Mission Section */}
      <motion.div
        ref={missionRef}
        variants={sectionVariants}
        initial="hidden"
        animate={missionInView ? "visible" : "hidden"}
        className="d-flex flex-column justify-content-center align-items-center text-black py-5 w-100 flex-grow-1"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <h2
          className="display-5 font-weight-bold mt-0"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          Our Mission
        </h2>
        <p
          className="lead mx-auto mb-5"
          style={{ fontFamily: "Outfit, sans-serif", fontWeight: "300", maxWidth: "800px" }}
        >
          SureCare is revolutionizing the healthcare industry by providing a simple,
          user-friendly platform that enables individuals to compare real-time medical pricing,
          access high-quality providers, and receive on-demand medical guidance. By offering cost
          transparency, telehealth access, and top-rated provider recommendations, we aim to
          make healthcare more accessible and affordable for all. Whether you are uninsured,
          underinsured, or simply seeking better options, SureCare is your trusted resource for
          smarter healthcare decisions.
        </p>
      </motion.div>

      <footer
        className="text-center p-4 text-muted bg-white shadow-sm border-top border-dark px-0"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, width: "100vw" }}
      >
        © 2025 SureCare. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default AboutPage;