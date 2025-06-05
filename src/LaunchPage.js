import React from "react";
import { motion } from "framer-motion";
import launchImage from "./components/launch_image.png";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useNavigation } from "./utils/goToFunctions.js";

const LaunchPage = () => {
  const { goToQuestionnairePage } = useNavigation();

  // Animation variants
  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="d-flex flex-column min-vh-100 align-items-center text-center p-4"
    >
      <Navbar />
      <motion.section
        variants={heroVariants}
        initial="hidden"
        animate="visible"
        className="d-flex flex-column align-items-center text-center text-white position-relative"
        style={{
          height: "80vh",
          width: "100vw",
          backgroundImage: `url(${launchImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(36, 26, 144, 0.5)", zIndex: 1 }}
        ></div>
        <div className="position-relative z-2 d-flex flex-column justify-content-center align-items-center h-100">
          <h1
            className="display-3 fw-bold mb-4"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            }}
          >
            <span style={{ color: "#FFFFFF" }}>Find the Best</span>
            <br />
            <span style={{ color: "#3AADA4" }}>Healthcare Options</span>
          </h1>
          <p
            className="lead mb-5"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: "300",
              maxWidth: "800px",
              fontSize: "clamp(1.25rem, 3vw, 1.5rem)",
            }}
          >
            Compare prices, find top-rated providers, and get expert guidance for your healthcare needs.
          </p>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#241A90" }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-lg px-5 py-3"
            style={{
              backgroundColor: "#3AADA4",
              color: "white",
              fontFamily: "Outfit, sans-serif",
              fontWeight: "600",
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              border: "none",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onClick={goToQuestionnairePage}
            aria-label="Get Started"
          >
            Get Started
          </motion.button>
        </div>
      </motion.section>

      <section className="py-5 bg-light">
        <div className="container">
          <motion.button
            className="d-block mx-auto mb-5 bg-transparent border-0"
            style={{
              fontFamily: "Outfit, sans-serif",
              fontWeight: "700",
              color: "#241A90",
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              padding: "0.25rem 0.75rem",
              cursor: "pointer",
            }}
            whileHover={{ scale: 1.05, color: "#3AADA4", transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.3 } }}
          >
            Why Choose SureCare?
          </motion.button>
          <div className="row justify-content-between">
            <motion.div
              className="col-12 col-md-4"
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              style={{ overflow: "hidden", maxWidth: "28%" }}
            >
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-dollar-sign fa-3x mb-3" style={{ color: "#3AADA4" }}></i>
                  <h5 className="card-title" style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700" }}>
                    Transparent Pricing
                  </h5>
                  <p
                    className="card-text"
                    style={{ fontFamily: "Outfit, sans-serif", fontWeight: "300" }}
                  >
                    Know the real cost of healthcare before you choose, with clear and accurate pricing.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-12 col-md-4"
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              style={{ overflow: "hidden", maxWidth: "28%" }}
            >
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-stethoscope fa-3x mb-3" style={{ color: "#3AADA4" }}></i>
                  <h5 className="card-title" style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700" }}>
                    Quality Providers
                  </h5>
                  <p
                    className="card-text"
                    style={{ fontFamily: "Outfit, sans-serif", fontWeight: "300" }}
                  >
                    Access top-rated providers tailored to your needs.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-12 col-md-4"
              variants={featureVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              style={{ overflow: "hidden", maxWidth: "28%" }}
            >
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className="fas fa-user-md fa-3x mb-3" style={{ color: "#3AADA4" }}></i>
                  <h5 className="card-title" style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700" }}>
                    Personalized Care
                  </h5>
                  <p
                    className="card-text"
                    style={{ fontFamily: "Outfit, sans-serif", fontWeight: "300" }}
                  >
                    Get expert guidance and telehealth options for smarter healthcare decisions.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default LaunchPage;
