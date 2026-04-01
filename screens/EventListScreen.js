import { View, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { fetchEventsPage } from "../services/api"; // uusi funktio, hakee yhden sivun
import { addFavorite, getFavorites } from "../services/database";
import { Card, Button, Text, Appbar, Paragraph } from "react-native-paper";

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFavorites();
    loadNextPage();
  }, []);

  const loadNextPage = async () => {
    if (loading || page > totalPages) return;

    setLoading(true);
    try {
      const { data, meta } = await fetchEventsPage(page);
      setEvents((prev) => [...prev, ...data]);
      setTotalPages(meta.total_pages);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
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
                <Paragraph numberOfLines={2}>
                  {stripHtml(item.description.fi)}
                </Paragraph>
              ) : (
                <Paragraph>No description</Paragraph>
              )}
              <Text style={styles.text}>
                🕒 {formatDate(item.start_time, item.end_time)}
              </Text>
              <Text style={styles.text}>
                👤 {item.provider?.fi || "No provider"}
              </Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" onPress={() => handleAddFavorite(item)}>
                Favorite
              </Button>
            </Card.Actions>
          </Card>
        )}
        onEndReached={loadNextPage}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  text: { marginTop: 4, fontSize: 14, color: "#555" },
});
