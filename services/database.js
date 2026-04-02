import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("eventsdb");

export const initializeDB = async () => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT
    );
  `);
};

export const addFavorite = async (id, name) => {
  await db.runAsync(
    "INSERT INTO favorites (id, name) VALUES (?, ?);",
    id,
    name
  );
};

export const getFavorites = async () => {
  const result = await db.getAllAsync("SELECT * FROM favorites");
  return result;
};

export const removeFavorite = async (id) => {
  await db.runAsync("DELETE FROM favorites WHERE id = ?", id);
};