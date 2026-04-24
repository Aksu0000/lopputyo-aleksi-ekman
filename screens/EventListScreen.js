import { View, StyleSheet } from "react-native";
import { useEffect, useState, useCallback, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDatabase } from "../services/database";
import { Text, Appbar, ProgressBar, Searchbar, FAB } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import EventCard from "../components/EventCard";
import { stripHtml } from "../utils/text";
import { subscribeEvents, startEventsStream } from "../services/eventsCache";

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const listRef = useRef(null);

  const { addFavorite, removeFavorite, isFavorite } = useDatabase();

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

  useEffect(() => {
    startEventsStream();

    const unsubscribe = subscribeEvents((data) => {
      setEvents(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };

  const scrollToBottom = () => {
    if (!filteredEvents?.length) return;

    listRef.current?.scrollToOffset({
      offset: filteredEvents.length * 250,
      animated: true,
    });
  };

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
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header statusBarHeight={0}>
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
        ref={listRef}
        data={filteredEvents}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        estimatedItemSize={250}
        contentContainerStyle={{ padding: 10 }}
      />
      <View style={styles.fabBar}>
        <FAB small icon="arrow-up" onPress={scrollToTop} />
        <FAB small icon="arrow-down" onPress={scrollToBottom} />
      </View>
    </SafeAreaView>
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
  fabBar: {
    position: "absolute",
    bottom: 5,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  fabButton: {
    marginVertical: 6,
  },
});
