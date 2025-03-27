import { debounce } from './utils.js';

// Cache DOM elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    suggestionsDiv: document.getElementById('suggestions'),
    clearButton: document.querySelector('.btn-clear')
};

// Constants
const DEBOUNCE_DELAY = 300;
let questions = [];

// Load questions from JSON
const loadQuestions = async () => {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
    } catch (error) {
        console.error('Error loading questions:', error);
    }
};

// Filter and sort questions based on search query
const filterQuestions = (query) => {
    const searchTerms = query.toLowerCase().split(' ');
    return questions
        .map(question => {
            const text = question.text.toLowerCase();
            const score = searchTerms.reduce((acc, term) => {
                return acc + (text.includes(term) ? 1 : 0);
            }, 0);
            return { ...question, score };
        })
        .filter(q => q.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
};

// Create suggestion element
const createSuggestionElement = (question) => {
    const div = document.createElement('div');
    div.className = 'suggestion-item';
    div.innerHTML = `
        <i class="fa-solid fa-magnifying-glass me-2"></i>
        <span>${question.text}</span>
    `;
    div.addEventListener('click', () => {
        scrollToQuestion(question);
        elements.searchInput.value = question.text;
        hideSuggestions();
    });
    return div;
};

// Scroll to question
const scrollToQuestion = (question) => {
    const element = document.getElementById(question.id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        element.classList.add('highlight');
        setTimeout(() => element.classList.remove('highlight'), 2000);
    }
};

// Show suggestions
const showSuggestions = (filteredQuestions) => {
    elements.suggestionsDiv.innerHTML = '';
    if (filteredQuestions.length === 0) {
        elements.suggestionsDiv.style.display = 'none';
        return;
    }

    filteredQuestions.forEach(question => {
        elements.suggestionsDiv.appendChild(createSuggestionElement(question));
    });
    elements.suggestionsDiv.style.display = 'block';
};

// Hide suggestions
const hideSuggestions = () => {
    elements.suggestionsDiv.style.display = 'none';
};

// Handle search input
const handleSearchInput = debounce((event) => {
    const query = event.target.value.trim();
    elements.clearButton.style.display = query ? 'block' : 'none';

    if (query.length < 2) {
        hideSuggestions();
        return;
    }

    const filteredQuestions = filterQuestions(query);
    showSuggestions(filteredQuestions);
}, DEBOUNCE_DELAY);

// Handle clear search
const handleClearSearch = () => {
    elements.searchInput.value = '';
    elements.clearButton.style.display = 'none';
    hideSuggestions();
};

// Initialize search functionality
const initializeSearch = () => {
    // Load questions
    loadQuestions();

    // Event listeners
    elements.searchInput.addEventListener('input', handleSearchInput);
    elements.clearButton.addEventListener('click', handleClearSearch);
    document.addEventListener('click', (e) => {
        if (!elements.searchInput.contains(e.target) && !elements.suggestionsDiv.contains(e.target)) {
            hideSuggestions();
        }
    });
};

// Export functions
export {
    initializeSearch,
    loadQuestions
}; 