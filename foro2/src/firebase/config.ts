// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxirRwsEarX1KPtA4F92Far4LIWNOoAVo",
  authDomain: "foro-2-f6830.firebaseapp.com",
  projectId: "foro-2-f6830",
  storageBucket: "foro-2-f6830.firebasestorage.app",
  messagingSenderId: "1092404268201",
  appId: "1:1092404268201:web:58071093f4a18d9a53adb8",
  measurementId: "G-VDLZCV53MK",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
