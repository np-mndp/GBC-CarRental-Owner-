import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import FirestoreController from "../controllers/FirebaseController";

const BookingsScreen = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const firestore = FirestoreController.getInstance();
      const dbData = await firestore.getBookings1();

      console.log({ dbData });
      setData(dbData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleApprove = async (itemId) => {
    const firestore = FirestoreController.getInstance();
    await firestore.approveBooking(itemId); // Add this method in your FirestoreController to update the booking status
    const updatedData = data.map((item) =>
      item.bookingId === itemId ? { ...item, status: "Approved" } : item
    );
    setData(updatedData);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        item.status === "Approved" && styles.approvedBackground,
      ]}
    >
      <Image source={{ uri: item.vehicleImg }} style={styles.vehicleImage} />

      <View style={styles.infoContainer}>
        <View style={styles.vehicleInfo}>
          <Text style={styles.title}>{item.vehicle}</Text>
          <Text style={styles.text}>{`License Plate: ${item.licensePlate}`}</Text>
          <Text style={styles.text}>{`Price: $${item.price}`}</Text>
          <Text style={styles.text}>{`Seats: ${item.seats}`}</Text>
          <Text style={styles.text}>{`Available: ${
            item.available ? "Yes" : "No"
          }`}</Text>
        </View>

        <View style={styles.bookingInfo}>
          <Text style={styles.subtitle}>Booking Details:</Text>
          <Text style={styles.text}>{`Address: ${item.address}`}</Text>
          <Text style={styles.text}>{`City: ${item.city}`}</Text>
          <Text style={styles.text}>{`Coords: (${item.coords.lat}, ${item.coords.lng})`}</Text>
          <Text style={styles.text}>{`Booking Date: ${item.bookingDate}`}</Text>
          <Text style={styles.text}>{`Confirmation Code: ${item.confirmationCode}`}</Text>
        </View>

        <View style={styles.renterInfo}>
          <Text style={styles.subtitle}>Renter Information:</Text>
          <Text style={styles.text}>{`Renter: ${item.renter}`}</Text>
          <Image source={{ uri: item.renterImg }} style={styles.renterImage} />
        </View>

        {item.status === "Needs Approval" && (
          <Pressable
            style={styles.approveButton}
            onPress={() => handleApprove(item.bookingId)}
          >
            <Text style={styles.approveButtonText}>Approve</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0fa968" />
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.bookingId}
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
  approvedBackground: {
    backgroundColor: "#d4edda", // Light green background for approved status
  },
  vehicleImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  infoContainer: {
    marginTop: 10,
  },
  vehicleInfo: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
  },
  bookingInfo: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
  },
  renterInfo: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#aa6558",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  text: {
    fontSize: 12,
    color: "#333",
    marginBottom: 3,
  },
  renterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginTop: 10,
  },
  approveButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#0fa968",
    borderRadius: 20,
    alignSelf: "flex-start", // Aligns button to the left
  },
  approveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default BookingsScreen;
