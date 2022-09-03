import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDSf_tHNB-WrZLPj2PdFoQfwEE2rANuXu0",
    authDomain: "socialmedia-c27dd.firebaseapp.com",
    projectId: "socialmedia-c27dd",
    storageBucket: "socialmedia-c27dd.appspot.com",
    messagingSenderId: "258012490657",
    appId: "1:258012490657:web:e469cc1c79d1a66283f9e0",
    measurementId: "G-4SKQ0QHMPZ"
  };

  const app = initializeApp(firebaseConfig);

  export const auth = getAuth(app)


  export const db = getFirestore();

  export const storage = getStorage(app);
