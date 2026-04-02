import { View, ScrollView, StyleSheet, Linking } from "react-native";
import { Appbar, Text, Divider, Button } from "react-native-paper";
import { useEffect, useState } from "react";
import { fetchLocationName } from "../services/locationCache";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../services/database";

export default function EventDetailScreen({ route, navigation }) {
  const { event } = route.params;
  const [locationName, setLocationName] = useState("Ladataan...");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchLocationName(event.location).then(setLocationName);
    checkIfFavorite();
  }, [event]);

  const checkIfFavorite = async () => {
    const favs = await getFavorites();
    setIsFavorite(favs.some((f) => f.id === event.id));
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFavorite(event.id);
    } else {
      await addFavorite(event);
    }
    setIsFavorite((prev) => !prev);
  };

  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, "");
  };

  const formatDate = (start, end) => {
    if (!start) return "Ei päivämäärää";
    const startDate = new Date(start);
    const date = startDate.toLocaleDateString("fi-FI");
    const startTime = startDate.toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!end) return `${date} klo ${startTime}`;

    const endTime = new Date(end).toLocaleTimeString("fi-FI", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return `${date} klo ${startTime} – ${endTime}`;
  };

  const eventUrl =
    event.info_url?.fi || event.info_url?.en || event.external_links?.[0]?.link;

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Tapahtuma" />
        <Appbar.Action
          icon={isFavorite ? "star" : "star-outline"}
          onPress={toggleFavorite}
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Text variant="headlineSmall" style={styles.title}>
          {event.name?.fi || "No title"}
        </Text>

        <Divider style={styles.divider} />

        <Text variant="labelLarge" style={styles.label}>
          🕒 Aika
        </Text>
        <Text style={styles.value}>
          {formatDate(event.start_time, event.end_time)}
        </Text>

        <Text variant="labelLarge" style={styles.label}>
          📍 Sijainti
        </Text>
        <Text style={styles.value}>{locationName}</Text>

        <Text variant="labelLarge" style={styles.label}>
          📝 Kuvaus
        </Text>
        <Text style={styles.value}>
          {stripHtml(event.description?.fi) ||
            stripHtml(event.short_description?.fi) ||
            "Ei kuvausta"}
        </Text>

        {eventUrl && (
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => Linking.openURL(eventUrl)}
          >
            Lisätietoja
          </Button>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16 },
  title: { fontWeight: "bold", marginBottom: 8 },
  divider: { marginVertical: 12 },
  label: { marginTop: 16, color: "#666" },
  value: { marginTop: 4, fontSize: 15, lineHeight: 22 },
  button: { marginTop: 24 },
});
