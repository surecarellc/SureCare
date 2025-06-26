import React, { useRef, useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaMapMarkerAlt, FaShieldAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useNavigation } from "./utils/goToFunctions.js";
import { geocodeAddress } from "./services/userService";
import LoadingPage from "./components/LoadingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "20px",
};

const centerDefault = { lat: 39.5, lng: -98.35 };

function getDistanceMiles(lat1, lng1, lat2, lng2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const Results = () => {
  const { goToQuestionnairePage } = useNavigation();
  const location = useLocation();
  const allResults = useMemo(() => {
    const rawState = location.state;
    if (Array.isArray(rawState)) return rawState;
    if (Array.isArray(rawState?.results)) return rawState.results;
    return [];
  }, [location.state]);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const mapRef = useRef(null);
  const initialSearchLocation = location.state?.searchLocation || {
    lat: allResults[0]?.lat || centerDefault.lat,
    lng: allResults[0]?.lng || centerDefault.lng,
    address: "Unknown Location",
  };
  const [searchLocation, setSearchLocation] = useState(initialSearchLocation);
  const [selectedInsurance, setSelectedInsurance] = useState(location.state?.insurance || "");
  const mapCenter = {
    lat: searchLocation.lat,
    lng: searchLocation.lng,
  };

  const [radius, setRadius] = useState(5);
  const [newAddress, setNewAddress] = useState("");
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [isProcessingLocation, setIsProcessingLocation] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const debounceTimerRef = useRef(null);
  const [showLoading, setShowLoading] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filteredResults = useMemo(() => {
    if (allResults.length === 0) return [];
    const centerLat = searchLocation.lat;
    const centerLng = searchLocation.lng;

    return allResults.filter((r) => {
      if (!r.lat || !r.lng) return false;
      const dist = getDistanceMiles(centerLat, centerLng, r.lat, r.lng);
      return dist <= radius;
    });
  }, [allResults, radius, searchLocation]);

  const panToLocation = (lat, lng) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(16);
    }
  };

  const handleAddressSubmit = async () => {
    if (!newAddress.trim()) {
      alert("Please enter a valid address.");
      return;
    }
    setIsProcessingLocation(true);
    try {
      let geocodedData;
      if (selectedSuggestion && newAddress === selectedSuggestion.short_display_name) {
        geocodedData = {
          lat: parseFloat(selectedSuggestion.lat),
          lng: parseFloat(selectedSuggestion.lon),
        };
      } else {
        geocodedData = await geocodeAddress(newAddress);
      }
      if (geocodedData && typeof geocodedData.lat === "number" && typeof geocodedData.lng === "number") {
        setSearchLocation({
          lat: geocodedData.lat,
          lng: geocodedData.lng,
          address: newAddress,
        });
        setShowAddressPopup(false);
        setNewAddress("");
        setAddressSuggestions([]);
        setSelectedSuggestion(null);
      } else {
        alert(`Could not find a precise location for the address: "${newAddress}". Please check the address.`);
      }
    } catch (error) {
      console.error("Geocoding API error for address:", newAddress, error);
      alert(`There was an error trying to find the location for "${newAddress}": ${error.message}. Please try again.`);
    } finally {
      setIsProcessingLocation(false);
    }
  };

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

  if (loadError) return (
    <div className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="text-center">
        <h3 className="text-danger mb-3">Error loading maps</h3>
        <p>Please try refreshing the page</p>
      </div>
    </div>
  );

  if (!isLoaded || showLoading) {
    return <LoadingPage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="container d-flex flex-column min-vh-100 justify-content-center align-items-center text-center"
      style={{ paddingTop: "120px", paddingBottom: "80px", maxWidth: "1550px", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />
      <div className="row w-100 d-flex justify-content-center align-items-start flex-grow-1 mt-2">
        <div className="col-md-6">
          <div className="d-flex justify-content-between mb-3">
            <div className="btn-group" style={{ position: "relative" }}>
              <button
                type="button"
                className="btn text-white px-3 py-1"
                onClick={() => {
                  const select = document.getElementById("insurance");
                  select.focus();
                  select.click();
                }}
                style={{
                  backgroundColor: isProcessingLocation ? "#6c757d" : "#343A40",
                  border: "1px solid",
                  borderColor: isProcessingLocation ? "#6c757d" : "#343A40",
                  borderRadius: "20px",
                  fontSize: "0.9rem",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  cursor: isProcessingLocation ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onMouseOver={(e) => {
                  if (!isProcessingLocation) {
                    e.target.style.backgroundColor = "#495057";
                    e.target.style.borderColor = "#495057";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isProcessingLocation) {
                    e.target.style.backgroundColor = "#343A40";
                    e.target.style.borderColor = "#343A40";
                  }
                }}
                disabled={isProcessingLocation}
                aria-label="Select insurance provider"
                title={selectedInsurance || "Select Insurance"}
              >
                <FaShieldAlt size={14} style={{ marginRight: "0.5rem" }} />
                {selectedInsurance || "Select Insurance"}
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
            <div className="btn-group">
              <button
                type="button"
                className="btn dropdown-toggle text-white px-3 py-1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  backgroundColor: "#343A40",
                  border: "1px solid #343A40",
                  borderRadius: "20px",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#495057";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#343A40";
                  e.target.style.borderColor = "#343A40";
                }}
              >
                Filter By
              </button>
              <div className="dropdown-menu p-2" style={{ minWidth: "300px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <p className="text-muted mb-0">Filter options coming soon...{selectedInsurance ? ` (Selected Insurance: ${selectedInsurance})` : ""}</p>
              </div>
            </div>
          </div>
          <div className="card shadow-lg" style={{ borderRadius: "20px", maxHeight: "610px", overflowY: "auto", width: "100%", textAlign: "left" }} aria-live="polite">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-2">Top Matches</h3>
              <hr className="my-3" style={{ borderTop: "2px solid #ddd" }} />
              {filteredResults.length === 0 ? (
                <p className="text-muted">No results found within the selected radius.</p>
              ) : (
                filteredResults.map((result, index) => (
                  <div
                    key={index}
                    className="border-bottom pb-4 mb-4"
                    onClick={() => panToLocation(result.lat, result.lng)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="fw-bold mb-0">{result.name || "Unknown Name"}</h5>
                      <div className="badge bg-secondary text-white px-3 py-2 rounded-pill" style={{ fontSize: "0.9rem" }}>
                        Price: N/A
                      </div>
                    </div>
                    <div className="text-muted mt-2">
                      Address: {result.address || "N/A"} <br />
                      Rating: {result.rating ?? "N/A"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="d-flex justify-content-between mb-3">
            <div className="btn-group">
              <button
                type="button"
                className="btn text-white px-3 py-1"
                onClick={() => setShowAddressPopup(true)}
                style={{
                  backgroundColor: "#343A40",
                  border: "1px solid #343A40",
                  borderRadius: "20px",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#495057";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#343A40";
                  e.target.style.borderColor = "#343A40";
                }}
                disabled={isProcessingLocation}
                aria-label={searchLocation.address !== "Unknown Location" ? `Edit location: ${searchLocation.address}` : "Set location"}
                title={searchLocation.address !== "Unknown Location" ? searchLocation.address : "Set Location"}
              >
                <FaMapMarkerAlt size={14} style={{ marginRight: "0.5rem" }} />
                {searchLocation.address !== "Unknown Location" ? `Location: ${searchLocation.address}` : "Set Location"}
              </button>
            </div>
            <div className="btn-group">
              <button
                type="button"
                className="btn dropdown-toggle text-white px-3 py-1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{
                  backgroundColor: "#343A40",
                  border: "1px solid #343A40",
                  borderRadius: "20px",
                  transition: "background-color 0.3s ease, border-color 0.3s ease",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#495057";
                  e.target.style.borderColor = "#495057";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#343A40";
                  e.target.style.borderColor = "#343A40";
                }}
              >
                Adjust Radius: {radius} mi
              </button>
              <div className="dropdown-menu p-2" style={{ minWidth: "300px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
                <div className="text-center mb-2">
                  <strong>{radius} mile{radius > 1 ? "s" : ""}</strong>
                </div>
                <input
                  type="range"
                  id="dropdownRadiusRange"
                  min="1"
                  max="50"
                  step="1"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
          <div className="card shadow-lg" style={{ borderRadius: "20px", height: "610px", backgroundColor: "#f8f9fa" }}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={10}
              center={mapCenter}
              onLoad={(map) => (mapRef.current = map)}
            >
              {filteredResults.map((result, index) =>
                result.lat && result.lng ? (
                  <Marker
                    key={index}
                    position={{ lat: result.lat, lng: result.lng }}
                    title={result.name}
                  />
                ) : null
              )}
            </GoogleMap>
          </div>
        </div>
      </div>

      <div className="col-12 mt-2 mb-2 d-flex justify-content-center">
        <button
          type="button"
          className="btn text-white px-3 py-1"
          onClick={() => goToQuestionnairePage({ insurance: selectedInsurance, searchLocation })}
          style={{
            backgroundColor: "#343A40",
            border: "1px solid #343A40",
            borderRadius: "20px",
            transition: "background-color 0.3s ease, border-color 0.3s ease",
            fontSize: "0.9rem",
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = "#495057";
            e.target.style.borderColor = "#495057";
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = "#343A40";
            e.target.style.borderColor = "#343A40";
          }}
        >
          Back to Questionnaire
        </button>
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
              <h2 style={{ margin: 0, marginBottom: "0.75rem", fontSize: "1.5rem", fontWeight: "600", color: "#212529", textAlign: "center" }}>
                Where are you located?
              </h2>
              <p style={{ marginTop: 0, marginBottom: "1.25rem", fontSize: "0.95rem", color: "#6c757d", textAlign: "center" }}>
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
                  value={newAddress}
                  onChange={(e) => {
                    setNewAddress(e.target.value);
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
                    if (newAddress) setShowSuggestions(true);
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
                          textAlign: "left",
                        }}
                        onMouseDown={() => {
                          setNewAddress(s.short_display_name);
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
                  onClick={handleAddressSubmit}
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

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000 }}>
        <Footer />
      </div>
    </motion.div>
  );
};

export default Results;