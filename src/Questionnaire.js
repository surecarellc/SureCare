  /* eslint-disable react-hooks/exhaustive-deps */
  import React, { useState, useEffect, useRef } from "react";
  import { motion } from "framer-motion";
  import { FaArrowRight } from "react-icons/fa";
  import { useNavigation } from "./utils/goToFunctions";
  import { getLocationPrices } from "./services/userService";

  const STORAGE_KEY = "chatMessages";
  // Layout constants (rem)
  const TOP_PADDING = 5.5;   // space below nav
  const BOTTOM_SPACE = 13.5; // space reserved for prompt + search stack

  const Questionnaire = () => {
    const {
      goToAboutPage,
      goToHelpPage,
      goToSignInPage,
      goToLaunchPage,
      goToResultsPage,
    } = useNavigation();

    /* --------------------------------------------------
      Local State
    -------------------------------------------------- */
    const [details, setDetails] = useState("");
    const [, setSubmitted] = useState(false); // no need to read submitted flag

    // chat history persisted in sessionStorage
    const [messages, setMessages] = useState(() => {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    });
    useEffect(() => {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }, [messages]);

    // geolocation
    const [coords, setCoords] = useState({ lat: null, lng: null });
    const [geoError, setGeoError] = useState(null);
    const radiusMiles = 5;
    useEffect(() => {
      if (!navigator.geolocation) {
        setGeoError("Geolocation not supported");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        err => setGeoError(err.message),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    }, []);

    /* --------------------------------------------------
      Refs / Auto‑scroll
    -------------------------------------------------- */
    const chatRef = useRef(null);
    useEffect(() => {
      if (chatRef.current) {
        chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
      }
    }, [messages]);

    /* --------------------------------------------------
      Handlers
    -------------------------------------------------- */
    const handleArrowClick = () => {
      setSubmitted(true);
      if (!details.trim()) return;
      setMessages(prev => [
        ...prev,
        { role: "user", text: details },
        { role: "assistant", text: "This is a placeholder response. I'll connect the real AI response here soon." },
      ]);
      setDetails("");
      setSubmitted(false);
    };

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

    /* --------------------------------------------------
      Render
    -------------------------------------------------- */
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="d-flex flex-column"
        style={{ height: "100vh", overflow: "hidden" }}
      >
        {/* ---------- Nav ---------- */}
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
              <button className="nav-link mx-3" onClick={goToAboutPage}>About</button>
              <button className="nav-link mx-3" onClick={goToHelpPage}>Help</button>
              <button className="nav-link mx-3" onClick={goToSignInPage}>Sign In</button>
            </div>
          </div>
        </nav>

        {/* ---------- Chat Area (scrolls) ---------- */}
        <div
          ref={chatRef}
          style={{
            marginTop: `${TOP_PADDING}rem`,
            height: `calc(100vh - ${TOP_PADDING}rem - ${BOTTOM_SPACE}rem)`,
            overflowY: "auto",
            padding: "1rem",
          }}
          className="d-flex flex-column align-items-center"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`d-flex mb-2 ${m.role === "user" ? "justify-content-end" : "justify-content-start"}`}
              style={{ maxWidth: 600, width: "100%" }}
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

        {/* ---------- Prompt + Search (sliding wrapper) ---------- */}
        <motion.div
          initial={false}
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
            gap: ".05rem",
            padding: "0 1rem",
            zIndex: 100,
          }}
        >
          {/* Prompt */}
          <div
            className="input-group"
            style={{
              marginTop: "1rem", // pushes prompt box down an extra rem
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
              onChange={e => setDetails(e.target.value)}
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
              onMouseOver={e => (e.currentTarget.style.background = "#3b2dbb")}
              onMouseOut={e => (e.currentTarget.style.background = "#241A90")}
              onClick={handleArrowClick}
            >
              <FaArrowRight size={16} />
            </button>
          </div>

          {/* Search button (after first send) */}
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
                marginTop: "1rem", // pushes button down an extra rem
              }}
              onMouseOver={e => {
                e.currentTarget.style.background = "#3b2dbb";
                e.currentTarget.style.borderColor = "#3b2dbb";
              }}
              onMouseOut={e => {
                e.currentTarget.style.background = "#241A90";
                e.currentTarget.style.borderColor = "#241A90";
              }}
              onClick={handleSearchClick}
            >
              Search Hospitals Near Me
            </motion.button>
          )}
        </motion.div>

        {/* ---------- Footer ---------- */}
        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}
          className="text-center p-4 text-muted bg-white shadow-sm border-top"
        >
          © 2025 TrueRate. All rights reserved.
        </motion.footer>
      </motion.div>
    );
  };

  export default Questionnaire;