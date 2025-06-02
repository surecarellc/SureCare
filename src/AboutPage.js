import React from "react";
import { useNavigation } from "./utils/goToFunctions.js";
import { motion, useInView } from "framer-motion";
import s_barlaImage from "./components/s_barla.jpg";
import r_doshiImage from "./components/r_doshi.jpeg";
import k_vedereImage from "./components/k_vedere.jpg";
import a_khatwaniImage from "./components/a_khatwani.jpg";
import a_ellisImage from "./components/a_ellis.jpg";
import { useRef } from "react";

const AboutPage = () => {
  const { goToSignInPage, goToHelpPage, goToLaunchPage } = useNavigation();

  // Refs for each section to detect when they are in view
  const whoWeAreRef = useRef(null);
  const teamRef = useRef(null);
  const missionRef = useRef(null);

  // Check if sections are in view
  const whoWeAreInView = useInView(whoWeAreRef, { once: false, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: false, amount: 0.3 });
  const missionInView = useInView(missionRef, { once: false, amount: 0.3 });

  // Animation variants for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Animation variants for team member cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 8px 16px rgba(0,0,0,0.2)", 
      outline: "3px solid #241A90",
      transition: { duration: 0.3 } 
    },
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
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-dark px-3"
        style={{ position: "fixed", top: 0, left: 0, right: 0, width: "100vw", zIndex: 1000 }}
      >
        <div className="container-xl d-flex justify-content-between">
          <button
            onClick={goToLaunchPage}
            style={{ fontSize: "2rem", fontWeight: "700", cursor: "pointer", background: "none", border: "none" }}
          >
            <span style={{ color: "#241A90" }}>True</span>
            <span style={{ color: "#3AADA4" }}>Rate</span>
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
              onClick={goToSignInPage}
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
        <div className="container-xl">
          <h1 className="display-4 font-weight-bold mt-5" style={{ fontFamily: "Outfit, sans-serif" }}>
            Who We Are
          </h1>
          <p
            className="lead mx-auto"
            style={{ fontFamily: "Outfit, sans-serif", fontWeight: "300", maxWidth: "900px" }}
          >
            SureCare is a healthcare technology company dedicated to bringing transparency,
            affordability, and accessibility to medical services in the United States. We believe
            that every American deserves to know the real cost of healthcare before stepping into a
            doctor’s office or hospital. Our mission is to empower consumers with accurate pricing,
            provider quality insights, and expert guidance to help them make informed medical
            decisions.
          </p>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        ref={teamRef}
        variants={sectionVariants}
        initial="hidden"
        animate={teamInView ? "visible" : "hidden"}
        className="w-100 py-5"
        style={{ background: "linear-gradient(180deg, #3AADA4 0%, #2A8C84 100%)" }}
      >
        <div className="container-fluid px-4">
          <h2 className="display-5 font-weight-bold mb-5 text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
            Our Team
          </h2>
          {/* X Formation: CEO in the center, two members on each side */}
          <div className="row justify-content-center align-items-center">
            {/* Left Side: Two Team Members (Top and Bottom) */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex flex-column align-items-center">
              <motion.div
                className="mb-5 w-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                style={{ outline: "1px solid #3AADA4", height: "400px", display: "flex", flexDirection: "column" }}
              >
                <div className="text-center p-4 flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <div className="position-relative">
                      <img
                        src={s_barlaImage}
                        alt="Saatvik Barla"
                        className="rounded-circle"
                        style={{ width: "180px", height: "180px", objectFit: "cover", border: "4px solid #FFFFFF" }}
                      />
                      <div
                        className="position-absolute"
                        style={{
                          bottom: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "100px",
                          height: "4px",
                          backgroundColor: "#241A90",
                        }}
                      ></div>
                    </div>
                    <h5 className="mt-3" style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "#FFFFFF" }}>
                      Saatvik Barla
                    </h5>
                  </div>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: "300",
                      color: "#E0E0E0",
                      fontSize: "0.95rem",
                      marginBottom: "0",
                    }}
                  >
                    I'm deeply passionate about making healthcare more accessible and transparent. Leveraging my technical expertise in Python, SQL, and Microsoft Azure, I'm currently the lead developer on SureCare, where we are trying to simplify healthcare pricing by providing clear, accessible hospital data. My goal is to empower users with the tools they need to make informed health decisions.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="w-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                style={{ outline: "1px solid #3AADA4", height: "400px", display: "flex", flexDirection: "column" }}
              >
                <div className="text-center p-4 flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <div className="position-relative">
                      <img
                        src={k_vedereImage}
                        alt="Kaarthikeya Vedere"
                        className="rounded-circle"
                        style={{ width: "180px", height: "180px", objectFit: "cover", border: "4px solid #FFFFFF" }}
                      />
                      <div
                        className="position-absolute"
                        style={{
                          bottom: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "100px",
                          height: "4px",
                          backgroundColor: "#241A90",
                        }}
                      ></div>
                    </div>
                    <h5 className="mt-3" style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "#FFFFFF" }}>
                      Kaarthikeya Vedere
                    </h5>
                  </div>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: "300",
                      color: "#E0E0E0",
                      fontSize: "0.95rem",
                      marginBottom: "0",
                    }}
                  >
                    As a dedicated SureCare developer, I use my abilities in Python, Node.js, and database management to build a platform that offers transparent healthcare pricing, empowering users to make informed decisions confidently.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Center: CEO */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex justify-content-center align-items-center mx-4">
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                style={{ outline: "2px solid #3AADA4", height: "400px", display: "flex", flexDirection: "column" }}
              >
                <div className="text-center p-4 flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <div className="position-relative">
                      <img
                        src={a_ellisImage}
                        alt="Andrew Ellis"
                        className="rounded-circle"
                        style={{ width: "200px", height: "200px", objectFit: "cover", border: "5px solid #FFFFFF" }}
                      />
                      <div
                        className="position-absolute"
                        style={{
                          bottom: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "120px",
                          height: "5px",
                          backgroundColor: "#241A90",
                        }}
                      ></div>
                    </div>
                    <h4 className="mt-3" style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "#FFFFFF" }}>
                      Andrew Ellis
                    </h4>
                  </div>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: "300",
                      color: "#E0E0E0",
                      fontSize: "1rem",
                      marginBottom: "0",
                    }}
                  >
                    Founder and CEO. Visionary leader driving healthcare accessibility for all.
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Right Side: Two Team Members (Top and Bottom) */}
            <div className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex flex-column align-items-center">
              <motion.div
                className="mb-5 w-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                style={{ outline: "1px solid #3AADA4", height: "400px", display: "flex", flexDirection: "column" }}
              >
                <div className="text-center p-4 flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <div className="position-relative">
                      <img
                        src={r_doshiImage}
                        alt="Rohan Doshi"
                        className="rounded-circle"
                        style={{ width: "180px", height: "180px", objectFit: "cover", border: "4px solid #FFFFFF" }}
                      />
                      <div
                        className="position-absolute"
                        style={{
                          bottom: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "100px",
                          height: "4px",
                          backgroundColor: "#241A90",
                        }}
                      ></div>
                    </div>
                    <h5 className="mt-3" style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "#FFFFFF" }}>
                      Rohan Doshi
                    </h5>
                  </div>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: "300",
                      color: "#E0E0E0",
                      fontSize: "0.95rem",
                      marginBottom: "0",
                    }}
                  >
                    My passion lies in building products that make a meaningful impact on people’s lives. At SureCare, I strive to turn that passion into reality by applying my skills in UI/UX design, React.js, and Python to develop thoughtful, user-focused solutions.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className="w-100"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                style={{ outline: "1px solid #3AADA4", height: "400px", display: "flex", flexDirection: "column" }}
              >
                <div className="text-center p-4 flex-grow-1 d-flex flex-column justify-content-between">
                  <div>
                    <div className="position-relative">
                      <img
                        src={a_khatwaniImage}
                        alt="Armaan Khatwani"
                        className="rounded-circle"
                        style={{ width: "180px", height: "180px", objectFit: "cover", border: "4px solid #FFFFFF" }}
                      />
                      <div
                        className="position-absolute"
                        style={{
                          bottom: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          width: "100px",
                          height: "4px",
                          backgroundColor: "#241A90",
                        }}
                      ></div>
                    </div>
                    <h5 className="mt-3" style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "#FFFFFF" }}>
                      Armaan Khatwani
                    </h5>
                  </div>
                  <p
                    style={{
                      fontFamily: "Outfit, sans-serif",
                      fontWeight: "300",
                      color: "#E0E0E0",
                      fontSize: "0.95rem",
                      marginBottom: "0",
                    }}
                  >
                    CFO. Focused on financial transparency and growth.
                  </p>
                </div>
              </motion.div>
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
        <div className="container-xl">
          <h2 className="display-5 font-weight-bold mt-0" style={{ fontFamily: "Outfit, sans-serif" }}>
            Our Mission
          </h2>
          <p
            className="lead mx-auto mb-5"
            style={{ fontFamily: "Outfit, sans-serif", fontWeight: "300", maxWidth: "900px" }}
          >
            SureCare is revolutionizing the healthcare industry by providing a simple, user-friendly platform that enables individuals to compare real-time medical pricing, access high-quality providers, and receive on-demand medical guidance. By offering cost transparency, telehealth access, and top-rated provider recommendations, we aim to make healthcare more accessible and affordable for all. Whether you are uninsured, underinsured, or simply seeking better options, SureCare is your trusted resource for smarter healthcare decisions.
          </p>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="text-center p-4 text-muted bg-white shadow-sm border-top border-dark px-0"
        style={{ position: "fixed", bottom: 0, left: 0, right: 0, width: "100vw" }}>
        &copy; 2025 TrueRate. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default AboutPage;
