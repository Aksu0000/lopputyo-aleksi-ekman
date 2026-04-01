import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../services/database';

export default function FavoritesScreen() {
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
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.item}>{item.name}</Text>
            <Button title="Remove" onPress={() => handleRemove(item.id)} />
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