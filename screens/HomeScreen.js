import { StyleSheet, Text, View } from "react-native";
import { auth } from "../configs/FirebaseConfig";


const HomeScreen = () => {

console.log(`AUTH FROM Home SCREEN : ${JSON.stringify(auth)}`);

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
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

export default HomeScreen;
