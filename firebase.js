import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyC9PaTv4WNyF4tBpFcuu0OFQZaEWC7dhzI",
  authDomain: "single-clone-49dcd.firebaseapp.com",
  projectId: "single-clone-49dcd",
  storageBucket: "single-clone-49dcd.appspot.com",
  messagingSenderId: "804077609258",
  appId: "1:804077609258:web:3fcff6f3c7afcb9fe4be53",
  measurementId: "G-XX2FWER3N9"
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app)

export { db, auth };
