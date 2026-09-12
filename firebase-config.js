// ============================================
// Firebase setup
// ============================================
// 1. Go to https://console.firebase.google.com → create/open your project.
// 2. Project settings (gear icon) → General → "Your apps" → Add app → Web (</>).
// 3. Copy the firebaseConfig object it gives you and paste the values below.
// 4. In the left sidebar go to Build → Authentication → Get started, then
//    enable the "Email/Password" and "Google" sign-in providers.
// 5. For "Apple", you'll also need an Apple Developer account: create a
//    Services ID + Sign in with Apple key at developer.apple.com, then paste
//    those into the Apple provider screen in Firebase. Apple sign-in simply
//    won't work until that's done — Google and Email/Password don't need it.
// 6. Authentication → Settings → Authorized domains → add the domain you'll
//    host this site on (localhost is already allowed for local testing).
// 7. IMPORTANT: Google/Apple pop-up sign-in will not work if you open these
//    HTML files directly (file:// in the address bar). Serve the folder with
//    a local server, e.g. `npx serve .` or VS Code's "Live Server", and open
//    it via http://localhost.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
