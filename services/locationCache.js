const locationCache = {};

export const fetchLocationName = async (location) => {
  if (!location) return "No location";

  const url =
    location["@id"] ||
    location.url ||
    (typeof location === "string" ? location : null);

  if (!url) return "No location";

  if (locationCache[url]) return locationCache[url];

  try {
    const response = await fetch(url);
    const data = await response.json();
    const name = data.name?.fi || data.name?.en || "No location";
    locationCache[url] = name;
    return name;
  } catch (error) {
    console.error("Error fetching location:", error);
    return "No location";
  }
};
