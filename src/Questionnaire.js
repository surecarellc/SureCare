/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigation } from "./utils/goToFunctions";
import { getLocationPrices } from "./services/userService";

const Questionnaire = () => {
  const {
    goToAboutPage,
    goToHelpPage,
    goToSignInPage,
    goToLaunchPage,
    goToResultsPage,
  } = useNavigation();

  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState(null);
  const radiusMiles = 5;

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => setGeoError(err.message),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  const handleArrowClick = () => {
    setSubmitted(true);
    if (!details.trim()) return;
    setLaunched(true);
  };

  const handleSearchClick = async () => {
    if (!coords.lat) {
      console.error("No location:", geoError || "still fetching");
      return;
    }
    try {
      const hospitals = await getLocationPrices(
        coords.lat,
        coords.lng,
        radiusMiles
      );
      goToResultsPage({ results: hospitals });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="d-flex flex-column min-vh-100"
    >
      {/* -------- Nav -------- */}
      <nav
        className="navbar navbar-light bg-white shadow-sm border-bottom px-0"
        style={{ position: "fixed", width: "100vw", zIndex: 1000 }}
      >
        <div className="container-fluid d-flex justify-content-between">
          <button
            onClick={goToLaunchPage}
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ color: "#241A90" }}>True</span>
            <span style={{ color: "#3AADA4" }}>Rate</span>
          </button>
          <div className="d-flex">
            <button className="nav-link" onClick={goToAboutPage}>
              About
            </button>
            <button className="nav-link" onClick={goToHelpPage}>
              Help
            </button>
            <button className="nav-link" onClick={goToSignInPage}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ===== Main Area ===== */}
      <div
        className="flex-fill d-flex flex-column align-items-center"
        style={{
          justifyContent: launched ? "flex-end" : "center",
          padding: "2rem 1rem",
          transition: "justify-content 0.5s ease",
        }}
      >
        {/* Prompt Box */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="input-group"
          style={{
            maxWidth: 600,
            width: "100%",
            background: "#f8f9fa",
            border: "2px solid gray",
            borderRadius: 20,
            overflow: "hidden",
            padding: "0.5rem",
          }}
        >
          <textarea
            className="form-control border-0 bg-transparent"
            placeholder="Type your symptoms or preferences…"
            rows={1}
            style={{ resize: "none" }}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
          <button
            className="btn"
            style={{
              background: "#241A90",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "#3b2dbb")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "#241A90")
            }
            onClick={handleArrowClick}
          >
            <FaArrowRight />
          </button>
        </motion.div>

        {/* Validation/Error */}
        {submitted && !details.trim() && (
          <div className="text-danger mt-2">
            Please enter something before proceeding.
          </div>
        )}
        {geoError && (
          <div className="text-warning mt-2">
            Location unavailable: {geoError}
          </div>
        )}

        {/* Fade-in Search Button */}
        {launched && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="btn mt-3"
            style={{
              maxWidth: 600,
              width: "100%",
              background: "#241A90",
              color: "#fff",
              padding: "0.75rem",
              borderRadius: 12,
              border: "2px solid #241A90",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "#3b2dbb";
              e.currentTarget.style.borderColor = "#3b2dbb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "#241A90";
              e.currentTarget.style.borderColor = "#241A90";
            }}
            onClick={handleSearchClick}
          >
            Search Hospitals Near Me
          </motion.button>
        )}
      </div>

      {/* -------- Footer -------- */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center p-4 text-muted bg-white shadow-sm border-top"
      >
        © 2025 TrueRate. All rights reserved.
      </motion.footer>
    </motion.div>
  );
};

export default Questionnaire;
