// ============================================
// Auth guard — include on pages that require login:
//   profile.html, cart.html, checkout.html, admin.html
// Do NOT include on: index.html, product.html, contact.html, login.html
// ============================================
import { auth } from "./firebase-config.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    const here = location.pathname.split("/").pop() + location.search || "index.html";
    location.replace(`login.html?next=${encodeURIComponent(here)}`);
    return;
  }

  // Reveal the page now that the visitor is signed in.
  document.documentElement.classList.remove("auth-checking");
});

// Logout button handler — sends user home, not back to login.
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-logout]");
  if (!btn) return;
  signOut(auth).then(() => location.replace("index.html"));
});
