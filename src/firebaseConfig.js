// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBzDSvwvNx9YeEkxl_qwpMBQBZhN4V-Q8",
  authDomain: "final-project-142d2.firebaseapp.com",
  projectId: "final-project-142d2",
  storageBucket: "final-project-142d2.appspot.com",
  messagingSenderId: "485417969321",
  appId: "1:485417969321:web:3cd8d14d3a957509d06bb8",
  measurementId: "G-D3ZZN7Y2VS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };