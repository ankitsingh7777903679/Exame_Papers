// Questions Module
import { escapeHtmlForAttribute } from './utils.js';

// Constants
const DEBOUNCE_DELAY = 300;
const COPY_FEEDBACK_DELAY = 2000;

// State
let allQuestions = [];
let questionMap = {};
let tokenizedCache = new Map();
let debounceTimeout;

// DOM Elements
const elements = {
    searchInput: document.getElementById('searchInput'),
    suggestionsDiv: document.getElementById('suggestions'),
    clearButton: document.querySelector('.btn-clear'),
    loadingIndicator: null
};

// Initialize loading indicator
const initLoadingIndicator = () => {
    elements.suggestionsDiv.insertAdjacentHTML('beforeend', '<div class="suggestion-item loading" style="display: none;">Loading...</div>');
    elements.loadingIndicator = elements.suggestionsDiv.querySelector('.loading');
};

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

const highlightText = (element, query) => {
    const questionTextElement = element.querySelector('.question-text, .card-title, .card-text');
    if (!questionTextElement) return;
    const text = questionTextElement.textContent;
    questionTextElement.setAttribute('data-original-text', text);
    const regex = new RegExp(`(${query})`, 'gi');
    questionTextElement.innerHTML = text.replace(regex, '<span style="background-color: yellow; color: black;">$1</span>');
};

// Copy functionality
const handleCopy = async (code, button) => {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(code);
        } else {
            fallbackCopyText(code);
        }
        button.textContent = 'Copied!';
        button.classList.add('copied');
        setTimeout(() => {
            button.textContent = 'Copy';
            button.classList.remove('copied');
        }, COPY_FEEDBACK_DELAY);
    } catch (err) {
        console.error('Copy failed:', err);
        alert('Failed to copy text.');
    }
};

const fallbackCopyText = text => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('Fallback copy failed:', err);
        alert('Failed to copy text.');
    }
    document.body.removeChild(textArea);
};

// Search functionality
const debounceSearch = () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const query = elements.searchInput.value.trim();
        const queryTokens = tokenize(query);
        const questions = document.querySelectorAll('.question');
        const activeTab = document.querySelector('.nav-pills .active').id.replace('pills-', '').replace('-tab', '');

        elements.clearButton.style.display = query ? 'inline-block' : 'none';
        elements.suggestionsDiv.innerHTML = '';
        elements.suggestionsDiv.appendChild(elements.loadingIndicator);
        elements.suggestionsDiv.style.display = query ? 'block' : 'none';
        elements.loadingIndicator.style.display = query ? 'block' : 'none';

        if (!query) {
            handleEmptyQuery(questions, activeTab);
            return;
        }

        const matchingQuestions = findMatchingQuestions(queryTokens, activeTab);
        updateSuggestions(matchingQuestions, questions, activeTab, query);
    }, DEBOUNCE_DELAY);
};

const handleEmptyQuery = (questions, activeTab) => {
    questions.forEach(q => {
        const questionSubject = q.id.split('-')[0];
        q.style.display = (questionSubject === activeTab) ? '' : 'none';
        resetQuestionText(q);
    });
    elements.suggestionsDiv.style.display = 'none';
};

const findMatchingQuestions = (queryTokens, activeTab) => {
    return allQuestions
        .map(q => {
            if (q.subject !== activeTab) return null;
            const { questionTokens, keywordTokens } = tokenizedCache.get(q.key);
            const relevance = calculateRelevance(queryTokens, questionTokens, keywordTokens);
            return relevance > 0 ? { ...q, relevance } : null;
        })
        .filter(q => q !== null)
        .sort((a, b) => b.relevance - a.relevance);
};

const updateSuggestions = (matchingQuestions, questions, activeTab, query) => {
    elements.loadingIndicator.style.display = 'none';
    if (matchingQuestions.length > 0) {
        matchingQuestions.slice(0, 10).forEach(q => createSuggestionItem(q, questions, activeTab));
        elements.suggestionsDiv.style.display = 'block';
    } else {
        elements.suggestionsDiv.innerHTML = '<div class="suggestion-item">No suggestions found.</div>';
        elements.suggestionsDiv.style.display = 'block';
    }
    updateQuestionDisplay(questions, activeTab, query, matchingQuestions);
};

