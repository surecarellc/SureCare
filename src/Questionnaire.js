import React, { useState, useEffect, useRef } from "react";
import { FaArrowRight, FaTimes, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { getLocationPrices, geocodeAddress } from "./services/userService";
import LoadingPage from "./components/LoadingPage";

const STORAGE_KEY = "chatMessages";
const TOP_PADDING = 2;

const Questionnaire = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [messages, setMessages] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState("");
  const [address, setAddress] = useState(location.state?.searchLocation?.address || "");
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [coords, setCoords] = useState({
    lat: location.state?.searchLocation?.lat || null,
    lng: location.state?.searchLocation?.lng || null,
  });
  const [geoError, setGeoError] = useState(null);
  const [showGeoErrorBanner, setShowGeoErrorBanner] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState(location.state?.insurance || "");
  // Initialize showAddressPopup without isDeviceGeoAvailable
  const [showAddressPopup, setShowAddressPopup] = useState(
    !location.state?.searchLocation && !(coords.lat !== null && !geoError)
  );
  const geoErrorTimeoutRef = useRef(null);
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimerRef = useRef(null);
  const chatRef = useRef(null);

  const insuranceCompanies = [
    "No Insurance",
    "UnitedHealthcare",
    "Blue Cross Blue Shield",
    "Aetna",
    "Cigna",
    "Humana",
    "Kaiser Permanente",
    "Anthem",
    "Molina Healthcare",
  ];

  // Update selectedInsurance and location when location.state changes
  useEffect(() => {
    console.log("Questionnaire.js location.state:", location.state);
    if (location.state?.insurance) {
      setSelectedInsurance(location.state.insurance);
    }
    if (location.state?.searchLocation) {
      setAddress(location.state.searchLocation.address || "");
      setCoords({
        lat: location.state.searchLocation.lat || null,
        lng: location.state.searchLocation.lng || null,
      });
      setShowAddressPopup(false); // Avoid showing popup if searchLocation exists
    }
  }, [location.state]);

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
          insurance: selectedInsurance,
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
      return address;
    } else if (isDeviceGeoAvailable) {
      return "Current Location";
    } else {
      return "Enter Address";
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
      style={{ minHeight: "100vh", position: "relative", fontFamily: "'Inter', sans-serif" }}
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
            paddingBottom: "9rem",
            scrollbarGutter: "stable",
          }}
          className="d-flex flex-column align-items-center"
        >
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`d-flex mb-2 ${m.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
              style={{ maxWidth: "calc(600px + 1rem)", width: "100%" }}
            >
              <div
                style={{
                  background: m.sender === "user" ? "#3AADA4" : "#ffffff",
                  color: m.sender === "user" ? "#fff" : "#212529",
                  borderRadius: "16px",
                  padding: "0.75rem 1.25rem",
                  maxWidth: "80%",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  fontSize: "0.95rem",
                }}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
          {showGeoErrorBanner && geoError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                color: "#721c24",
                background: "#f8d7da",
                border: "1px solid #f5c6cb",
                padding: "0.75rem 1.25rem",
                borderRadius: "8px",
                marginTop: "1rem",
                textAlign: "center",
                width: "100%",
                maxWidth: "calc(600px + 1rem)",
                boxSizing: "border-box",
                fontSize: "0.9rem",
                zIndex: 50,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              Location Error: {geoError}. Please enable location services or enter an address manually.
            </motion.div>
          )}
          {isProcessingLocation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="d-flex justify-content-start mb-2"
            >
              <div
                style={{
                  background: "#e9ecef",
                  borderRadius: "16px",
                  padding: "0.75rem 1.25rem",
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                <LoadingPage />
              </div>
            </motion.div>
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
            gap: "0.75rem",
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

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1, position: "relative", maxWidth: "calc(50% - 0.5rem)" }}>
              <button
                onClick={() => {
                  const select = document.getElementById("insurance");
                  select.focus();
                  select.click();
                }}
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  background: isProcessingLocation ? "#e9ecef" : "#3AADA4",
                  color: "#fff",
                  padding: "0.75rem 0.5rem 0.75rem 2.5rem",
                  borderRadius: 10,
                  border: "none",
                  cursor: isProcessingLocation ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  boxShadow: isProcessingLocation ? "none" : "0 3px 6px rgba(58, 173, 164, 0.3)",
                  width: "100%",
                  height: "44px",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  if (!isProcessingLocation) {
                    e.currentTarget.style.background = "#2e8b7f";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isProcessingLocation) {
                    e.currentTarget.style.background = "#3AADA4";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
                disabled={isProcessingLocation}
                aria-label="Select insurance provider"
                title={selectedInsurance || "Select Insurance"}
              >
                <FaShieldAlt
                  size={16}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    color: "#fff",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "calc(100% - 0.25rem)",
                  }}
                >
                  {selectedInsurance || "Select Insurance"}
                </span>
              </button>
              <select
                id="insurance"
                value={selectedInsurance}
                onChange={(e) => setSelectedInsurance(e.target.value)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: isProcessingLocation ? "not-allowed" : "pointer",
                }}
                disabled={isProcessingLocation}
              >
                <option value="" disabled>
                  Select Insurance
                </option>
                {insuranceCompanies.map((company, idx) => (
                  <option key={idx} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1, position: "relative", maxWidth: "calc(50% - 0.5rem)" }}>
              <button
                id="address"
                className="btn"
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  background: isProcessingLocation ? "#e9ecef" : "#3AADA4",
                  color: "#fff",
                  padding: "0.75rem 0.5rem 0.75rem 2.5rem",
                  borderRadius: 10,
                  border: "none",
                  cursor: isProcessingLocation ? "not-allowed" : "pointer",
                  transition: "all 0.3s ease",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  boxShadow: isProcessingLocation ? "none" : "0 3px 6px rgba(58, 173, 164, 0.3)",
                  width: "100%",
                  height: "44px",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={(e) => {
                  if (!isProcessingLocation) {
                    e.currentTarget.style.background = "#2e8b7f";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isProcessingLocation) {
                    e.currentTarget.style.background = "#3AADA4";
                    e.currentTarget.style.transform = "translateY(0)";
                  }
                }}
                onClick={() => setShowAddressPopup(true)}
                disabled={isProcessingLocation}
                aria-label={isAddressEntered ? `Edit address: ${address}` : "Enter address manually"}
                title={isAddressEntered ? address : "Enter address manually"}
              >
                <FaMapMarkerAlt
                  size={16}
                  style={{
                    position: "absolute",
                    left: "1rem",
                    color: "#fff",
                  }}
                />
                <span
                  style={{
                    display: "block",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "calc(100% - 0.25rem)",
                  }}
                >
                  {getLocationButtonText()}
                </span>
              </button>
            </div>
          </div>

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
              "Find Hospitals Near Me"
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