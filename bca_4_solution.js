<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
    <script type="module">
        // Firebase SDK Imports
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-analytics.js";
        import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, startAfter } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
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
        const analytics = getAnalytics(app);
        const db = getFirestore(app);
        const auth = getAuth(app);
        const provider = new GoogleAuthProvider();

        // Constants
        const COMMENTS_PER_PAGE = 10;
        const DEBOUNCE_DELAY = 300;
        const COPY_FEEDBACK_DELAY = 2000;

        // Cache DOM elements
        const elements = {
            signInBtn: document.getElementById("signInBtn"),
            userInfo: document.getElementById("userInfo"),
            commentForm: document.querySelector(".comment-form"),
            commentInput: document.getElementById("commentInput"),
            postCommentBtn: document.getElementById("postCommentBtn"),
            commentList: document.getElementById("commentList"),
            loadMoreCommentsBtn: document.getElementById("loadMoreCommentsBtn"),
            searchInput: document.getElementById("searchInput"),
            suggestionsDiv: document.getElementById("suggestions"),
            clearButton: document.querySelector(".btn-clear"),
            backToTopBtn: document.getElementById("backToTopBtn")
        };

        // Global state
        let currentUser = null;
        let lastVisible = null;
        let allQuestions = [];
        let questionMap = {};
        let tokenizedCache = new Map();
        let debounceTimeout;

        // Helper Functions
        const tokenize = text => text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);

        const calculateRelevance = (queryTokens, questionTokens, keywordTokens) => {
            let score = 0;
            queryTokens.forEach(qToken => {
                questionTokens.forEach(qt => {
                    if (qt.includes(qToken)) {
                        score += qt === qToken ? 3 : (qt.startsWith(qToken) ? 2 : 1);
                    }
                });
                keywordTokens.forEach(kt => {
                    if (kt.includes(qToken)) {
                        score += kt === qToken ? 5 : (kt.startsWith(qToken) ? 3 : 2);
                    }
                });
            });
            return score;
        };

        const escapeHtmlForAttribute = str => str
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Authentication Handlers
        const handleSignIn = async () => {
            try {
                const result = await signInWithPopup(auth, provider);
                currentUser = result.user;
                updateUIAfterAuth(true);
            } catch (error) {
                console.error("Sign-in error:", error);
                alert(`Failed to sign in: ${error.message}`);
            }
        };

        const updateUIAfterAuth = (isSignedIn) => {
            elements.signInBtn.style.display = isSignedIn ? "none" : "block";
            elements.userInfo.style.display = isSignedIn ? "block" : "none";
            elements.commentForm.style.display = isSignedIn ? "flex" : "none";
            elements.commentForm.setAttribute("aria-hidden", (!isSignedIn).toString());
            if (isSignedIn && currentUser) {
                elements.userInfo.textContent = `Signed in as: ${currentUser.displayName}`;
            }
        };

        // Comment Handlers
        const handlePostComment = async () => {
            const commentText = elements.commentInput.value.trim();
            if (!commentText || !currentUser) {
                alert(commentText ? 'Please sign in to post a comment.' : 'Please enter a comment.');
                return;
            }

            elements.postCommentBtn.disabled = true;
            try {
                await addDoc(collection(db, 'comments'), {
                    text: commentText,
                    name: currentUser.displayName || "Anonymous",
                    image: currentUser.photoURL || "https://via.placeholder.com/50",
                    timestamp: new Date().toISOString()
                });
                elements.commentInput.value = '';
                fetchComments(0);
            } catch (error) {
                console.error('Error posting comment:', error);
                alert('Failed to post comment.');
            } finally {
                elements.postCommentBtn.disabled = false;
            }
        };

        // Initialize Event Listeners
        const initializeEventListeners = () => {
            elements.signInBtn.addEventListener("click", handleSignIn);
            elements.postCommentBtn.addEventListener("click", handlePostComment);
            elements.commentInput.addEventListener("keypress", e => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                    handlePostComment();
                }
            });
            elements.loadMoreCommentsBtn.addEventListener("click", () => fetchComments(lastVisible ? 1 : 0));
            elements.searchInput.addEventListener("input", debounceSearch);
            elements.clearButton.addEventListener("click", handleClearSearch);
            window.addEventListener("scroll", handleScroll);
            elements.backToTopBtn.addEventListener("click", () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // Initialize auth state observer
            auth.onAuthStateChanged(user => {
                currentUser = user;
                updateUIAfterAuth(!!user);
            });
        };

        // Initialize the application
        const init = async () => {
            initializeEventListeners();
            await fetchComments(0);
            loadQuestions();
        };

        // Start the application
        document.addEventListener('DOMContentLoaded', init);

        // Export necessary functions for use in other modules
        export {
            handlePostComment,
            handleSignIn,
            fetchComments,
            loadQuestions,
            escapeHtmlForAttribute,
            calculateRelevance,
            tokenize
        };
    </script>
