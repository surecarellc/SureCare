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

  /* ─────────── State (only what’s used) ─────────── */
  // eslint-disable-next-line no-unused-vars
  const [, setShowSymptomsDropdown] = useState(false); // only setter used

  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // We read radius (default 5) but never mutate it yet,
  // so bind only the value to satisfy ESLint.
  const [radius] = useState("");

  /* ─── Commented-out placeholders you’ll implement later ─── */
  /*
  const [healthInsurance, setHealthInsurance] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [location, setLocation] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  */

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

  useOnClickOutsideMultiple(
    [inputRef, dropdownRef],
    () => setShowSymptomsDropdown(false)
  );

  /* ─────────── Submit handler ─────────── */
  const handleClick = async () => {
    setSubmitted(true);
    if (!details.trim()) return; // simple front-end validation

    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return;
    }

    try {
      const { latitude, longitude } = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          reject
        )
      );

      const hospitals = await getLocationPrices(
        latitude,
        longitude,
        radius || 5
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
        style={{ position: "fixed", top: 0, left: 0, right: 0, width: "100vw", zIndex: 1000 }}
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
            <button className="nav-link text-dark mx-3 bg-transparent border-0" onClick={goToAboutPage}>
              About
            </button>
            <button className="nav-link text-dark mx-3 bg-transparent border-0" onClick={goToHelpPage}>
              Help
            </button>
            <button className="nav-link text-dark mx-3 bg-transparent border-0" onClick={goToSignInPage}>
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

          <div className="col-md-8 d-flex justify-content-center mb-5">
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
                    borderColor: submitted && details.trim() === "" ? "red" : "#ced4da",
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
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginLeft: 10,
                      transition: "background-color 0.2s ease-in-out",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#3b2dbb")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#241A90")}
                    onClick={handleClick}
                  >
                    <FaArrowRight />
                  </button>
                </div>
                {submitted && details.trim() === "" && (
                  <div className="text-danger mt-2">
                    Please provide some information before proceeding.
                  </div>
                )}
              </div>
            </div>
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
