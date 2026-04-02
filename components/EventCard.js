import { useEffect, useState } from "react";
import { Card, Paragraph, Text, Button } from "react-native-paper";
import { StyleSheet } from "react-native";
import { fetchLocationName } from "../services/locationCache";

export default function EventCard({ item, onFavorite, onPress, favoriteLabel = "Suosikki" }) {
  const [locationName, setLocationName] = useState("Ladataan...");
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    fetchLocationName(item.location).then(setLocationName);
  }, [item.location]);

  useEffect(() => {
    const checkFav = async () => {
      if (onFavorite?.check) {
        const fav = await onFavorite.check(item.id);
        setIsFav(fav);
      }
    };
    checkFav();
  }, [item.id, onFavorite]);

  const toggleFav = async () => {
    if (!onFavorite) return;
    await onFavorite.toggle(item);
    setIsFav((prev) => !prev);
  };

  const stripHtml = (html) => html ? html.replace(/<[^>]*>?/gm, "") : "";
  const formatDate = (start, end) => {
    if (!start) return "Ei päivämäärää";
    const s = new Date(start);
    const date = s.toLocaleDateString("fi-FI");
    const startTime = s.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" });
    if (!end) return `${date} klo ${startTime}`;
    const e = new Date(end);
    const endTime = e.toLocaleTimeString("fi-FI", { hour: "2-digit", minute: "2-digit" });
    return `${date} klo ${startTime} – ${endTime}`;
  };

  return (
    <Card style={styles.card} onPress={() => onPress && onPress(item)}>
      <Card.Title title={item.name?.fi || "No title"} />
      <Card.Content>
        <Paragraph numberOfLines={2}>{stripHtml(item.description?.fi) || "Ei kuvausta"}</Paragraph>
        <Text style={styles.text}>🕒 {formatDate(item.start_time, item.end_time)}</Text>
        <Text style={styles.text}>📍 {locationName}</Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" onPress={toggleFav}>
          {isFav ? "Poista" : favoriteLabel}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  text: { marginTop: 4, fontSize: 14, color: "#555" },
});