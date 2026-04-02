// services/api.js

// Hakee yhden sivun
export const fetchEventsPage = async (page = 1) => {
  const response = await fetch(
    `https://api.hel.fi/linkedevents/v1/event/?format=json&page=${page}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  return await response.json();
};