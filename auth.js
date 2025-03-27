// Firebase SDK Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBHewNLmqJPFMpLpvj2amQEapBNX9vZAuU",
    authDomain: "questionbanker-79ff9.firebaseapp.com",
    projectId: "questionbanker-79ff9",
    storageBucket: "questionbanker-79ff9.firebasestorage.app",
    messagingSenderId: "534281169916",
    appId: "1:534281169916:web:44a98c2559cf984527e079",
    measurementId: "G-YTYLDW22PH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Cache DOM elements
const elements = {
    signInBtn: document.getElementById("signInBtn"),
    userInfo: document.getElementById("userInfo")
};

let currentUser = null;

// Authentication Handlers
export const handleSignIn = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        currentUser = result.user;
        updateUIAfterAuth(true);
        return result.user;
    } catch (error) {
        console.error("Sign-in error:", error);
        alert(`Failed to sign in: ${error.message}`);
        return null;
    }
};

export const updateUIAfterAuth = (isSignedIn) => {
    elements.signInBtn.style.display = isSignedIn ? "none" : "block";
    elements.userInfo.style.display = isSignedIn ? "block" : "none";
    if (isSignedIn && currentUser) {
        elements.userInfo.textContent = `Signed in as: ${currentUser.displayName}`;
    }
};

export const getCurrentUser = () => currentUser;

// Initialize auth state observer
auth.onAuthStateChanged(user => {
    currentUser = user;
    updateUIAfterAuth(!!user);
});

// Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    elements.signInBtn.addEventListener("click", handleSignIn);
}); 