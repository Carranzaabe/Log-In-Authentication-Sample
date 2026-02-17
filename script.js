// 1. Import Firebase SDKs (Using standard ES modules for Vanilla JS)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. Your Firebase Configuration (Replace with your keys from the Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyAkSutLoKgxzoLsYgFQFI7dGTeTEThrrfM",
    authDomain: "jollibee-login.firebaseapp.com",
    projectId: "jollibee-login",
    storageBucket: "jollibee-login.firebasestorage.app",
    messagingSenderId: "968484007937",
    appId: "1:968484007937:web:aad9e30233f537ea3c1000"
  };

// 3. Initialize Firebase & Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 4. Get DOM Elements
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const btnLogin = document.getElementById('btn-login');
const btnSignup = document.getElementById('btn-signup');
const authSection = document.getElementById('auth-section');
const homeSection = document.getElementById('home-section');
const logoutBtn = document.getElementById('logout-btn');

const loginError = document.getElementById('login-error');
const signupError = document.getElementById('signup-error');

// 5. Toggle Form UI
btnLogin.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
    btnLogin.classList.add('active');
    btnSignup.classList.remove('active');
    loginError.classList.add('hidden');
});

btnSignup.addEventListener('click', () => {
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
    btnSignup.classList.add('active');
    btnLogin.classList.remove('active');
    signupError.classList.add('hidden');
});

// 6. Real-time Auth Listener (Handles the page swap automatically)
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is logged in: show home page
        authSection.classList.add('hidden');
        homeSection.classList.remove('hidden');
        document.body.style.background = '#f8f9fa';
    } else {
        // User is logged out: show login page
        homeSection.classList.add('hidden');
        authSection.classList.remove('hidden');
        document.body.style.background = 'linear-gradient(135deg, #E31837 0%, #FFC300 100%)';
    }
});

// 7. Handle Sign Up
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            signupForm.reset();
            signupError.classList.add('hidden');
        })
        .catch((error) => {
            // Show Firebase error message to user
            signupError.textContent = error.message;
            signupError.classList.remove('hidden');
        });
});

// 8. Handle Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            loginForm.reset();
            loginError.classList.add('hidden');
        })
        .catch((error) => {
            loginError.textContent = "Invalid email or password.";
            loginError.classList.remove('hidden');
        });
});

// 9. Handle Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth).catch((error) => {
        console.error("Logout Error:", error);
    });
});

// 10. Handle Google Sign-In
// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

// Get the new Google Button element (add this to your DOM Elements section)
const btnGoogle = document.getElementById('btn-google');

// Handle Google Sign In
btnGoogle.addEventListener('click', () => {
    signInWithPopup(auth, googleProvider)
        .then((result) => {
            // Success! We don't need to manually change the screen here because
            // your existing `onAuthStateChanged` listener will detect the login
            // and swap to the home page automatically.
            console.log("Logged in nicely as:", result.user.displayName);
        })
        .catch((error) => {
            // If the user closes the popup early, or there is a network issue
            console.error("Google Auth Error:", error.message);
        });
});