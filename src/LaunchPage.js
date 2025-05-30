//import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import launchImage from "./components/launch_image.png";
import { useNavigation } from "./utils/goToFunctions.js";
//import { getLocationPrices } from "./services/userService.js";

const LaunchPage = () => {
  //const [hospitalData, setHospitalData] = useState([]); // <-- Step 1: declare state

  const {
    goToAboutPage,
    goToQuestionnairePage,
    goToSignInPage,
    goToHelpPage,
    goToLaunchPage,
  } = useNavigation();

  // Step 2: fetch data on load
  /*
  useEffect(() => {
    console.log("🔥 Console works test"); // ← Test log

    getLocationPrices(1, 1, 19)
      .then((data) => {
        console.log("🏥 Hospital data from API:", data); // ← Actual API result
        setHospitalData(data);
      })
      .catch((err) => {
        console.error("❌ Failed to fetch hospital data:", err);
      });
  }, []);
*/

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
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
            <span style={{ color: "#241A90" }}>True</span>
            <span style={{ color: "#3AADA4" }}>Rate</span>
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

      {/* Body */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-fill d-flex flex-column justify-content-center align-items-start p-5 text-black position-relative"
        style={{
          height: "70vh",
          width: "100vw",
          marginLeft: "0",
          borderTop: "2px solid black",
          borderBottom: "2px solid black",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${launchImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center left",
            backgroundRepeat: "no-repeat",
            filter: "blur(8px)",
            zIndex: -1,
          }}
        />
        <h1
          className="display-4"
          style={{ fontWeight: "400", fontFamily: "Outfit, sans-serif" }}
        >
          Find the right <br /> healthcare for you.
        </h1>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="btn btn-dark mt-4 px-5 py-2 rounded-pill shadow-sm"
          onClick={goToQuestionnairePage}
        >
          Get Started
        </motion.button>

        {/* Step 3: Display hospital data */}
        {/*
        <div className="mt-4 bg-light p-3 rounded" style={{ maxHeight: "200px", overflowY: "scroll", width: "100%" }}>
          <h5>Hospital Data:</h5>
          <pre>{JSON.stringify(hospitalData, null, 2)}</pre>
        </div>
        */}
      </motion.div>

      {/* Footer */}
      <footer className="text-center p-4 text-muted bg-white shadow-sm">
        &copy; 2025 TrueRate. All rights reserved.
      </footer>
    </motion.div>
  );
};

export default LaunchPage;
