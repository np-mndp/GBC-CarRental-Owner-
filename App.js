import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";
import FloatingMenu from "./screens/Menu/OptionsScreen";
import HomeScreen from "./screens/HomeScreen";
import AddListingScreen from "./screens/AddListingScreen";
import ManageBookingScreen from "./screens/ManageBookings";
import LoginScreen from "./screens/LoginScreen";
import { auth } from "./configs/FirebaseConfig";

// Create stack and tab navigators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Define a component for the tab navigation
function MainTabNavigator({ navigation }) {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#aa6558",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "My Listings") {
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
      <Tab.Screen name="My Listings" component={HomeScreen} />
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
        initialRouteName={auth?.currentUser ? "Main" : "Login"}
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
          options={({ navigation }) => ({
            headerShown: true,
            headerRight: () => (
              <View>
                <Pressable
                  onPress={() =>
                    setVisibility((prevVisibility) =>
                      prevVisibility === "none" ? "flex" : "none"
                    )
                  }
                >
                  <Ionicons name="menu-outline" color="white" size={32} />
                </Pressable>
                <View style={{ display: visibility }}>
                  <FloatingMenu navigation={navigation} setVisibility={setVisibility} />
                </View>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
