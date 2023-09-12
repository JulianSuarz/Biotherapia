// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyDAZqniKK-kugU27LpT__BnCgizAZkgEAQ",

  authDomain: "biotherapia-4aef8.firebaseapp.com",

  projectId: "biotherapia-4aef8",

  storageBucket: "biotherapia-4aef8.appspot.com",

  messagingSenderId: "709983661671",

  appId: "1:709983661671:web:79660f964333e06aebaec2",

  measurementId: "G-ZK9FE12QLZ"

};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();
export default db