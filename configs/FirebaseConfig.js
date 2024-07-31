// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//import necessary firebase services
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzRIMjBnC_wrSyi0anXtylMbdvw6cC2vU",
  authDomain: "evrentalg04.firebaseapp.com",
  projectId: "evrentalg04",
  storageBucket: "evrentalg04.appspot.com",
  messagingSenderId: "939391660456",
  appId: "1:939391660456:web:39dbf7dab6672874462d9d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//instantiate auth object
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

//instantiate firestore object
const db = getFirestore(app);

//export the auth object to use in other files
export { auth };

//export the database object to use in other files
export { db };

// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
