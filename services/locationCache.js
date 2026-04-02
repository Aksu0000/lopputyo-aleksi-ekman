const locationCache = {};

export const fetchLocationName = async (location) => {
  if (!location) return "No location";

  const url = location.url || (typeof location === "string" ? location : null);
  if (!url) return "No location";

  if (locationCache[url]) return locationCache[url];

  try {
    const response = await fetch(url + "?format=json");
    const data = await response.json();
    const name = data.name?.fi || "No location";
    locationCache[url] = name;
    return name;
  } catch (error) {
    console.error("Error fetching location:", error);
    return "No location";
  }
};