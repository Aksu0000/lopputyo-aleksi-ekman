import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Provider as PaperProvider } from "react-native-paper";
import { SQLiteProvider } from "expo-sqlite";

import EventListScreen from "./screens/EventListScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import EventDetailScreen from "./screens/EventDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const initializeDB = async (db) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS favorites (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT,
      description TEXT,
      start_time TEXT,
      end_time TEXT,
      location_url TEXT
    );
  `);
};

function EventsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EventList" component={EventListScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FavoritesList" component={FavoritesScreen} />
      <Stack.Screen name="EventDetail" component={EventDetailScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SQLiteProvider
      databaseName="eventsdb.db"
      onInit={initializeDB}
      onError={(error) => console.error("Database error:", error)}
    >
      <PaperProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
              name="EventsTab"
              component={EventsStack}
              options={{
                tabBarLabel: "Tapahtumat",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="calendar"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="FavoritesTab"
              component={FavoritesStack}
              options={{
                tabBarLabel: "Suosikit",
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="star"
                    color={color}
                    size={size}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SQLiteProvider>
  );
}
