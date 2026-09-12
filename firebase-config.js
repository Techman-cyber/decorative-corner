// ============================================
// Firebase setup
// ============================================
// 1. Go to https://console.firebase.google.com → create/open your project.
// 2. Project settings (gear icon) → General → "Your apps" → Add app → Web (</>).
// 3. Copy the firebaseConfig object it gives you and paste the values below.
// 4. In the left sidebar go to Build → Authentication → Get started, then
//    enable the "Email/Password" and "Google" sign-in providers.
// 5. Authentication → Settings → Authorized domains → add the domain you'll
//    host this site on (localhost is already allowed for local testing).

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwOA143HmGuEesTfPtbAaCwM_oI4G1kfU",
  authDomain: "decorative-corner.firebaseapp.com",
  projectId: "decorative-corner",
  storageBucket: "decorative-corner.firebasestorage.app",
  messagingSenderId: "5254377508",
  appId: "1:5254377508:web:0031ec5d9c7d143dbba8b1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
