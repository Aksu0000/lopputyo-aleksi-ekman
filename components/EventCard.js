import { useEffect, useState } from "react";
import { Card, Paragraph, Text, Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { fetchLocationName } from "../services/locationCache";

export default function EventCard({ item, onFavorite }) {
  const [locationName, setLocationName] = useState("Loading...");

  useEffect(() => {
    // Hae locationName cachea käyttäen, jos location löytyy
    fetchLocationName(item.location).then(setLocationName);
  }, [item.location]);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
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

  return (
    <Card style={styles.card}>
      <Card.Title title={item.name?.fi || "No title"} />
      <Card.Content>
        {item.description?.fi ? (
          <Paragraph numberOfLines={2}>{stripHtml(item.description.fi)}</Paragraph>
        ) : (
          <Paragraph>No description</Paragraph>
        )}
        <Text style={styles.text}>🕒 {formatDate(item.start_time, item.end_time)}</Text>
        <Text style={styles.text}>📍 {locationName}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => onFavorite(item)}>
          Favorite
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  text: { marginTop: 4, fontSize: 14, color: "#555" },
});