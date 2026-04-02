import { useEffect, useState } from "react";
import { Card, Paragraph, Text, Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { fetchLocationName } from "../services/locationCache";

export default function EventCard({ item, onFavorite, onPress }) {
  const [locationName, setLocationName] = useState("Ladataan...");

  useEffect(() => {
    fetchLocationName(item.location).then(setLocationName);
  }, [item.location]);

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  const formatDate = (start, end) => {
    if (!start) return "Ei päivämäärää";
    const startDate = new Date(start);
    let dateStr = startDate.toLocaleString("fi-FI");
    if (end) {
      const endDate = new Date(end);
      dateStr += " – " + endDate.toLocaleTimeString("fi-FI");
    }
    return dateStr;
  };

  return (
    <Card style={styles.card} onPress={() => onPress(item)}>
      <Card.Title title={item.name?.fi || "No title"} />
      <Card.Content>
        {item.description?.fi ? (
          <Paragraph numberOfLines={2}>
            {stripHtml(item.description.fi)}
          </Paragraph>
        ) : (
          <Paragraph>Ei kuvausta</Paragraph>
        )}
        <Text style={styles.text}>
          🕒 {formatDate(item.start_time, item.end_time)}
        </Text>
        <Text style={styles.text}>📍 {locationName}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={() => onFavorite(item)}>
          Suosikki
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  text: { marginTop: 4, fontSize: 14, color: "#555" },
});
