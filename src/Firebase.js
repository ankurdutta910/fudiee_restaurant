import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

var firebaseApp = firebase.initializeApp({
  // apiKey: "AIzaSyDoD30VlpBrV3W3CLiKmGQy2FJoHW4Bmm8",
  // authDomain: "unitrade-18a75.firebaseapp.com",
  // projectId: "unitrade-18a75",
  // storageBucket: "unitrade-18a75.firebasestorage.app",
  // messagingSenderId: "47771758769",
  // appId: "1:47771758769:web:1dea448bca62536e50f290",
  // measurementId: "G-4WEBEVCS84",
  apiKey: "AIzaSyAsyBFaA9SoCejO3ISmjZ-6z68PmkjkthU",
  authDomain: "assamtea-ea96d.firebaseapp.com",
  projectId: "assamtea-ea96d",
  storageBucket: "assamtea-ea96d.appspot.com",
  messagingSenderId: "897920242946",
  appId: "1:897920242946:web:6b26be674a47534e6c5e1b",
  measurementId: "G-YHH5ZNPQQZ",
});

// Initialize Firebase
var db = firebaseApp.firestore();
export const auth = getAuth(firebaseApp);
export const database = getDatabase(firebaseApp);
export const storage = getStorage(firebaseApp);
export { db };
