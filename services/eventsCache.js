import { fetchEventsPage } from "./api";

let eventsCache = [];
let loadingPromise = null;
let listeners = new Set();

const mergeById = (oldItems, newItems) => {
  const map = new Map();

  for (const item of oldItems) {
    if (item?.id) map.set(item.id, item);
  }
  for (const item of newItems) {
    if (item?.id) map.set(item.id, item);
  }

  return Array.from(map.values());
};

const notify = () => {
  listeners.forEach((fn) => fn(eventsCache));
};

export const subscribeEvents = (callback) => {
  listeners.add(callback);
  callback(eventsCache);
  return () => listeners.delete(callback);
};

export const startEventsStream = async () => {
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const now = new Date();
    let page = 1;

    try {
      while (true) {
        const { data } = await fetchEventsPage(page);
        if (!data || data.length === 0) break;

        const upcoming = data.filter((event) => {
          if (!event.start_time) return false;
          return new Date(event.start_time) >= now;
        });

        eventsCache = mergeById(eventsCache, upcoming);
        eventsCache = [...eventsCache].sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time),
        );

        notify();
        page++;
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (err) {
      console.error("eventsCache error:", err);
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};

export const clearEventsCache = () => {
  eventsCache = [];
  notify();
};
