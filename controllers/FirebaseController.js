import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
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

  login = async (email, password, setLoading) => {
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

  //add video to favorites
  addToFavorites = async (video) => {
    try {
      const docRef = await addDoc(collection(db, "favorites"), video);
      console.log("Document written with ID: ", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error adding document: ", error);
      return { success: false, error };
    }
  };

  //get all favorite videos
  fetchFavorites = async () => {
    try {
      const favoritesRef = collection(db, "favorites");
      const querySnapshot = await getDocs(favoritesRef);
      const favorites = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return favorites;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      throw new Error("Failed to fetch favorites");
    }
  };

  //clear all favorite videos
  clearFavorites = async () => {
    try {
      const favoritesRef = collection(db, "favorites");
      const querySnapshot = await getDocs(favoritesRef);

      const deletePromises = querySnapshot.docs.map((docSnapshot) => {
        const docRef = doc(db, "favorites", docSnapshot.id);
        return deleteDoc(docRef);
      });

      await Promise.all(deletePromises);
      console.log("All favorite videos cleared.");
      return { success: true };
    } catch (error) {
      console.error("Error clearing favorites:", error);
      return { success: false, error };
    }
  };
}

export default FirestoreController;
