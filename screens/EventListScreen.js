import { View, Text, FlatList, StyleSheet, Button } from "react-native";
import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { addFavorite, getFavorites } from "../services/database";

export default function EventListScreen() {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadEvents();
    loadFavorites();
  }, []);

  const loadEvents = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const handleAddFavorite = async (item) => {
    const name = item.name.fi || "No title";
    await addFavorite(item.id, name);
    loadFavorites();
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.item}>{item.name.fi || "No title"}</Text>
            <Button title="Favorite" onPress={() => handleAddFavorite(item)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  row: { marginBottom: 15 },
  item: { fontSize: 16 },
});