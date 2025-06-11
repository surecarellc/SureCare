import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { getLocationPrices, geocodeAddress } from "./services/userService";
import LoadingPage from "./components/LoadingPage";

const STORAGE_KEY = "chatMessages";
const TOP_PADDING = 2;

const Questionnaire = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState("");
  const [address, setAddress] = useState("");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(true);
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [geoError, setGeoError] = useState(null);
  const [showGeoErrorBanner, setShowGeoErrorBanner] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(""); // New state for insurance
  const geoErrorTimeoutRef = useRef(null);
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef(null);
  const chatRef = useRef(null);

  // List of popular U.S. health insurance companies
  const insuranceCompanies = [
    "Select Insurance",
    "UnitedHealthcare",
    "Blue Cross Blue Shield",
    "Aetna",
    "Cigna",
    "Humana",
    "Kaiser Permanente",
    "Anthem",
    "Molina Healthcare",
  ];

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
    return () => {
      if (geoErrorTimeoutRef.current) clearTimeout(geoErrorTimeoutRef.current);
    };
  }, [geoError]);

  const isDeviceGeoAvailable = coords.lat !== null && !geoError;
  const isAddressEntered = address.trim() !== "";
  const isSearchDisabled = isProcessingLocation || (!isAddressEntered && !isDeviceGeoAvailable);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      text: inputValue,
      sender: "user",
      timestamp: new Date().toLocaleTimeString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

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
    const startTime = Date.now();

    let searchLat = null;
    let searchLng = null;
    let searchAddressString = "Unknown Location";

    if (selectedSuggestion && address === selectedSuggestion.short_display_name) {
      searchLat = parseFloat(selectedSuggestion.lat);
      searchLng = parseFloat(selectedSuggestion.lon);
      searchAddressString = address;
    } else if (isAddressEntered) {
      try {
        console.log(`Attempting to geocode user-entered address: "${address}"`);
        const geocodedData = await geocodeAddress(address);
        if (geocodedData && typeof geocodedData.lat === "number" && typeof geocodedData.lng === "number") {
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
    } else if (isDeviceGeoAvailable) {
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

      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 2000 - elapsedTime);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      navigate("/results", {
        state: {
          results: hospitals,
          searchLocation: { lat: searchLat, lng: searchLng, address: searchAddressString },
          insurance: selectedInsurance, // Pass selected insurance to results
        },
      });
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
        setShowAddressPopup(false);
      },
      (err) => {
        setGeoError(err.message);
        setCoords({ lat: null, lng: null });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
    return () => navigator.geolocation.clearWatch(geoWatchId);
  }, []);

  const fetchAddressSuggestions = async (query) => {
    if (!query || query.trim() === "") {
      setAddressSuggestions([]);
      return;
    }
    const encoded = encodeURIComponent(query);
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&addressdetails=1&limit=5&countrycodes=us`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "SureCare/1.0 (contact@surecare.com)" },
      });
      if (!res.ok) return;
      const data = await res.json();
      const filteredData = data.filter((s) => {
        const addr = s.address || {};
        return addr.house_number && addr.road;
      });
      const suggestionsWithShortName = filteredData.map((s) => {
        const addr = s.address;
        const street = [addr.house_number, addr.road].filter(Boolean).join(" ");
        const city = addr.city || addr.town || addr.village;
        const state = addr.state;
        const postcode = addr.postcode;
        const short_display_name = [street, city, state, postcode].filter(Boolean).join(", ");
        return { ...s, short_display_name };
      });
      setAddressSuggestions(suggestionsWithShortName);
    } catch {
      setAddressSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = (query) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      fetchAddressSuggestions(query);
    }, 300);
  };

  const getLocationButtonText = () => {
    if (isAddressEntered) {
      return `Edit Address: ${address}`;
    } else if (isDeviceGeoAvailable) {
      return "Using This Device's Location (Click to Enter Different Address)";
    } else {
      return "Enter Address Manually";
    }
  };

  if (isProcessingLocation) {
    return <LoadingPage />;
  }

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
      <div className="flex-grow-1 d-flex flex-column" style={{ marginTop: "3.5rem" }}>
        <div
          ref={chatRef}
          style={{
            marginTop: `${TOP_PADDING}rem`,
            height: `calc(100vh - ${TOP_PADDING}rem - 13rem)`,
            overflowY: "auto",
            padding: "1rem",
            paddingBottom: "13rem",
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
                color: "red",
                background: "rgba(255, 224, 224, 0.9)",
                border: "1px solid rgba(255, 100, 100, 0.5)",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                marginTop: "1rem",
                textAlign: "center",
                width: "100%",
                maxWidth: "calc(600px + 1rem)",
                boxSizing: "border-box",
                fontSize: "0.9rem",
                zIndex: 50,
              }}
            >
              Location Error: {geoError}. Please enable location services or enter an address manually.
            </div>
          )}
          {isProcessingLocation && (
            <div className="d-flex justify-content-start mb-2">
              <div
                style={{
                  background: "#e9ecef",
                  borderRadius: 12,
                  padding: "0.5rem 1rem",
                }}
              >
                <LoadingPage />
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {showAddressPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2000,
              }}
              onClick={() => setShowAddressPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  background: "#fff",
                  padding: "1.75rem 1.5rem 1.25rem",
                  borderRadius: "16px",
                  width: "90%",
                  maxWidth: "480px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowAddressPopup(false)}
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                    background: "none",
                    border: "none",
                    fontSize: "1.5rem",
                    color: "#666",
                    cursor: "pointer",
                  }}
                  aria-label="Close popup"
                >
                  <FaTimes />
                </button>
                <h2
                  style={{
                    margin: 0,
                    marginBottom: "0.75rem",
                    fontSize: "1.5rem",
                    fontWeight: "600",
                    color: "#212529",
                    textAlign: "center",
                  }}
                >
                  Where are you located?
                </h2>
                <p
                  style={{
                    marginTop: 0,
                    marginBottom: "1.25rem",
                    fontSize: "0.95rem",
                    color: "#6c757d",
                    textAlign: "center",
                  }}
                >
                  Enter your address so we can show hospitals near you.
                </p>
                <div style={{ position: "relative", width: "100%" }}>
                  <FaMapMarkerAlt
                    size={18}
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "0.85rem",
                        transform: "translateY(-50%)",
                        color: "#6c757d",
                        pointerEvents: "none",
                    }}
                  />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      debouncedFetchSuggestions(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder="E.g., 123 Main St, Austin, TX"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.5rem",
                      borderRadius: "8px",
                      border: "1px solid #ced4da",
                      fontSize: "1rem",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                    disabled={isProcessingLocation}
                    onFocus={() => {
                      if (address) setShowSuggestions(true);
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  />
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        top: "calc(100% + 8px)",
                        background: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        zIndex: 3000,
                        maxHeight: "200px",
                        overflowY: "auto",
                        marginTop: "0.5rem",
                      }}
                    >
                      {addressSuggestions.map((s, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: "0.875rem 1rem",
                            cursor: "pointer",
                            borderBottom: idx !== addressSuggestions.length - 1 ? "1px solid #eee" : "none",
                            fontSize: "1rem",
                            color: "#333",
                            background: "#fff",
                            transition: "background 0.2s ease",
                          }}
                          onMouseDown={() => {
                            setAddress(s.short_display_name);
                            setSelectedSuggestion(s);
                            setShowSuggestions(false);
                            setAddressSuggestions([]);
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
                        >
                          {s.short_display_name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <button
                    onClick={() => setShowAddressPopup(false)}
                    style={{
                      marginTop: "0.75rem",
                      padding: "0.65rem 1rem",
                      background: "#241A90",
                      color: "#fff",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      transition: "background 0.2s ease",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = "#3b2dbb")}
                    onMouseOut={(e) => (e.currentTarget.style.background = "#241A90")}
                    disabled={isProcessingLocation}
                  >
                    Use This Address
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div
          style={{
            position: "fixed",
            bottom: "6rem",
            left: 0,
            right: 0,
            margin: "0 auto",
            width: "100%",
            maxWidth: "700px",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem", // Reduced gap to maintain tight spacing
            zIndex: 100,
            boxSizing: "border-box",
            backgroundColor: "white",
          }}
        >
          <div
            className="input-group"
            style={{
              background: "#f8f9fa",
              border: "2px solid #ced4da",
              borderRadius: 20,
              overflow: "hidden",
              padding: "0.5rem",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <textarea
              className="form-control border-0 bg-transparent"
              placeholder="Type your symptoms or preferences…"
              rows={1}
              style={{ resize: "none", boxShadow: "none" }}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={isProcessingLocation}
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
              onClick={handleSubmit}
              disabled={isProcessingLocation}
            >
              <FaArrowRight size={16} />
            </button>
          </div>

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
              textAlign: "left",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) => {
              if (!isProcessingLocation) {
                e.currentTarget.style.background = "#5a6268";
                e.currentTarget.style.borderColor = "#545b62";
              }
            }}
            onMouseOut={(e) => {
              if (!isProcessingLocation) {
                e.currentTarget.style.background = "#6c757d";
                e.currentTarget.style.borderColor = "#6c757d";
              }
            }}
            onClick={() => setShowAddressPopup(true)}
            disabled={isProcessingLocation}
          >
            {getLocationButtonText()}
          </button>

          <select
            value={selectedInsurance}
            onChange={(e) => setSelectedInsurance(e.target.value)}
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
              fontSize: "1rem",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              appearance: "none", // Remove default browser styling
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23fff' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E")`, // Custom arrow
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              backgroundSize: "12px",
            }}
            onMouseOver={(e) => {
              if (!isProcessingLocation) {
                e.currentTarget.style.background = "#5a6268";
                e.currentTarget.style.borderColor = "#545b62";
              }
            }}
            onMouseOut={(e) => {
              if (!isProcessingLocation) {
                e.currentTarget.style.background = "#6c757d";
                e.currentTarget.style.borderColor = "#6c757d";
              }
            }}
            disabled={isProcessingLocation}
          >
            {insuranceCompanies.map((company, idx) => (
              <option key={idx} value={company} disabled={company === "Select Insurance"}>
                {company}
              </option>
            ))}
          </select>

          <button
            className="btn"
            disabled={isSearchDisabled}
            style={{
              width: "100%",
              background: isSearchDisabled ? "#ccc" : "#241A90",
              color: "#fff",
              padding: "0.75rem",
              borderRadius: 12,
              border: "2px solid",
              borderColor: isSearchDisabled ? "#ccc" : "#241A90",
              cursor: isSearchDisabled ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease, border-color 0.2s ease",
              fontWeight: "bold",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
            onMouseOver={(e) => {
              if (!isSearchDisabled) {
                e.currentTarget.style.background = "#3b2dbb";
                e.currentTarget.style.borderColor = "#3b2dbb";
              }
            }}
            onMouseOut={(e) => {
              if (!isSearchDisabled) {
                e.currentTarget.style.background = "#241A90";
                e.currentTarget.style.borderColor = "#241A90";
              }
            }}
            onClick={handleSearchClick}
          >
            {isProcessingLocation ? (
              <div className="d-flex align-items-center justify-content-center">
                <LoadingPage />
              </div>
            ) : (
              "Search For Hospitals Near Me"
            )}
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