import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  GeoPoint,
} from "firebase/firestore";
import { auth, db } from "../configs/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

class FirestoreController {
  // Singleton instance
  static instance = null;

  constructor() {
    if (FirestoreController.instance) {
      return FirestoreController.instance;
    }

    FirestoreController.instance = this;
  }

  // Static method to get the singleton instance
  static getInstance() {
    if (!FirestoreController.instance) {
      FirestoreController.instance = new FirestoreController();
    }

    return FirestoreController.instance;
  }

  //************* Methods *************/

  login = async (email, password) => {
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(`userCredentials : ${JSON.stringify(userCredentials)}`);
      console.log(`Signed In successfully`);
      return {
        success: true,
      };
    } catch (err) {
      console.log(`Error while signing in : ${err}`);
    }
  };


// Add listing to Firestore
addListing = async (listingData) => {
  try {
    const docRef = await addDoc(collection(db, "Listing"), listingData);
    console.log("Listing added with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding listing: ", error);
    return { success: false, error };
  }
};
}

export default FirestoreController;
