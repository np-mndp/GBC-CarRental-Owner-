import { StyleSheet, Text, View } from "react-native";

const AddListingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Add Listing Screen</Text>
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

export default AddListingScreen;
