import { StyleSheet, Text, View } from "react-native";

const ManageBookingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Manage Booking Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});

export default ManageBookingScreen;
