import { View, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { addFavorite, getFavorites } from "../services/database";
import { Card, Button, Text, Appbar } from "react-native-paper";

export default function EventListScreen({ navigation }) {
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
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Events" />
        <Appbar.Action
          icon="star"
          onPress={() => navigation.navigate("Favorites")}
        />
      </Appbar.Header>

      <FlatList
        contentContainerStyle={{ padding: 10 }}
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name.fi || "No title"} />
            <Card.Actions>
              <Button mode="contained" onPress={() => handleAddFavorite(item)}>
                Favorite
              </Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
});