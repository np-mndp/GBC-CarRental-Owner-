import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FirestoreController from "../controllers/FirebaseController";
import { auth } from "../configs/FirebaseConfig";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("owner@gmail.com");
  const [password, setPassword] = useState("owner12345");
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(false);

  const onLoginPressed = async () => {
    if (!(email.length >= 7) || !(password.length >= 8)) {
      setError("Please enter valid email and password");
    }
    setLoading(true);
    const firestoreController = FirestoreController.getInstance();
    const result = await firestoreController.login(email, password);
    if (result.success) {
      setLoading(false);
      console.log(`AUTH FROM LOGIN SCREEN : ${JSON.stringify(console.log(`AUTH FROM LOGIN SCREEN : ${auth}`))}`);
      navigation.navigate("Home");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        onChangeText={(emailInput) => {
          setError(null);
          setEmail(emailInput);
        }}
        value={email}
        placeholder="email@mail.com"
      />

      <TextInput
        style={styles.input}
        onChangeText={(passwordInput) => {
          setError(null);
          setPassword(passwordInput);
        }}
        value={password}
        inputMode="email"
        secureTextEntry={true}
        placeholder="Password"
      />

      <Pressable style={styles.button} onPress={onLoginPressed}>
        <Ionicons name="log-in" color="#FFF" size={24} />
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#F5FCFF",
  },
  input: {
    height: 40,
    width: 300,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 30,
    marginBottom: 50,
    fontWeight: "bold",
    color: "#aa6558",
  },
  button: {
    backgroundColor: "#aa6558",
    padding: 10,
    width: 300,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
  },
});

export default LoginScreen;
