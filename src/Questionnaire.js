/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigation } from "./utils/goToFunctions.js";
import { FaArrowRight } from "react-icons/fa";
import { getLocationPrices } from "./services/userService.js";

const Questionnaire = () => {
  /* ─────────── Navigation helpers ─────────── */
  const {
    goToAboutPage,
    goToHelpPage,
    goToSignInPage,
    goToLaunchPage,
    goToResultsPage,
  } = useNavigation();

  /* ─────────── State ─────────── */
  const [, setShowSymptomsDropdown] = useState(false);
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // location state
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState(null);

  const radiusMiles = 5;

  /* ─────────── Ask for location on mount ─────────── */
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by your browser.");
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

  /* ─────────── Refs & click-outside helper ─────────── */
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const useOnClickOutsideMultiple = (refs, handler) => {
    useEffect(() => {
      const listener = (e) => {
        if (refs.every((r) => !r.current || !r.current.contains(e.target))) {
          handler();
        }
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [refs, handler]);
  };

  useOnClickOutsideMultiple([inputRef, dropdownRef], () =>
    setShowSymptomsDropdown(false)
  );

  /* ─────────── Submit handler ─────────── */
  const handleClick = async () => {
    setSubmitted(true);
    if (!details.trim()) return;

    if (coords.lat == null || coords.lng == null) {
      console.error("Location unavailable:", geoError || "still fetching…");
      return;
    }

    try {
      const hospitals = await getLocationPrices(
        coords.lat,
        coords.lng,
        radiusMiles
      );
      goToResultsPage({ results: hospitals });
    } catch (err) {
      console.error(err);
    }
  };

  /* ─────────── UI ─────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="d-flex flex-column min-vh-100"
    >
      {/* -------- Nav Bar -------- */}
      <nav
        className="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom border-dark px-0"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          width: "100vw",
          zIndex: 1000,
        }}
      >
        <div className="container-fluid d-flex justify-content-between">
          <button
            onClick={goToLaunchPage}
            style={{
              fontSize: "2rem",
              fontWeight: 700,
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
              Sign&nbsp;In
            </button>
          </div>
        </div>
      </nav>

      {/* -------- Body -------- */}
      <div className="container flex-fill d-flex flex-column justify-content-center align-items-center text-center pt-5">
        <div className="row w-100 d-flex justify-content-center align-items-center mt-5 mb-2">
          <div className="col-md-6 d-flex flex-column justify-content-center text-center">
            <p className="fs-2" style={{ fontWeight: 400 }}>
              Get started today. We can help.
            </p>
          </div>

          <div className="col-md-8 d-flex flex-column align-items-center mb-5">
            {/* -------- Text Entry Card -------- */}
            <div
              className="card shadow-lg d-flex flex-column mx-auto text-center"
              style={{
                borderRadius: 20,
                maxHeight: 900,
                maxWidth: 1000,
                overflow: "hidden",
                width: "100%",
                border: "2px solid gray",
              }}
            >
              <div
                className="card-body p-4 d-flex flex-column"
                style={{ overflowY: "auto", flex: 1 }}
              >
                <div
                  className="d-flex align-items-center border rounded px-3 py-2"
                  style={{
                    backgroundColor: "#f8f9fa",
                    borderColor:
                      submitted && details.trim() === "" ? "red" : "#ced4da",
                  }}
                >
                  <textarea
                    ref={inputRef}
                    id="details"
                    className="form-control border-0"
                    rows={1}
                    placeholder="Type your symptoms or preferences..."
                    style={{
                      resize: "none",
                      boxShadow: "none",
                      backgroundColor: "transparent",
                      fontSize: "1rem",
                      overflow: "hidden",
                    }}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn p-2"
                    style={{
                      backgroundColor: "#241A90",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 10,
                      transition: "background-color 0.2s ease-in-out",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#3b2dbb"; // ← use currentTarget
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#241A90";
                    }}
                    //onClick={}
                  >
                    <FaArrowRight />
                  </button>

                </div>
                {submitted && details.trim() === "" && (
                  <div className="text-danger mt-2">
                    Please provide some information before proceeding.
                  </div>
                )}

                {geoError && (
                  <div className="text-warning mt-2">
                    Location unavailable: {geoError}. Results may be less
                    accurate.
                  </div>
                )}
              </div>
            </div>

            {/* -------- New Full-Width Button -------- */}
            <button
              type="button"
              className="btn mt-3"
              style={{
                width: "100%",
                maxWidth: 1000,
                backgroundColor: "#241A90",
                color: "#fff",
                fontWeight: 600,
                padding: "0.75rem",
                borderRadius: 12,
                border: "2px solid #241A90",
                transition: "background-color 0.2s ease-in-out",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#3b2dbb";
                e.target.style.borderColor = "#3b2dbb";       // ← change border, too
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#241A90";
                e.target.style.borderColor = "#241A90";       // ← restore original border
              }}
              onClick={handleClick}
            >
              Search Hospitals Near Me
            </button>
          </div>
        </div>
      </div>

      {/* -------- Footer -------- */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-center p-4 text-muted bg-white shadow-sm border-top border-dark"
        style={{ position: "relative", bottom: 0, left: 0, right: 0, width: "100vw" }}
      >
        © 2025 TrueRate. All rights reserved.
      </motion.footer>
    </motion.div>
  );
};

export default Questionnaire;
