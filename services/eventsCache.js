import { fetchEventsPage } from "./api";

/**
 * 🧠 STREAMING CACHE
 * - data ei odota valmistumista
 * - UI saa päivityksiä reaaliajassa
 */

let eventsCache = [];
let loadingPromise = null;
let listeners = new Set();

/**
 * 🔔 notify UI:lle
 */
const notify = () => {
  listeners.forEach((fn) => fn(eventsCache));
};

/**
 * 📡 subscribe UI:lle
 */
export const subscribeEvents = (callback) => {
  listeners.add(callback);

  // heti initial data
  callback(eventsCache);

  return () => listeners.delete(callback);
};

/**
 * 🚀 pääloaderi (streaming)
 */
export const startEventsStream = async () => {
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const seenNames = new Set();
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

        const unique = upcoming.filter((event) => {
          const name = event.name?.fi || "";
          if (seenNames.has(name)) return false;
          seenNames.add(name);
          return true;
        });

        // 👉 LISÄTÄÄN CACHEEN INCREMENTALLY
        eventsCache = [...eventsCache, ...unique];

        eventsCache.sort(
          (a, b) => new Date(a.start_time) - new Date(b.start_time),
        );

        notify(); // 🔥 UI päivittyy heti

        page++;

        // pieni throttlaus ettei API kuole
        await new Promise((r) => setTimeout(r, 200));
      }
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
};

/**
 * 🧹 reset (tarvittaessa)
 */
export const clearEventsCache = () => {
  eventsCache = [];
  notify();
};
