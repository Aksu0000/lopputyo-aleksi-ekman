import { View, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from 'react';
import { fetchEvents } from '../services/api';
import { addFavorite, getFavorites } from "../services/database";
import { Card, Button, Text, Appbar, Paragraph } from "react-native-paper";

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

  const formatDate = (start, end) => {
    if (!start) return "No date";
    const startDate = new Date(start);
    let dateStr = startDate.toLocaleString();
    if (end) {
      const endDate = new Date(end);
      dateStr += " - " + endDate.toLocaleTimeString();
    }
    return dateStr;
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
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
            <Card.Content>
              {item.description?.fi ? (
                <Paragraph numberOfLines={2}>{stripHtml(item.description.fi)}</Paragraph>
              ) : (
                <Paragraph>No description</Paragraph>
              )}
              <Text style={styles.text}>
                🕒 {formatDate(item.start_time, item.end_time)}
              </Text>
              <Text style={styles.text}>
                📍 {item.location?.name?.fi || "No location"}
              </Text>
            </Card.Content>
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
  text: { marginTop: 4, fontSize: 14, color: "#555" },
});