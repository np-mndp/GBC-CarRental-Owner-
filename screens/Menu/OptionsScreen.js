import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { signOut } from "firebase/auth";
import { auth } from "../../configs/FirebaseConfig";
import { StackActions } from "@react-navigation/native";

const FloatingMenu = ({ navigation }) => {
  const logoutPressed = async () => {
    try {
      await signOut(auth);

      console.log(`Successfully Logged out: ${JSON.stringify(navigation)}`);

      if (navigation.canGoBack()) {
        navigation.dispatch(StackActions.popToTop());
      }
    } catch (err) {
      console.log(`Error while signing out : ${err}`);
    }
  };
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }} // Replace with your profile image URI
          style={styles.profileIcon}
        />
        <Text style={styles.profileName}>John Doe</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={logoutPressed}>
        <Ionicons
          name="log-out"
          color={"white"}
          size={24}
          style={{ paddingEnd: 10 }}
        />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    position: "absolute",
    top: -10,
    right: 0,
    width: 200,
    backgroundColor: "#aa6558",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: "flex-end",
  },
  profileIcon: {
    // justifyContent:"flex-start",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  profileName: {
    marginTop: 5,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    marginTop: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    shadowColor: "#e4c3bd",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default FloatingMenu;
