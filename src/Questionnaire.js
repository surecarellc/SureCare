/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";
import { useNavigation } from "./utils/goToFunctions";
import { getLocationPrices } from "./services/userService";

const STORAGE_KEY = "chatMessages";

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

  // load chat history from sessionStorage
  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // persist chat history
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState(null);
  const radiusMiles = 5;

  // get geolocation once
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setGeoError(err.message),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  // on arrow click: add user + dummy assistant response
  const handleArrowClick = () => {
    setSubmitted(true);
    if (!details.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { role: 'user', text: details },
      { role: 'assistant', text: 'This is a placeholder response. I\'ll connect the real AI response here soon.' }
    ]);
    setDetails("");
    setSubmitted(false);
    setLaunched(true);
  };

  // actual search
  const handleSearchClick = async () => {
    if (!coords.lat) {
      console.error("No location:", geoError || "still fetching");
      return;
    }
    try {
      const hospitals = await getLocationPrices(coords.lat, coords.lng, radiusMiles);
      goToResultsPage({ results: hospitals });
    } catch (e) {
      console.error(e);
    }
  };

  const hasMsgs = messages.length > 0;

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
        style={{ position: "fixed", top: 0, width: "100vw", zIndex: 1000 }}
      >
        <div className="container-fluid d-flex justify-content-between">
          <button
            onClick={goToLaunchPage}
            style={{ fontSize: "2rem", fontWeight: 700, background: "none", border: "none", cursor: "pointer" }}
          >
            <span style={{ color: "#241A90" }}>True</span>
            <span style={{ color: "#3AADA4" }}>Rate</span>
          </button>
          <div className="d-flex">
            <button className="nav-link mx-3" onClick={goToAboutPage}>
              About
            </button>
            <button className="nav-link mx-3" onClick={goToHelpPage}>
              Help
            </button>
            <button className="nav-link mx-3" onClick={goToSignInPage}>
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* ---- Main Content ---- */}
      <div
        className="flex-fill d-flex flex-column align-items-center"
        style={{
          padding: "6rem 1rem 2rem", // push content below header
          position: "relative"
        }}
      >
        {/* Chat History: scrollable area */}
        {hasMsgs && (
          <div
            style={{
              maxWidth: 600,
              width: "100%",
              flex: '1',
              overflowY: 'auto',
              marginBottom: '1rem'
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`d-flex mb-2 ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div
                  style={{
                    background: m.role === 'user' ? '#3AADA4' : '#e9ecef',
                    color: m.role === 'user' ? '#fff' : '#000',
                    borderRadius: 12,
                    padding: '0.5rem 1rem',
                    maxWidth: '80%'
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Prompt Box: fixed at bottom of content container */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="input-group"
          style={{
            maxWidth: 600,
            width: "100%",
            background: "#f8f9fa",
            border: "2px solid gray",
            borderRadius: 20,
            overflow: "hidden",
            padding: "0.5rem",
            position: 'sticky',
            bottom: launched ? '4rem' : 'auto',
            marginTop: hasMsgs ? 'auto' : 0
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
            style={{ background: "#241A90", color: "#fff", border: "none", borderRadius: "50%", width: 40, height: 40 }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#3b2dbb")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#241A90")}
            onClick={handleArrowClick}
          >
            <FaArrowRight />
          </button>
        </motion.div>

        {/* Validation/Error */}
        {submitted && !details.trim() && <div className="text-danger mt-2">Please enter something before proceeding.</div>}
        {geoError && <div className="text-warning mt-2">Location unavailable: {geoError}</div>}

        {/* Search Button: fixed below prompt */}
        {launched && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="btn mt-3"
            style={{ maxWidth: 600, width: "100%", background: "#241A90", color: "#fff", padding: "0.75rem", borderRadius: 12, border: "2px solid #241A90", position: 'sticky', bottom: '1rem' }}
            onMouseOver={(e) => { e.currentTarget.style.background = "#3b2dbb"; e.currentTarget.style.borderColor = "#3b2dbb"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "#241A90"; e.currentTarget.style.borderColor = "#241A90"; }}
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
