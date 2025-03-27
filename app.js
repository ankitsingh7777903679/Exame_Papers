// Main Application Module
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
import { initializeAuth, subscribeToAuthChanges } from './auth.js';
import { initializeComments } from './comments.js';
import { setupLazyLoading, prefetchResources } from './utils.js';
import { initializeSearch } from './search.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchResults: document.getElementById('searchResults'),
    backToTopBtn: document.getElementById('backToTopBtn'),
    themeToggle: document.getElementById('themeToggle')
};

/**
 * Handles theme toggle
 */
const handleThemeToggle = () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    elements.themeToggle.textContent = isDark ? '🌞' : '🌙';
};

/**
 * Handles scroll behavior
 */
const handleScroll = () => {
    if (window.scrollY > 300) {
        elements.backToTopBtn.style.display = 'block';
    } else {
        elements.backToTopBtn.style.display = 'none';
    }
};

/**
 * Initializes the application
 */
const initializeApp = async () => {
    try {
        // Initialize authentication
        initializeAuth();
        
        // Subscribe to auth changes for comments
        subscribeToAuthChanges(user => {
            initializeComments(user);
        });

        // Set up lazy loading for images
        setupLazyLoading();

        // Initialize comments functionality
        await initializeComments();

        // Initialize search functionality
        await initializeSearch();

        // Prefetch resources for better performance
        prefetchResources();

        // Theme initialization
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            elements.themeToggle.textContent = '🌞';
        }

        // Event listeners
        elements.themeToggle.addEventListener('click', handleThemeToggle);
        window.addEventListener('scroll', handleScroll);
        elements.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }

    } catch (error) {
        console.error('Error initializing app:', error);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Export for testing
export {
    initializeApp,
    handleThemeToggle,
    handleScroll
}; 