import { useEffect, useState } from "react";
import { Card, Paragraph, Text, Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { fetchLocationName } from "../services/locationCache";

export default function EventCard({
  item,
  onFavorite,
  onPress,
  favoriteLabel = "Suosikki",
}) {
  const [locationName, setLocationName] = useState("Ladataan...");

  useEffect(() => {
    fetchLocationName(item.location).then(setLocationName);
  }, [item.location]);

  const stripHtml = (html) => (html ? html.replace(/<[^>]*>?/gm, "") : "");

  const formatDate = (start, end) => {
    if (!start) return "Ei päivämäärää";
    const startDate = new Date(start);
    let str = startDate.toLocaleString("fi-FI");
    if (end) str += " – " + new Date(end).toLocaleTimeString("fi-FI");
    return str;
  };

  return (
    <Card style={styles.card} onPress={() => onPress && onPress(item)}>
      <Card.Title title={item.name?.fi || "No title"} />
      <Card.Content>
        <Paragraph numberOfLines={2}>
          {stripHtml(item.description?.fi) || "Ei kuvausta"}
        </Paragraph>
        <Text style={styles.text}>🕒 {formatDate(item.start_time, item.end_time)}</Text>
        <Text style={styles.text}>📍 {locationName}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => onFavorite && onFavorite(item)}>
          {favoriteLabel}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  text: { marginTop: 4, fontSize: 14, color: "#555" },
});