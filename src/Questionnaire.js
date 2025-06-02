/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowRight, FaTimes } from "react-icons/fa"; // Added FaTimes
import { useNavigation } from "./utils/goToFunctions";
import { getLocationPrices, geocodeAddress } from "./services/userService"; // Assuming geocodeAddress is in this file

const STORAGE_KEY = "chatMessages";
const TOP_PADDING = 5.5;
const BOTTOM_SPACE = 16.5; // Adjusted for the new "Enter Address" button

const Questionnaire = () => {
  const {
    goToAboutPage,
    goToHelpPage,
    goToSignInPage,
    goToLaunchPage,
    goToResultsPage,
  } = useNavigation();

  const [details, setDetails] = useState("");
  const [, setSubmitted] = useState(false);
  const [address, setAddress] = useState(""); // This will now be used by the popup
  const [showAddressPopup, setShowAddressPopup] = useState(false); // For popup visibility

  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState(null);
  const [showGeoErrorBanner, setShowGeoErrorBanner] = useState(false);
  const geoErrorTimeoutRef = useRef(null);
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by your browser.");
      return;
    }
    const geoWatchId = navigator.geolocation.watchPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoError(null);
        setShowGeoErrorBanner(false);
        if (geoErrorTimeoutRef.current) clearTimeout(geoErrorTimeoutRef.current);
      },
      (err) => {
        setGeoError(err.message);
        setCoords({ lat: null, lng: null });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(geoWatchId);
  }, []);

  const chatRef = useRef(null);
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, showGeoErrorBanner]);

  useEffect(() => {
    if (geoError) {
      setShowGeoErrorBanner(true);
      if (chatRef.current) {
        setTimeout(() => chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 0);
      }
      if (geoErrorTimeoutRef.current) clearTimeout(geoErrorTimeoutRef.current);
      geoErrorTimeoutRef.current = setTimeout(() => setShowGeoErrorBanner(false), 7000);
    } else {
      setShowGeoErrorBanner(false);
      if (geoErrorTimeoutRef.current) clearTimeout(geoErrorTimeoutRef.current);
    }
    return () => { if (geoErrorTimeoutRef.current) clearTimeout(geoErrorTimeoutRef.current); };
  }, [geoError]);

  const isDeviceGeoAvailable = coords.lat !== null && !geoError;
  const isAddressEntered = address.trim() !== ""; // Based on address from popup

  const isSearchDisabled =
    isProcessingLocation ||
    (!isAddressEntered && !isDeviceGeoAvailable);

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
    setIsProcessingLocation(true);

    let searchLat = null;
    let searchLng = null;
    let searchAddressString = "Unknown Location";

    if (isAddressEntered) { // Priority 1: Manually entered address (from popup)
      try {
        console.log(`Attempting to geocode user-entered address: "${address}"`);
        const geocodedData = await geocodeAddress(address);
        if (geocodedData && typeof geocodedData.lat === 'number' && typeof geocodedData.lng === 'number') {
          searchLat = geocodedData.lat;
          searchLng = geocodedData.lng;
          searchAddressString = address;
          console.log(`Successfully geocoded "${address}" to: ${searchLat}, ${searchLng}`);
        } else {
          alert(`Could not find a precise location for the address: "${address}". Please check the address or clear it to use your device's location (if enabled).`);
          setIsProcessingLocation(false);
          return;
        }
      } catch (error) {
        console.error("Geocoding API error for address:", address, error);
        alert(`There was an error trying to find the location for "${address}": ${error.message}. Please try again, or clear the address to use your device's location.`);
        setIsProcessingLocation(false);
        return;
      }
    } else if (isDeviceGeoAvailable) { // Priority 2: Device geolocation
      console.log("Using device geolocation.");
      searchLat = coords.lat;
      searchLng = coords.lng;
      searchAddressString = "Current Device Location";
    } else {
      alert("Location is not available. Please enter a valid address or enable device location services.");
      setIsProcessingLocation(false);
      return;
    }

    try {
      console.log(`Fetching hospitals for: ${searchAddressString} (Lat: ${searchLat}, Lng: ${searchLng})`);
      const hospitals = await getLocationPrices(searchLat, searchLng, 5);
      goToResultsPage({
        results: hospitals,
        searchLocation: {
          lat: searchLat,
          lng: searchLng,
          address: searchAddressString
        },
      });
    } catch (e) {
      console.error("Failed to fetch hospital data:", e);
      alert("Failed to fetch hospital data. Please try again later.");
    } finally {
      setIsProcessingLocation(false);
    }
  };

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
            <span style={{ color: "#241A90" }}>Sure</span>
            <span style={{ color: "#3AADA4" }}>Care</span>
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
          scrollbarGutter: "stable",
        }}
        className="d-flex flex-column align-items-center"
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`d-flex mb-2 ${m.role === "user" ? "justify-content-end" : "justify-content-start"}`}
            style={{ maxWidth: "calc(600px + 1rem)", width: "100%" }}
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
        <AnimatePresence>
          {showGeoErrorBanner && geoError && (
            <motion.div
              key="geoErrorBanner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
              transition={{ duration: 0.5 }}
              style={{
                color: 'red', background: 'rgba(255, 224, 224, 0.9)',
                border: '1px solid rgba(255, 100, 100, 0.5)', padding: '0.75rem 1rem',
                borderRadius: '8px', marginTop: '1rem', textAlign: 'center',
                width: '100%', maxWidth: "calc(600px + 1rem)", boxSizing: 'border-box',
                fontSize: '0.9rem', zIndex: 50,
              }}
            >
              Location Error: {geoError}. Please enable location services or enter an address manually.
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---------- Address Popup Modal ---------- */}
      <AnimatePresence>
        {showAddressPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
              background: "rgba(0,0,0,0.6)", display: "flex",
              alignItems: "center", justifyContent: "center", zIndex: 2000,
            }}
            onClick={() => setShowAddressPopup(false)} // Close on overlay click
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              style={{
                background: "white", padding: "2rem", borderRadius: "12px",
                minWidth: "300px", maxWidth: "500px", width: "90%",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative",
              }}
              onClick={(e) => e.stopPropagation()} // Prevent click from closing if clicking inside popup
            >
              <button
                onClick={() => setShowAddressPopup(false)}
                style={{
                  position: "absolute", top: "1rem", right: "1rem",
                  background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#6c757d"
                }}
                aria-label="Close address popup"
              >
                <FaTimes />
              </button>
              <h4 style={{ marginTop: 0, marginBottom: "1.5rem", color: "#333" }}>Enter Your Address</h4>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="E.g., 1600 Amphitheatre Parkway, Mountain View, CA 94043"
                rows={3}
                style={{
                  width: "100%", marginBottom: "1.5rem", padding: "0.75rem",
                  borderRadius: "8px", border: "1px solid #ced4da", fontSize: "1rem",
                  resize: "none", boxSizing: "border-box"
                }}
                disabled={isProcessingLocation}
              />
              <button
                onClick={() => setShowAddressPopup(false)}
                style={{
                  width: "100%", background: "#241A90", color: "#fff",
                  padding: "0.75rem", borderRadius: "8px", border: "none",
                  fontSize: "1rem", cursor: "pointer",
                }}
                onMouseOver={e => (e.currentTarget.style.background = "#3b2dbb")}
                onMouseOut={e => (e.currentTarget.style.background = "#241A90")}
                disabled={isProcessingLocation}
              >
                Use this Address
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- Inputs Section (static at bottom) ---------- */}
      <div
        style={{
          position: "fixed",
          bottom: "6rem", // Space for footer below this
          left: 0,
          right: 0,
          margin: "0 auto",
          width: "100%",
          maxWidth: "700px",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem", // Adjusted gap for better spacing
          zIndex: 100,
          boxSizing: "border-box",
        }}
      >
        <div className="input-group" style={{ background: "#f8f9fa", border: "2px solid gray", borderRadius: 20, overflow: "hidden", padding: "0.5rem" }}>
          <textarea
            className="form-control border-0 bg-transparent"
            placeholder="Type your symptoms or preferences…" rows={1}
            style={{ resize: "none", boxShadow: "none" }} value={details}
            onChange={e => setDetails(e.target.value)}
            disabled={isProcessingLocation}
          />
          <button
            className="btn"
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "#241A90", color: "#fff", border: "none", borderRadius: "50%",
              width: 40, height: 40, padding: 0, lineHeight: 0,
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#3b2dbb")}
            onMouseOut={e => (e.currentTarget.style.background = "#241A90")}
            onClick={handleArrowClick}
            disabled={isProcessingLocation}
          >
            <FaArrowRight size={16} />
          </button>
        </div>

        {/* Button to open address popup */}
        <button
          className="btn"
          style={{
            width: "100%",
            background: isProcessingLocation ? "#e9ecef" : "#6c757d",
            color: isProcessingLocation ? "#6c757d" : "#fff",
            padding: "0.75rem",
            borderRadius: 12,
            border: "2px solid",
            borderColor: isProcessingLocation ? "#e9ecef" : "#6c757d",
            cursor: isProcessingLocation ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease, border-color 0.2s ease",
            textAlign: "left", // To keep text aligned left if it wraps
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          onMouseOver={e => { if (!isProcessingLocation) { e.currentTarget.style.background = "#5a6268"; e.currentTarget.style.borderColor = "#545b62"; }}}
          onMouseOut={e => { if (!isProcessingLocation) { e.currentTarget.style.background = "#6c757d"; e.currentTarget.style.borderColor = "#6c757d"; }}}
          onClick={() => setShowAddressPopup(true)}
          disabled={isProcessingLocation}
        >
          {isAddressEntered ? `Edit Address: ${address}` : "Enter Address Manually"}
        </button>

        <button
          className="btn"
          disabled={isSearchDisabled}
          style={{
            width: "100%", background: isSearchDisabled ? "#ccc" : "#241A90",
            color: "#fff", padding: "0.75rem", borderRadius: 12, border: "2px solid",
            borderColor: isSearchDisabled ? "#ccc" : "#241A90",
            // marginTop: "0.5rem", // gap property on parent handles this
            cursor: isSearchDisabled ? "not-allowed" : "pointer",
            transition: "background-color 0.2s ease, border-color 0.2s ease",
            fontWeight: "bold",
          }}
          onMouseOver={e => { if (!isSearchDisabled) { e.currentTarget.style.background = "#3b2dbb"; e.currentTarget.style.borderColor = "#3b2dbb"; } }}
          onMouseOut={e => { if (!isSearchDisabled) { e.currentTarget.style.background = "#241A90"; e.currentTarget.style.borderColor = "#241A90"; } }}
          onClick={handleSearchClick}
        >
          {isProcessingLocation ? "Searching..." : "Search For Hospitals Near Me"}
        </button>
      </div>

      {/* ---------- Footer ---------- */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}
        className="text-center p-4 text-muted bg-white shadow-sm border-top"
      >
        © 2025 SureCare. All rights reserved.
      </motion.footer>
    </motion.div>
  );
};

export default Questionnaire;