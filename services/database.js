import { useSQLiteContext } from "expo-sqlite";
import { useCallback } from "react";

export const useDatabase = () => {
  const db = useSQLiteContext();

  const addFavorite = useCallback(
    async (event) => {
      const id = String(event.id);
      const name = event.name?.fi || "No title";
      const description =
        event.description?.fi || event.short_description?.fi || "";
      const start_time = event.start_time || "";
      const end_time = event.end_time || "";
      const location_url =
        typeof event.location === "string"
          ? event.location
          : event.location?.url || "";

      try {
        await db.runAsync(
          `INSERT OR REPLACE INTO favorites
        (id, name, description, start_time, end_time, location_url)
        VALUES (?, ?, ?, ?, ?, ?)`,
          id,
          name,
          description,
          start_time,
          end_time,
          location_url,
        );
      } catch (error) {
        console.error("Error adding favorite:", error);
      }
    },
    [db],
  );

  const removeFavorite = useCallback(
    async (id) => {
      try {
        await db.runAsync("DELETE FROM favorites WHERE id=?", String(id));
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    },
    [db],
  );

  const getFavorites = useCallback(async () => {
    try {
      const rows = await db.getAllAsync(
        "SELECT * FROM favorites ORDER BY start_time ASC;",
      );
      return rows;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  }, [db]);

  const isFavorite = useCallback(
    async (id) => {
      try {
        const rows = await db.getAllAsync(
          "SELECT id FROM favorites WHERE id=?",
          String(id),
        );
        return rows.length > 0;
      } catch (error) {
        console.error("Error checking favorite:", error);
        return false;
      }
    },
    [db],
  );

  return { addFavorite, removeFavorite, getFavorites, isFavorite };
};
