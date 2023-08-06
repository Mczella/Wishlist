
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "mcz-christmas.firebaseapp.com",
    projectId: "mcz-christmas",
    storageBucket: "mcz-christmas.appspot.com",
    messagingSenderId: "734981717904",
    appId: "1:734981717904:web:c1f8f8d2e6b4a152db3d15",
    measurementId: "G-MWFXRT59NJ"
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
export const db = getFirestore(app)
export const auth = getAuth()
export const storage = getStorage(app)