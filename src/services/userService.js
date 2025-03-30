// services/userService.js
import { location } from "../models/location.js";

// Converts raw JSON into the correct User object type
function createLocationFromApi(data) {
    return new location(data.id, data.name);
}

// Get user by inputs
export async function getUserById(name, age) {
    const res = await fetch(`https://SureCareAPI.azurewebsites.net/api/HttpTriggerCSharp?code=y6Z7N9c12KFZf1bZKu50yoGjuO13WSVBrmBahITtDRtoAzFuLQqxSA==`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          age: age
        })
      });
  const data = await res.text();
  return createLocationFromApi(data);
}