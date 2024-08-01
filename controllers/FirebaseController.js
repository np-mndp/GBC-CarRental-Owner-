import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,

  GeoPoint,
  query,
  where,
  getDoc,
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

  getListings = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const listingRef = collection(db, "Listing");
        const q = query(listingRef, where("owner", "==", user.email));
        const querySnapshot = await getDocs(q);
        const listings = [];
        querySnapshot.forEach((doc) => {
          listings.push({ id: doc.id, ...doc.data() });
        });
        return listings;
      } else {
        throw new Error("No user is logged in");
      }
    } catch (error) {
      console.error("Error fetching listings: ", error);
      return [];
    }
  };

  getListing = async (id) => {
    try {
      const docRef = doc(db, "Listing", id);
      const docSnap = await getDoc(docRef);
      return docSnap.data();
    } catch (error) {
      console.log(`Error fetching listing: ${error}`);
    }
  };

  getBookings1 = async () => {
    try {
      const listings = await this.getListings();
      const bookings = [];
      await Promise.all(
        listings.map(async (tempDoc) => {
          const q = collection(db, "Listing/" + tempDoc.id + "/bookings");

          const querySnapshot = await getDocs(q);
          console.log(
            `Number of documents in querySnapshot: ${querySnapshot.size}`
          );

          if (querySnapshot.size > 0) {
            await Promise.all(
              querySnapshot.docs.map((doc) => {
                console.log({ doc: doc.id });
                return bookings.push({
                  bookingId: doc.id,
                  listingId: tempDoc.id,
                  ...tempDoc,
                  ...doc.data(),
                });
              })
            );
          }
        })
      );
      //   Promise.all(tempPromise);
      console.log(`Booking data :${bookings.length}`);
      return bookings;
    } catch (error) {}
  };

  getBookings = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const bookingRef = collection(db, "Booking");
        const q = query(
          bookingRef,
          where("owner", "==", "testowner2@gmail.com")
        );
        const querySnapshot = await getDocs(q);
        const bookings = [];
        bookings = querySnapshot.forEach((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return bookings;
      } else {
        throw new Error("No user is logged in");
      }
    } catch (error) {
      console.error("Error fetching Bookings: ", error);
      return [];
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
