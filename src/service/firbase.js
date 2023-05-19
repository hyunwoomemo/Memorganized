import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB1mkAgE1ng41UwSDfEzjUt5XB_4ThcmUc",
  authDomain: "memorganize.firebaseapp.com",
  databaseURL: "https://memorganize-default-rtdb.firebaseio.com",
  projectId: "memorganize",
  storageBucket: "memorganize.appspot.com",
  messagingSenderId: "461828235463",
  appId: "1:461828235463:web:0a07deaa4eabffbaf31ee2",
  measurementId: "G-SMH7DS8ZGR"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

export const signInGoogle = () => {
  return auth.signInWithPopup(provider);
}

export const signOut = () => {
  return auth.signOut();
}

export const db = getFirestore(app);
const analytics = getAnalytics(app);