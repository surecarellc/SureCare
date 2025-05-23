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

  // load/persist chat history
  const [messages, setMessages] = useState(() => {
    try {
      const s = sessionStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState(null);
  const radiusMiles = 5;

  // get geolocation
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

  // arrow click: push placeholder messages
  const handleArrowClick = () => {
    setSubmitted(true);
    if (!details.trim()) return;
    setMessages((m) => [
      ...m,
      { role: "user", text: details },
      {
        role: "assistant",
        text:
          "This is a placeholder response. I'll connect the real AI response here soon.",
      },
    ]);
    setDetails("");
    setSubmitted(false);
  };

  // real search
  const handleSearchClick = async () => {
    if (!coords.lat) {
      console.error("No location:", geoError || "still fetching");
      return;
    }
    const hospitals = await getLocationPrices(
      coords.lat,
      coords.lng,
      radiusMiles
    );
    goToResultsPage({ results: hospitals });
  };

  const hasMsgs = messages.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="d-flex flex-column min-vh-100"
    >
      {/* Nav */}
      <nav
        className="navbar navbar-light bg-white shadow-sm border-bottom px-0"
        style={{ position: "fixed", top: 0, width: "100vw", zIndex: 1000 }}
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

      {/* Main Content */}
      <div
        className={`flex-fill d-flex flex-column align-items-center ${
          hasMsgs ? "" : "justify-content-center"
        }`}
        style={{ padding: "6rem 1rem 2rem", position: "relative" }}
      >
        {hasMsgs && (
          <div
            style={{
              maxWidth: 600,
              width: "100%",
              flex: 1,
              overflowY: "auto",
              marginBottom: "1rem",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`d-flex mb-2 ${
                  m.role === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  style={{
                    background: m.role === "user" ? "#3AADA4" : "#e9ecef",
                    color: m.role === "user" ? "#fff" : "#000",
                    borderRadius: 12,
                    padding: "0.5rem 1rem",
                    maxWidth: "80%",
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* —— Single sliding wrapper —— */}
      <motion.div
        initial={false} // skip initial mount anim
        animate={{
          top: hasMsgs ? "auto" : "50%",
          bottom: hasMsgs ? "6rem" : "auto",
          y: hasMsgs ? 0 : "-50%",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          margin: "0 auto",
          width: "100%",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          zIndex: 100,
        }}
      >
        {/* Prompt box */}
        <div
          className="input-group"
          style={{
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
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#241A90",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              padding: 0,
              lineHeight: 0,
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#3b2dbb")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#241A90")}
            onClick={handleArrowClick}
          >
            <FaArrowRight size={16} />
          </button>
        </div>

        {/* Search button (only after first send) */}
        {hasMsgs && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="btn"
            style={{
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
      </motion.div>

      {/* Footer */}
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