const createSuggestionItem = (q, questions, activeTab) => {
    const suggestionItem = document.createElement('div');
    suggestionItem.classList.add('suggestion-item');
    suggestionItem.textContent = q.question;
    suggestionItem.setAttribute('data-key', q.key);
    suggestionItem.addEventListener('click', () => handleSuggestionClick(q, questions, activeTab));
    elements.suggestionsDiv.appendChild(suggestionItem);
};

const handleSuggestionClick = (q, questions, activeTab) => {
    elements.searchInput.value = q.question;
    elements.suggestionsDiv.style.display = 'none';
    const questionInfo = questionMap[q.key];
    if (questionInfo?.element) {
        updateQuestionVisibility(questions, activeTab, questionInfo.element);
        highlightText(questionInfo.element, q.question);
        questionInfo.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

const updateQuestionDisplay = (questions, activeTab, query) => {
    questions.forEach(q => {
        const questionSubject = q.id.split('-')[0];
        if (questionSubject !== activeTab) {
            q.style.display = 'none';
            return;
        }
        const { questionTokens, keywordTokens } = tokenizedCache.get(q.id) || { 
            questionTokens: tokenize(q.textContent), 
            keywordTokens: [] 
        };
        const matches = queryTokens.every(token =>
            questionTokens.some(qToken => qToken.includes(token)) ||
            keywordTokens.some(kToken => kToken.includes(token))
        );
        q.style.display = matches ? '' : 'none';
        if (matches) highlightText(q, query);
    });
};

const resetQuestionText = (question) => {
    const textElement = question.querySelector('.question-text, .card-title, .card-text');
    if (textElement) {
        const originalText = textElement.getAttribute('data-original-text') || textElement.textContent;
        textElement.innerHTML = originalText;
        textElement.setAttribute('data-original-text', originalText);
    }
};

// Event Handlers
const handleClearSearch = () => {
    elements.searchInput.value = '';
    const questions = document.querySelectorAll('.question');
    const activeTab = document.querySelector('.nav-pills .active').id.replace('pills-', '').replace('-tab', '');
    handleEmptyQuery(questions, activeTab);
    elements.clearButton.style.display = 'none';
    elements.suggestionsDiv.style.display = 'none';
};

const handleClickOutside = (event) => {
    if (!elements.suggestionsDiv.contains(event.target) && !elements.searchInput.contains(event.target)) {
        elements.suggestionsDiv.style.display = 'none';
    }
};

// Load and display questions
const loadQuestions = async () => {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Process each subject
        Object.entries(data).forEach(([subject, subjectData]) => {
            // Process MCQs
            if (subjectData.mcq) {
                const mcqContainer = document.getElementById(`${subject}-mcq-questions`);
                subjectData.mcq.forEach(question => {
                    const questionElement = createMCQElement(question);
                    mcqContainer?.appendChild(questionElement);
                    cacheQuestion(question, subject, 'mcq', questionElement);
                });
            }

            // Process short questions
            if (subjectData.onemarks) {
                const onemarksContainer = document.getElementById(`${subject}-onemarks-questions`);
                subjectData.onemarks.forEach(question => {
                    const questionElement = createShortQuestionElement(question);
                    onemarksContainer?.appendChild(questionElement);
                    cacheQuestion(question, subject, 'onemarks', questionElement);
                });
            }

            // Process long questions
            if (subjectData.long) {
                const longContainer = document.getElementById(`${subject}-long-questions`);
                subjectData.long.forEach(question => {
                    const questionElement = createLongQuestionElement(question);
                    longContainer?.appendChild(questionElement);
                    cacheQuestion(question, subject, 'long', questionElement);
                });
            }

            // Process important questions
            if (subjectData.imp) {
                const impContainer = document.getElementById(`${subject}-imp-questions`);
                subjectData.imp.forEach(question => {
                    const questionElement = createImpQuestionElement(question);
                    impContainer?.appendChild(questionElement);
                    cacheQuestion(question, subject, 'imp', questionElement);
                });
            }
        });

        initializeEventListeners();
    } catch (error) {
        console.error('Error loading questions:', error);
        document.querySelectorAll('[id$="-questions"]').forEach(container => {
            container.innerHTML = '<div class="alert alert-danger">Failed to load questions. Please refresh the page.</div>';
        });
    }
};

// Helper function to create MCQ element
const createMCQElement = (question) => {
    const div = document.createElement('div');
    div.className = 'card mb-3 question';
    div.id = question.id;
    
    const html = `
        <div class="card-body">
            <h5 class="card-title question-text">${escapeHtmlForAttribute(question.question)}</h5>
            <div class="card-text">
                ${question.options.map(option => `<div>${escapeHtmlForAttribute(option)}</div>`).join('')}
                ${question.correctAnswer ? `<div class="mt-2"><strong>Answer:</strong> ${escapeHtmlForAttribute(question.correctAnswer)}</div>` : ''}
            </div>
        </div>
    `;
    div.innerHTML = html;
    return div;
};

// Helper function to create short question element
const createShortQuestionElement = (question) => {
    const div = document.createElement('div');
    div.className = 'card mb-3 question';
    div.id = question.id;
    
    const html = `
        <div class="card-body">
            <h5 class="card-title question-text">${escapeHtmlForAttribute(question.question)}</h5>
            ${question.answer ? `<div class="card-text answer-text">${escapeHtmlForAttribute(question.answer)}</div>` : ''}
        </div>
    `;
    div.innerHTML = html;
    return div;
};

// Helper function to create long question element
const createLongQuestionElement = (question) => {
    const div = document.createElement('div');
    div.className = 'card mb-3 question';
    div.id = question.id;
    
    const html = `
        <div class="card-body">
            <h5 class="card-title question-text">${escapeHtmlForAttribute(question.question)}</h5>
            ${question.answer ? `<div class="card-text">${escapeHtmlForAttribute(question.answer)}</div>` : ''}
            ${question.code ? `
                <div class="code-block">
                    <button class="copy-btn" onclick="handleCopy('${escapeHtmlForAttribute(question.code)}', this)">Copy</button>
                    <pre><code>${escapeHtmlForAttribute(question.code)}</code></pre>
                </div>
            ` : ''}
        </div>
    `;
    div.innerHTML = html;
    return div;
};

// Helper function to create important question element
const createImpQuestionElement = (question) => {
    const div = document.createElement('div');
    div.className = 'card mb-3 question';
    div.id = question.id;
    
    const html = `
        <div class="card-body">
            <h5 class="card-title question-text">${escapeHtmlForAttribute(question.question)}</h5>
            ${question.answer ? `<div class="card-text">${escapeHtmlForAttribute(question.answer)}</div>` : ''}
        </div>
    `;
    div.innerHTML = html;
    return div;
};

// Helper function to cache question data
const cacheQuestion = (question, subject, type, element) => {
    const key = question.id || `${subject}-${type}-${allQuestions.length}`;
    const questionData = {
        key,
        subject,
        type,
        question: question.question,
        element
    };
    allQuestions.push(questionData);
    questionMap[key] = questionData;
    tokenizedCache.set(key, {
        questionTokens: tokenize(question.question),
        keywordTokens: tokenize(question.keywords || '')
    });
};

// Initialize event listeners
const initializeEventListeners = () => {
    elements.searchInput.addEventListener('input', debounceSearch);
    elements.clearButton.addEventListener('click', handleClearSearch);
    document.addEventListener('click', handleClickOutside);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initLoadingIndicator();
    loadQuestions();
});

// Export necessary functions
export {
    loadQuestions,
    handleCopy,
    handleClearSearch
}; 