import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Import your screens
import HomeScreen from "./screens/HomeScreen";
import AddListingScreen from "./screens/AddListingScreen";
import ManageBookingScreen from "./screens/ManageBookings";
import LoginScreen from "./screens/LoginScreen";
import { signOut } from "firebase/auth";
import { auth } from "./configs/FirebaseConfig";
import FloatingMenu from "./screens/Menu/OptionsScreen";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define a component for the tab navigation
function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#aa6558",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#aa6558", // Moved from tabBarOptions
        tabBarInactiveTintColor: "gray",  // Moved from tabBarOptions
        tabBarStyle: {
          display: "flex",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Add Listing") {
            iconName = "add-circle";
          } else if (route.name === "Manage Bookings") {
            iconName = "book";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Add Listing" component={AddListingScreen} />
      <Tab.Screen name="Manage Bookings" component={ManageBookingScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [visibility, setVisibility] = useState("none");

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#aa6558",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }} // Hide the header for the tab navigator
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
