import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
  Alert,
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

  const handleApprove = async (listingId, bookingId) => {
    const firestore = FirestoreController.getInstance();
    const result = await firestore.approveBooking(listingId, bookingId);
    if (result.status === "success") {
      console.log({ result });
      Alert.alert(`Approved with Confirmation Code: ${result.code}`);
    }
    // Add this method in your FirestoreController to update the booking status
    // setData(updatedData);
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
          <Text
            style={styles.text}
          >{`License Plate: ${item.licensePlate}`}</Text>
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
          <Text
            style={styles.text}
          >{`Coordinates: ${item.coords.latitude}N, ${item.coords.longitude}W`}</Text>
          <Text style={styles.text}>{`Booking Date: ${item.bookingDate}`}</Text>
          <Text
            style={styles.text}
          >{`Confirmation Code: ${item.confirmationCode}`}</Text>
        </View>

        <View style={styles.renterInfo}>
          <Image source={{ uri: item.renterImg }} style={styles.renterImage} />
          <View style={styles.renterDetails}>
            <Text style={styles.subtitle}>Renter Information:</Text>
            <Text style={styles.text}>{`Renter: ${item.renter}`}</Text>
          </View>
        </View>

        {item.status === "Needs Approval" && (
          <Pressable
            style={styles.approveButton}
            onPress={() => handleApprove(item.listingId, item.bookingId)}
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
    padding: 8,
    margin: 8,
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
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    marginTop: 8,
  },
  vehicleInfo: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: "#f7f7f7",
    borderRadius: 6,
  },
  bookingInfo: {
    marginBottom: 6,
    padding: 6,
    backgroundColor: "#e9ecef",
    borderRadius: 6,
  },
  renterInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    padding: 6,
    backgroundColor: "#f8f9fa",
    borderRadius: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#aa6558",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    color: "#333",
    marginBottom: 2,
  },
  renterImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  renterDetails: {
    flex: 1,
  },
  approveButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "#0fa968",
    borderRadius: 16,
    alignSelf: "flex-start", // Aligns button to the left
  },
  approveButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default BookingsScreen;
