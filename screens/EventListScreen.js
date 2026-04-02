import { View, StyleSheet } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { fetchEventsPage } from "../services/api";
import { addFavorite, getFavorites } from "../services/database";
import { Text, Appbar, ProgressBar } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import EventCard from "../components/EventCard";

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFavorites();
    loadAllEvents();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const handleAddFavorite = async (item) => {
    const name = item.name.fi || "No title";
    await addFavorite(item.id, name);
    loadFavorites();
  };

  // Lataa kaikki sivut kunnes data on tyhjä
  const loadAllEvents = async () => {
    setLoading(true);
    setEvents([]);

    const seenNames = new Set();
    const now = new Date();
    let page = 1;

    try {
      while (true) {
        const { data } = await fetchEventsPage(page);
        if (!data || data.length === 0) break; // ei enää sivuja

        // Suodatetaan vain nykyiset ja tulevat tapahtumat start_time:n perusteella
        const upcoming = data.filter((event) => {
          if (!event.start_time) return false; // hylätään ilman start_time
          const start = new Date(event.start_time);
          if (isNaN(start.getTime())) return false; // hylätään invalid date
          return start >= now; // vain nykyiset ja tulevat
        });

        // Poistetaan duplikaatit nimen mukaan
        const unique = upcoming.filter((event) => {
          const name = event.name?.fi || "";
          if (seenNames.has(name)) return false;
          seenNames.add(name);
          return true;
        });

        // Päivitetään lista
        setEvents((prev) => {
          const combined = [...prev, ...unique];
          return combined.sort(
            (a, b) => new Date(a.start_time) - new Date(b.start_time)
          );
        });

        page++;
        await new Promise((r) => setTimeout(r, 50)); // smooth UI päivitys
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoitu renderItem FlashListille
  const renderItem = useCallback(
    ({ item }) => <EventCard item={item} onFavorite={handleAddFavorite} />,
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Events" />
        <Appbar.Action
          icon="star"
          onPress={() => navigation.navigate("Favorites")}
        />
      </Appbar.Header>

      {loading && (
        <View style={{ padding: 16 }}>
          <Text>Ladataan tapahtumia...</Text>
          <ProgressBar indeterminate />
        </View>
      )}

      <FlashList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        estimatedItemSize={160}
        contentContainerStyle={{ padding: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});