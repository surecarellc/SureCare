import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BiDollarCircle, BiHeart, BiCheckShield } from "react-icons/bi";
import launchImage from "./components/launch_image.png";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { useNavigation } from "./utils/goToFunctions";

const LaunchPage = () => {
  const { goToQuestionnairePage } = useNavigation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("surecare_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleGetStarted = () => {
    goToQuestionnairePage();
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("surecare_user");
    window.google?.accounts.id.disableAutoSelect();
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, ease: "easeOut" },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const Card = ({ children }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="col-lg-4 col-md-12 mb-4"
      >
        {children}
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="d-flex flex-column min-vh-100 align-items-center"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#F5F7FA",
      }}
    >
      <Navbar className="position-sticky top-0 z-3" user={user} onLogout={handleLogout} />

      <motion.section
        className="d-flex flex-column align-items-center text-center text-white position-relative"
        style={{ height: "calc(80vh - 70px)", width: "100vw", marginTop: "55px" }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: `url(${launchImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            zIndex: 0,
          }}
        />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: "linear-gradient(135deg, rgba(36, 26, 144, 0.7), rgba(58, 173, 164, 0.4))",
            zIndex: 1,
          }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="position-relative z-2 d-flex flex-column justify-content-center align-items-center h-100 px-4"
        >
          <motion.h1
            variants={childVariants}
            className="mb-4 fw-bold"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              lineHeight: 1.2,
              letterSpacing: "0.02em",
              color: "#FFFFFF",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            }}
          >
            Find the Best
            <br />
            Healthcare Options
          </motion.h1>
          <motion.p
            variants={childVariants}
            className="mb-5"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
              maxWidth: "700px",
              lineHeight: 1.5,
            }}
          >
            Compare prices, find top-rated providers, and get expert guidance for
            your healthcare needs.
          </motion.p>
          <motion.button
            variants={childVariants}
            whileHover={{
              scale: 1.05,
              background: "linear-gradient(90deg, #241A90, #3AADA4)",
            }}
            whileTap={{ scale: 0.95 }}
            className="btn px-5 py-3"
            style={{
              background: "linear-gradient(90deg, #3AADA4, #241A90)",
              color: "white",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1rem, 2vw, 1.125rem)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              minHeight: "48px",
            }}
            onClick={handleGetStarted}
            aria-label="Get Started with Healthcare Options"
          >
            Get Started
          </motion.button>
        </motion.div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="position-absolute bottom-0 mb-3"
          style={{ zIndex: 2 }}
        >
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 16.5l-6-6h12l-6 6z" />
          </svg>
        </motion.div>
      </motion.section>

      {/* Why Choose Section */}
      <section className="py-5" style={{ backgroundColor: "#F5F7FA", width: "100vw" }}>
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-5"
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              color: "#241A90",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            }}
          >
            Why Choose SureCare?
          </motion.h2>
          <div className="row justify-content-center">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="card h-100 border-0"
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div className="card-body text-center">
                    {[BiDollarCircle, BiHeart, BiCheckShield][i]({
                      className: "mb-3 text-primary",
                      style: { fontSize: "2.5rem", color: "#3AADA4" },
                    })}
                    <h3
                      className="card-title h5 mb-3"
                      style={{ color: "#241A90", fontFamily: "'Outfit', sans-serif" }}
                    >
                      {["Transparent Pricing", "Personalized Care", "Quality Assurance"][i]}
                    </h3>
                    <p
                      className="card-text"
                      style={{ color: "#333333", fontFamily: "'Inter', sans-serif" }}
                    >
                      {[
                        "Get real-time price comparisons for medical procedures across hospitals in your area.",
                        "Receive tailored recommendations based on your specific medical needs and preferences.",
                        "Access verified reviews and ratings to make informed decisions about your healthcare.",
                      ][i]}
                    </p>
                  </div>
                </motion.div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </motion.div>
  );
};

export default LaunchPage;
