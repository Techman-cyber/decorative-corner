// ============================================
// Auth guard — include this on every page that should require login
// ============================================
import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    const here = location.pathname.split("/").pop() || "index.html";
    location.replace(`login.html?next=${encodeURIComponent(here)}`);
    return;
  }

  // Reveal the page now that we know the visitor is signed in.
  document.documentElement.classList.remove("auth-checking");

  // Fill in any "who's signed in" placeholders in the header.
});

// Wire up any logout button on the page (header, menu, etc.)
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-logout]");
  if (!btn) return;
  signOut(auth).then(() => location.replace("login.html"));
});
