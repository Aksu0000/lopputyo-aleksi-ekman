import { View, FlatList, StyleSheet } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useDatabase } from "../services/database";
import { Appbar, Text, Searchbar } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import EventCard from "../components/EventCard";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isFocused = useIsFocused();
  const { getFavorites, removeFavorite, isFavorite } = useDatabase();

  const handleFavorite = {
    toggle: async (item) => {
      const fav = await isFavorite(item.id);
      if (fav) {
        await removeFavorite(item.id);
      } else {
      }
      loadFavorites();
    },
    check: isFavorite,
  };

  const loadFavorites = async () => {
    const rows = await getFavorites();
    setFavorites(rows);
  };

  useEffect(() => {
    if (isFocused) loadFavorites();
  }, [isFocused]);

  const handleOpenDetail = useCallback(
    (item) => navigation.navigate("EventDetail", { event: item }),
    [navigation],
  );

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  const filteredFavorites = searchQuery.trim()
    ? favorites.filter((event) => {
        const query = searchQuery.toLowerCase();
        const name = (event.name || "").toLowerCase();
        const desc = stripHtml(event.description || "").toLowerCase();
        return name.includes(query) || desc.includes(query);
      })
    : favorites;

  const renderItem = ({ item }) => (
    <EventCard
      item={{
        id: item.id,
        name: { fi: item.name },
        description: { fi: item.description },
        start_time: item.start_time,
        end_time: item.end_time,
        location: item.location_url,
      }}
      onFavorite={handleFavorite}
      favoriteLabel="Poista"
      onPress={handleOpenDetail}
    />
  );

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

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>Ei suosikkeja vielä.</Text>
        </View>
      ) : filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>Ei tapahtumia hakusanalla "{searchQuery}"</Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 10 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchbar: { margin: 8 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    padding: 32,
    justifyContent: "center",
  },
});
