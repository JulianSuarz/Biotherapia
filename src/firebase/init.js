// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyD0EpbSyy0-KHV5Efqss3DQug-JXXc-nnY",

  authDomain: "biotherapia-fb8e2.firebaseapp.com",

  projectId: "biotherapia-fb8e2",

  storageBucket: "biotherapia-fb8e2.appspot.com",

  messagingSenderId: "612950584815",

  appId: "1:612950584815:web:84fde5978c8add9d719a1a",

  measurementId: "G-ZE370X2XKQ"
};


// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
export default db