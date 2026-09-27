// ============================================
// Decorative Corner - Firebase Configuration
// ============================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import {
  getDatabase
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

import {
  getAnalytics,
  isSupported
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";

// ============================================
// Firebase project configuration
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyBwOA143HmGuEesTfPtbAaCwM_oI4G1kfU",
  authDomain: "decorative-corner.firebaseapp.com",
  databaseURL: "https://decorative-corner-default-rtdb.firebaseio.com",
  projectId: "decorative-corner",
  storageBucket: "decorative-corner.firebasestorage.app",
  messagingSenderId: "5254377508",
  appId: "1:5254377508:web:0031ec5d9c7d143dbba8b1",
  measurementId: "G-7FE8N3XKDN"
};

// ============================================
// Initialize Firebase
// ============================================

const app = initializeApp(firebaseConfig);

// Authentication
export const auth = getAuth(app);

// Cloud Firestore
export const db = getFirestore(app);

// Realtime Database
export const database = getDatabase(app);

// Analytics
export let analytics = null;

isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  })
  .catch((error) => {
    console.warn("Firebase Analytics unavailable:", error);
  });

// Export app as well
export { app };
