export const fetchEvents = async () => {
  try {
    const response = await fetch(
      'https://api.hel.fi/linkedevents/v1/event/?format=json&city=helsinki'
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};