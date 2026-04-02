import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("eventsdb");

export const initializeDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      description TEXT,
      start_time TEXT,
      end_time TEXT,
      location_url TEXT
    );
  `);
};

export const addFavorite = async (event) => {
  const id = event.id;
  const name = event.name?.fi || "No title";
  const description =
    event.description?.fi || event.short_description?.fi || "";
  const start_time = event.start_time || "";
  const end_time = event.end_time || "";
  const location_url =
    typeof event.location === "string"
      ? event.location
      : event.location?.url || "";

  await db.runAsync(
    `INSERT OR REPLACE INTO favorites
      (id, name, description, start_time, end_time, location_url)
      VALUES (?, ?, ?, ?, ?, ?);`,
    id,
    name,
    description,
    start_time,
    end_time,
    location_url,
  );
};

export const getFavorites = async () => {
  return await db.getAllAsync(
    "SELECT * FROM favorites ORDER BY start_time ASC",
  );
};

export const removeFavorite = async (id) => {
  await db.runAsync("DELETE FROM favorites WHERE id = ?", id);
};

export const isFavorite = async (id) => {
  const result = await db.getFirstAsync(
    "SELECT id FROM favorites WHERE id = ?",
    id,
  );
  return result !== null;
};
