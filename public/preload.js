const firebase = require('firebase/compat/app');
require('firebase/compat/auth');
const { getFirestore } = require("firebase/firestore");
const { getAnalytics } = require("firebase/analytics");

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
const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

const signInGoogle = () => {
  return auth.signInWithPopup(provider);
}

const signOut = () => {
  return auth.signOut();
}

const db = getFirestore(app);
const analytics = getAnalytics(app);