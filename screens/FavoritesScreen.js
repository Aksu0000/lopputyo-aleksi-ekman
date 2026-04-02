import { View, FlatList, StyleSheet } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { getFavorites, removeFavorite } from "../services/database";
import { Card, Button, Text, Appbar, Searchbar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import EventCard from "../components/EventCard";

const dbRowToEvent = (row) => ({
  id: row.id,
  name: { fi: row.name },
  description: { fi: row.description },
  start_time: row.start_time,
  end_time: row.end_time,
  location: row.location_url,
});

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadFavorites();
    }
  }, [isFocused]);

  const loadFavorites = async () => {
    const rows = await getFavorites();
    setFavorites(rows);
  };

  const handleRemove = async (item) => {
    await removeFavorite(item.id);
    loadFavorites();
  };

  const handleOpenDetail = useCallback(
    (item) => navigation.navigate("EventDetail", { event: item }),
    [navigation]
  );

  const stripHtml = (html) => html.replace(/<[^>]*>?/gm, "");

  const filteredFavorites = searchQuery.trim()
    ? favorites.filter((event) => {
        const query = searchQuery.toLowerCase();
        const name = (event.name?.fi || "").toLowerCase();
        const desc = stripHtml(event.description?.fi || "").toLowerCase();
        return name.includes(query) || desc.includes(query);
      })
    : favorites;

    const renderItem = ({ item }) => {
    const event = dbRowToEvent(item);
    return (
      <EventCard
        item={event}
        onFavorite={handleRemove}
        favoriteLabel="Poista"
        onPress={handleOpenDetail}
      />
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Suosikit" />
      </Appbar.Header>

      <Searchbar
        placeholder="Hae tapahtumia..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      {filteredFavorites.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text>Ei tapahtumia hakusanalla "{searchQuery}"</Text>
              </View>
            )}

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>Ei suosikkeja vielä.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
});
