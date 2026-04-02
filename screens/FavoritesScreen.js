import { View, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../services/database";
import { Card, Button, Text, Appbar } from "react-native-paper";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const handleRemove = async (id) => {
    await removeFavorite(id);
    loadFavorites();
  };

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Favorites" />
      </Appbar.Header>

      <FlatList
        contentContainerStyle={{ padding: 10 }}
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Title title={item.name} />
            <Card.Actions>
              <Button mode="outlined" onPress={() => handleRemove(item.id)}>
                Remove
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
