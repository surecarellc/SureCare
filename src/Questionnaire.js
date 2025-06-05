
import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa"; // Added FaTimes
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion } from "framer-motion";
import { getLocationPrices, geocodeAddress } from "./services/userService"; // Assuming geocodeAddress is in this file

const STORAGE_KEY = "chatMessages";
const TOP_PADDING = 5.5;

const Questionnaire = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });
  const [inputValue, setInputValue] = useState("");
  const [address, setAddress] = useState(""); // This will now be used by the popup
  const [showAddressPopup, setShowAddressPopup] = useState(true); // For popup visibility, now true by default

  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState(null);
  const [showGeoErrorBanner, setShowGeoErrorBanner] = useState(false);
  const geoErrorTimeoutRef = useRef(null);
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);

  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef(null);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage = {
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiMessage = {
        text: "This is a simulated response. In the actual implementation, this would be replaced with the AI's response.",
        sender: "ai",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      
    }, 1000);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
      navigate("/results", { state: { results: hospitals, searchLocation: { lat: searchLat, lng: searchLng, address: searchAddressString } } });
    } catch (e) {
      console.error("Failed to fetch hospital data:", e);
      alert("Failed to fetch hospital data. Please try again later.");
    } finally {
      setIsProcessingLocation(false);
    }
  };

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

  // Fetch address suggestions from Nominatim with debounce and sorting by relevance
  const fetchAddressSuggestions = async (query) => {
    if (!query || query.trim() === "") {
      setAddressSuggestions([]);
      return;
    }
    const encoded = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=5&countrycodes=us`;
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'SureCare/1.0 (contact@surecare.com)' }
      });
      if (!res.ok) return;
      const data = await res.json();
      // Only include suggestions that have a house_number and road (i.e., full street address)
      const filteredData = data.filter(s => {
        const addr = s.address || {};
        return addr.house_number && addr.road;
      });
      // Sort suggestions by importance (higher importance means closer match)
      const sortedData = filteredData.sort((a, b) => b.importance - a.importance);
      setAddressSuggestions(sortedData);
    } catch {
      setAddressSuggestions([]);
    }
  };

  // Debounced version of fetchAddressSuggestions
  const debouncedFetchSuggestions = (query) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchAddressSuggestions(query);
    }, 300); // 300ms debounce
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.7 }}
      className="d-flex flex-column"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      <Navbar />

      {/* ---------- Chat Area (scrolls) ---------- */}
      <div className="flex-grow-1 d-flex flex-column" style={{ marginTop: "60px", paddingBottom: "6rem" }}>
        <div
          ref={chatRef}
          style={{
            marginTop: `${TOP_PADDING}rem`,
            height: `calc(100vh - ${TOP_PADDING}rem - 13rem)`,
            overflowY: "auto",
            padding: "1rem",
            paddingBottom: "12rem",
            scrollbarGutter: "stable",
          }}
          className="d-flex flex-column align-items-center"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`d-flex mb-2 ${m.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
              style={{ maxWidth: "calc(600px + 1rem)", width: "100%" }}
            >
              <div
                style={{
                  background: m.sender === "user" ? "#3AADA4" : "#e9ecef",
                  color: m.sender === "user" ? "#fff" : "#000",
                  borderRadius: 12,
                  padding: "0.5rem 1rem",
                  maxWidth: "80%",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
          {showGeoErrorBanner && geoError && (
            <div
              style={{
                color: 'red', background: 'rgba(255, 224, 224, 0.9)',
                border: '1px solid rgba(255, 100, 100, 0.5)', padding: '0.75rem 1rem',
                borderRadius: '8px', marginTop: '1rem', textAlign: 'center',
                width: '100%', maxWidth: "calc(600px + 1rem)", boxSizing: 'border-box',
                fontSize: '0.9rem', zIndex: 50,
              }}
            >
              Location Error: {geoError}. Please enable location services or enter an address manually.
            </div>
          )}
        </div>

        {/* ---------- Address Popup Modal ---------- */}
        {showAddressPopup && (
          <div
            style={{
              position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
              background: "rgba(0,0,0,0.6)", display: "flex",
              alignItems: "center", justifyContent: "center", zIndex: 2000,
            }}
            onClick={() => setShowAddressPopup(false)}
          >
            <div
              style={{
                background: "white", padding: "2rem", borderRadius: "12px",
                minWidth: "300px", maxWidth: "500px", width: "90%",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)", position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
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
                onChange={e => {
                  setAddress(e.target.value);
                  debouncedFetchSuggestions(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder="E.g., 1600 Amphitheatre Parkway, Mountain View, CA 94043"
                rows={3}
                style={{
                  width: "100%", marginBottom: "1.5rem", padding: "0.75rem",
                  borderRadius: "8px", border: "1px solid #ced4da", fontSize: "1rem",
                  resize: "none", boxSizing: "border-box"
                }}
                disabled={isProcessingLocation}
                onFocus={() => { if (address) setShowSuggestions(true); }}
                onBlur={() => setShowSuggestions(false)}
              />
              {showSuggestions && addressSuggestions.length > 0 && (
                <div style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "calc(100% + 4px)",
                  background: "#fff",
                  border: "1px solid #ced4da",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  zIndex: 3000,
                  maxHeight: "180px",
                  overflowY: "auto",
                  marginTop: "-1.5rem"
                }}>
                  {addressSuggestions.map((s, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: "0.75rem 1rem",
                        cursor: "pointer",
                        borderBottom: idx !== addressSuggestions.length - 1 ? "1px solid #eee" : "none",
                        fontSize: "1rem"
                      }}
                      onMouseDown={() => {
                        setAddress(s.display_name);
                        setShowSuggestions(false);
                        setAddressSuggestions([]);
                      }}
                    >
                      {s.display_name}
                    </div>
                  ))}
                </div>
              )}
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
            </div>
          </div>
        )}

        {/* ---------- Inputs Section (static at bottom) ---------- */}
        <div
          style={{
            position: "fixed",
            bottom: "8rem",
            left: 0,
            right: 0,
            margin: "0 auto",
            width: "100%",
            maxWidth: "700px",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            zIndex: 100,
            boxSizing: "border-box",
            backgroundColor: "white"
          }}
        >
          <div className="input-group" style={{ background: "#f8f9fa", border: "2px solid #ced4da", borderRadius: 20, overflow: "hidden", padding: "0.5rem", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
            <textarea
              className="form-control border-0 bg-transparent"
              placeholder="Type your symptoms or preferences…" rows={1}
              style={{ resize: "none", boxShadow: "none" }} value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
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
              onClick={handleSubmit}
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
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
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
              cursor: isSearchDisabled ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease, border-color 0.2s ease",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onMouseOver={e => { if (!isSearchDisabled) { e.currentTarget.style.background = "#3b2dbb"; e.currentTarget.style.borderColor = "#3b2dbb"; } }}
            onMouseOut={e => { if (!isSearchDisabled) { e.currentTarget.style.background = "#241A90"; e.currentTarget.style.borderColor = "#241A90"; } }}
            onClick={handleSearchClick}
          >
            {isProcessingLocation ? "Searching..." : "Search For Hospitals Near Me"}
          </button>
        </div>
      </div>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Footer />
      </div>
    </motion.div>
  );
};

export default Questionnaire;