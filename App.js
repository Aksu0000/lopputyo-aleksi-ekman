import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import EventListScreen from "./screens/EventListScreen";
import { initializeDB } from "./services/database";

export default function App() {
  useEffect(() => {
    initializeDB();
  }, []);

  return <EventListScreen />;
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
