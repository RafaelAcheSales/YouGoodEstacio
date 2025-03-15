// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4ovJfu-KiAwl_yeJPP-fgBPHTQxPL14E",
  authDomain: "you-good-f543d.firebaseapp.com",
  projectId: "you-good-f543d",
  storageBucket: "you-good-f543d.firebasestorage.app",
  messagingSenderId: "330992158254",
  appId: "1:330992158254:web:780fc458e6b03e454a81bf",
  measurementId: "G-RC6PNG3ZHW"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const lStorage = getReactNativePersistence(ReactNativeAsyncStorage);
export const auth = initializeAuth(app, {
  persistence: lStorage,
});

export const db = getFirestore(app);