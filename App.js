import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import EventListScreen from "./screens/EventListScreen";
import FavoritesScreen from './screens/FavoritesScreen';
import { initializeDB } from "./services/database";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    initializeDB();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Events">
        <Stack.Screen name="Events" component={EventListScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
