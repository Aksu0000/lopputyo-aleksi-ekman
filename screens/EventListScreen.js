import { View, StyleSheet } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { fetchEventsPage } from "../services/api";
import { useDatabase } from "../services/database";
import { Text, Appbar, ProgressBar, Searchbar } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import EventCard from "../components/EventCard";
import { stripHtml } from "../utils/text";

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { addFavorite, removeFavorite, isFavorite, version } = useDatabase();

  const handleFavorite = {
    toggle: async (item) => {
      const fav = await isFavorite(item.id);
      if (fav) {
        await removeFavorite(item.id);
      } else {
        await addFavorite(item);
      }
    },
    check: isFavorite,
  };

  const handleOpenDetail = useCallback(
    (item) => navigation.navigate("EventDetail", { event: item }),
    [navigation],
  );

  const filteredEvents = searchQuery.trim()
    ? events.filter((event) => {
        const query = searchQuery.toLowerCase();
        const name = (event.name?.fi || "").toLowerCase();
        const desc = stripHtml(event.description?.fi || "").toLowerCase();
        return name.includes(query) || desc.includes(query);
      })
    : events;

  const loadAllEvents = async () => {
    setLoading(true);
    setEvents([]);

    const seenNames = new Set();
    const now = new Date();
    let page = 1;

    try {
      while (true) {
        const { data } = await fetchEventsPage(page);
        if (!data || data.length === 0) break;

        const upcoming = data.filter((event) => {
          if (!event.start_time) return false;
          const start = new Date(event.start_time);

          return start >= now;
        });

        const unique = upcoming.filter((event) => {
          const name = event.name?.fi || "";
          if (seenNames.has(name)) return false;
          seenNames.add(name);
          return true;
        });

        setEvents((prev) =>
          [...prev, ...unique].sort(
            (a, b) => new Date(a.start_time) - new Date(b.start_time),
          ),
        );

        page++;
        await new Promise((r) => setTimeout(r, 50));
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllEvents();
  }, [version]);

  const renderItem = useCallback(
    ({ item }) => (
      <EventCard
        item={item}
        onFavorite={handleFavorite}
        onPress={handleOpenDetail}
      />
    ),
    [handleFavorite, handleOpenDetail],
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Tapahtumat" />
      </Appbar.Header>

      <Searchbar
        placeholder="Hae tapahtumia..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <Text>Ladataan tapahtumia...</Text>
          <ProgressBar indeterminate />
        </View>
      )}

      {!loading && filteredEvents.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text>Ei tapahtumia hakusanalla "{searchQuery}"</Text>
        </View>
      )}

      <FlashList
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        estimatedItemSize={160}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchbar: { margin: 8 },
  loadingContainer: { padding: 16 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    padding: 32,
    justifyContent: "center",
  },
});
