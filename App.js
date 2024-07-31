import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Pressable, StyleSheet, Text, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import AddListingScreen from "./screens/AddListingScreen";
import ManageBookingScreen from "./screens/ManageBookings";
import LoginScreen from "./screens/LoginScreen";
import { signOut } from "firebase/auth";
import { auth } from "./configs/FirebaseConfig";
import FloatingMenu from "./screens/Menu/OptionsScreen";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

const Stack = createStackNavigator();
export default function App() {
  const [visibility, setVisibility] = useState("none");

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={auth?.currentUser ? "Home" : "Login"}
        screenOptions={() => ({
          headerStyle: {
            backgroundColor: "#aa6558",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        })}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            title: "Home",
            headerRight: () => (
              <View>
                <Pressable
                  onPress={() =>
                    visibility == "none"
                      ? setVisibility("flex")
                      : setVisibility("none")
                  }
                >
                  <Ionicons
                    name="menu-outline"
                    color="white"
                    size={32}
                  ></Ionicons>
                </Pressable>
                <View style={{ display: visibility }}>
                  <FloatingMenu navigation={navigation} />
                </View>
              </View>
            ),
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
        <Stack.Screen name="Add Listing" component={AddListingScreen} />
        <Stack.Screen name="Manage Bookings" component={ManageBookingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
//checking push access
