// services/userService.js
import { location } from "../models/location.js";

// Converts raw JSON into the correct User object type
/*
function createLocationFromApi(data) {
    return new location(data.id, data.name);
}
*/

//get data
export async function getLocationPrices(lat, lng, radius) {
  const res = await fetch(`https://SureCareAPI.azurewebsites.net/api/HttpTriggerCSharp?code=y6Z7N9c12KFZf1bZKu50yoGjuO13WSVBrmBahITtDRtoAzFuLQqxSA==`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ lat, lng, radius })
  });

  // ✅ Check for HTTP failure (like 404)
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API request failed with status ${res.status}: ${errorText}`);
  }

  // ✅ Handle empty or malformed responses gracefully
  const text = await res.text();
  if (!text) {
    throw new Error("API returned an empty response");
  }

  try {
    const data = JSON.parse(text);
    // return createLocationFromApi(data); // only if you're converting it to Location objects
    return data;
  } catch (err) {
    throw new Error("Failed to parse JSON from API: " + text);
  }
}
