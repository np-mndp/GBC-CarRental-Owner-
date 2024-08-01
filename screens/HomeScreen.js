import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import FirestoreController from "../controllers/FirebaseController";
import { auth } from "../configs/FirebaseConfig";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
  const [listings, setListings] = useState();

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        setLoading(true);
        const firestore = FirestoreController.getInstance();
        const dbData = await firestore.getListings();
        setListings(dbData);
        console.log(`Listings: ${JSON.stringify(listings)}`);
        setLoading(false);
      };

      fetchData();

      return () => {
        // Clean up if needed
      };
    }, [])
  );

  // useEffect(() => {
  //   if (auth.currentUser == null) {
  //     navigation.navigate("Login");
  //   }
  //   const fetchData = async () => {
  //     setLoading(true);
  //     const firestore = FirestoreController.getInstance();
  //     const dbData = await firestore.getListings();
  //     setListings(dbData);
  //     console.log(`Listings: ${JSON.stringify(listings)}`);
  //     setLoading(false);
  //   };

  //   fetchData();
  // }, []);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.vehicleImg }} style={styles.vehicleImage} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.vehicle}</Text>
        <Text style={styles.text}>{`Address: ${item.address}`}</Text>
        <Text style={styles.text}>{`City: ${item.city}`}</Text>
        <Text
          style={styles.text}
        >{`Coordinates: ${item.coords.latitude}N, ${item.coords.longitude}W`}</Text>
        <Text style={styles.text}>{`License Plate: ${item.licensePlate}`}</Text>
        <Text style={styles.text}>{`Price: $${item.price}`}</Text>
        <Text style={styles.text}>{`Seats: ${item.seats}`}</Text>
        <Text style={styles.text}>{`Available: ${
          item.available ? "Yes" : "No"
        }`}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0fa968" />
      ) : (
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
  },
  itemContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  textContainer: {
    marginTop: 10,
  },
  vehicleImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#aa6558",
    marginTop: 5,
  },
  text: {
    fontSize: 12,
    color: "#333",
    marginTop: 3,
  },
});

export default HomeScreen;
