import { motion } from "framer-motion";
import launchImage from "./components/launch_image.png";
import { useNavigation } from "./utils/goToFunctions.js";

const LaunchPage = () => {
  const {
    goToAboutPage,
    goToQuestionnairePage,
    goToSignInPage,
    goToHelpPage,
    goToLaunchPage,
  } = useNavigation();

  // Animation variants for hero section
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  // Animation variants for feature cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
    hover: { 
      scale: 1.05, 
      boxShadow: "0 4px 10px rgba(0,0,0,0.3)", 
      transition: { duration: 0.3 } 
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="d-flex flex-column min-vh-100"
    >
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid">
          <button
            onClick={goToLaunchPage}
            style={{
              fontSize: "2rem",
              fontWeight: "700",
              cursor: "pointer",
              background: "none",
              border: "none",
            }}
          >
            <span style={{ color: "#241A90" }}>Sure</span>
            <span style={{ color: "#3AADA4" }}>Care</span>
          </button>
          <div className="d-flex">
            <button
              className="nav-link text-dark mx-3 bg-transparent border-0"
              onClick={goToAboutPage}
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

      {/* Hero Section */}
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
        />
        <div className="container position-relative" style={{ zIndex: 2, paddingTop: "20vh" }}>
          <h1
            className="display-3 fw-bold mb-3"
            style={{ fontFamily: "Outfit, sans-serif", color: "#fff" }}
          >
            Find the Right Healthcare for You
          </h1>
          <p
            className="lead mb-4"
            style={{ fontFamily: "Outfit, sans-serif", fontWeight: "300", color: "#E0E0E0" }}
          >
            Discover transparent pricing, quality providers, and personalized care with SureCare.
          </p>
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#241A90" }}
            whileTap={{ scale: 0.95 }}
            className="btn mt-3 px-5 py-3 rounded-pill shadow"
            style={{
              backgroundColor: "#3AADA4",
              color: "#fff",
              fontFamily: "Outfit, sans-serif",
              fontSize: "1.2rem",
              border: "none",
            }}
            onClick={goToQuestionnairePage}
          >
            Get Started
          </motion.button>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2
            className="text-center mb-5"
            style={{ fontFamily: "Outfit, sans-serif", fontWeight: "700", color: "#241A90" }}
          >
            Why Choose SureCare?
          </h2>
          <div className="row justify-content-between" style={{ gap: "0.75rem" }}>
            <motion.div
              className="col-12 col-md-4"
              variants={cardVariants}
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
              variants={cardVariants}
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
              variants={cardVariants}
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

      {/* Footer */}
      <footer className="text-center p-4 text-muted bg-white shadow-sm border-top border-dark">
        © 2025 SureCare. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default LaunchPage;