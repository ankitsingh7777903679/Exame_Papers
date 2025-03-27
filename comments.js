// Comments Module
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, startAfter } from "https://www.gstatic.com/firebasejs/11.5.0/firebase-firestore.js";
import { getCurrentUser } from './auth.js';

// Constants
const COMMENTS_PER_PAGE = 10;

// Initialize Firestore
const db = getFirestore();

// Cache DOM elements
const elements = {
    commentForm: document.querySelector(".comment-form"),
    commentInput: document.getElementById("commentInput"),
    postCommentBtn: document.getElementById("postCommentBtn"),
    commentList: document.getElementById("commentList"),
    loadMoreCommentsBtn: document.getElementById("loadMoreCommentsBtn")
};

let lastVisible = null;

// Format date for comments
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
};

// Create comment element
const createCommentElement = (comment) => {
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
        <div class="comment-header">
            <img src="${comment.image}" alt="${comment.name}" class="comment-image">
            <span class="comment-name">${comment.name}</span>
        </div>
        <div class="comment-text">${comment.text}</div>
        <div class="comment-timestamp">${formatDate(comment.timestamp)}</div>
    `;
    return div;
};

// Fetch comments
export const fetchComments = async (page = 0) => {
    try {
        elements.loadMoreCommentsBtn.style.display = 'none';
        
        let commentsQuery;
        if (page === 0) {
            commentsQuery = query(
                collection(db, 'comments'),
                orderBy('timestamp', 'desc'),
                limit(COMMENTS_PER_PAGE)
            );
            elements.commentList.innerHTML = '';
        } else {
            commentsQuery = query(
                collection(db, 'comments'),
                orderBy('timestamp', 'desc'),
                startAfter(lastVisible),
                limit(COMMENTS_PER_PAGE)
            );
        }

        const snapshot = await getDocs(commentsQuery);
        if (!snapshot.empty) {
            snapshot.forEach((doc) => {
                const comment = doc.data();
                const commentElement = createCommentElement(comment);
                elements.commentList.appendChild(commentElement);
            });

            lastVisible = snapshot.docs[snapshot.docs.length - 1];
            if (snapshot.docs.length === COMMENTS_PER_PAGE) {
                elements.loadMoreCommentsBtn.style.display = 'block';
            }
        } else if (page === 0) {
            elements.commentList.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
        elements.commentList.innerHTML = '<p>Error loading comments. Please try again later.</p>';
    }
};

// Handle post comment
export const handlePostComment = async () => {
    const commentText = elements.commentInput.value.trim();
    const currentUser = getCurrentUser();
    
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
document.addEventListener('DOMContentLoaded', () => {
    elements.postCommentBtn.addEventListener("click", handlePostComment);
    elements.commentInput.addEventListener("keypress", e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handlePostComment();
        }
    });
    elements.loadMoreCommentsBtn.addEventListener("click", () => fetchComments(lastVisible ? 1 : 0));
    
    // Initial load
    fetchComments(0);
}); 