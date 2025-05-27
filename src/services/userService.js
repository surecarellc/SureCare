// services/userService.js

// Existing getLocationPrices function
export async function getLocationPrices(lat, lng, radius) {
  const res = await fetch(`https://SureCareAPI.azurewebsites.net/api/HttpTriggerCSharp?code=y6Z7N9c12KFZf1bZKu50yoGjuO13WSVBrmBahITtDRtoAzFuLQqxSA==`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ lat, lng, radius })
  });

  if (!res.ok) {
    const errorText = await res.text(); // Read error message from API if available
    throw new Error(`API request failed for getLocationPrices with status ${res.status}: ${errorText || res.statusText}`);
  }

  const text = await res.text();
  if (!text) {
    // This case might be rare if res.ok is true, but good for robustness
    throw new Error("getLocationPrices API returned an empty response");
  }

  try {
    const data = JSON.parse(text);
    return data;
  } catch (err) {
    console.error("Failed to parse JSON from getLocationPrices API:", text, err);
    throw new Error("Failed to parse JSON from getLocationPrices API: " + err.message);
  }
}

/**
 * Geocodes an address string to latitude and longitude using Nominatim API.
 * @param {string} address - The address to geocode.
 * @returns {Promise<{lat: number, lng: number} | null>} Coordinates or null if not found/error.
 */
export const geocodeAddress = async (address) => {
  if (!address || address.trim() === "") {
    console.warn("Geocoding: Address is empty.");
    return null;
  }

  // IMPORTANT: Set a descriptive User-Agent for your application
  // See Nominatim's Usage Policy: https://operations.osmfoundation.org/policies/nominatim/
  const appName = "TrueRateApp"; // Replace with your actual app name
  const contactEmail = "your-contact-email@example.com"; // Replace with your contact
  const userAgent = `${appName}/1.0 (${contactEmail})`;

  const encodedAddress = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&addressdetails=1`;

  console.log(`Geocoding address: "${address}" with URL: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": userAgent, // Essential for Nominatim
      },
    });

    if (!response.ok) {
      // Log the error response text if possible
      let errorDetails = `HTTP status ${response.status}`;
      try {
        const errorText = await response.text();
        errorDetails += `: ${errorText}`;
      } catch (e) {
        // Ignore if can't read text
      }
      console.error(`Nominatim API request failed: ${errorDetails}`);
      throw new Error(`Nominatim API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      const firstResult = data[0];
      // Nominatim returns coordinates as strings, convert them to numbers
      const lat = parseFloat(firstResult.lat);
      const lng = parseFloat(firstResult.lon); // Nominatim uses 'lon' for longitude

      if (!isNaN(lat) && !isNaN(lng)) {
        console.log(`Geocoded "${address}" to lat: ${lat}, lng: ${lng}`);
        return { lat, lng };
      } else {
        console.warn(`Nominatim returned invalid coordinates for "${address}":`, firstResult);
        return null;
      }
    } else {
      console.warn(`No results found by Nominatim for address: "${address}"`);
      return null;
    }
  } catch (error) {
    console.error(`Error during geocoding address "${address}":`, error);
    // You might want to re-throw or return null depending on how you want to handle this in the UI
    // For now, returning null to indicate failure.
    return null;
  }
};