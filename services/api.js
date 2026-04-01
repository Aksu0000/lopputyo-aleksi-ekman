export const fetchEvents = async () => {
  const allEvents = [];
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await fetch(
        `https://api.hel.fi/linkedevents/v1/event/?format=json&page=${page}`
      );
      const data = await response.json();

      allEvents.push(...data.data);

      totalPages = data.meta.total_pages;
      page += 1;
    } while (page <= totalPages);

    return allEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};