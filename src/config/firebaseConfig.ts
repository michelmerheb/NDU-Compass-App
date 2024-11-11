// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth} from "firebase/auth";
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAde5zWPXzLspgrcMpTp-b7IsJH8UnHQng",
  authDomain: "student-helper-1.firebaseapp.com",
  projectId: "student-helper-1",
  storageBucket: "student-helper-1.firebasestorage.app",
  messagingSenderId: "640658223704",
  appId: "1:640658223704:web:170c42f1bde8fbd129902d"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: reactNativePersistence(AsyncStorage)
});
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);