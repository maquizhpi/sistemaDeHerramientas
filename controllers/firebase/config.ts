// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBVE1_FgOYqG7JQRkZ2rFpXMR6WfqNqUlo",
  authDomain: "solicitudes-70af0.firebaseapp.com",
  projectId: "solicitudes-70af0",
  storageBucket: "solicitudes-70af0.appspot.com",
  messagingSenderId: "513108134731",
  appId: "1:513108134731:web:3aabdd8a5d4dcc54aab6ce",
  measurementId: "G-BYE06JTMPH"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp