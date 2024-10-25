// Language handling
let currentLanguage = 'en';
let translations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/get_translation/${lang}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
        updatePageTranslations();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function updatePageTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
        }
    });
}

// Section toggling
function toggleSections(section) {
    const welcomeSection = document.getElementById('welcome-section');
    const signupSection = document.getElementById('signup-section');
    
    if (!welcomeSection || !signupSection) {
        console.warn('Required sections not found in the DOM');
        return;
    }

    welcomeSection.classList.toggle('hidden', section === 'signup');
    signupSection.classList.toggle('hidden', section !== 'signup');
}

// Initialize language selector
function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language');
    if (!languageSelect) {
        console.warn('Language selector not found');
        return;
    }

    // Remove any existing listeners before adding a new one
    const newLanguageSelect = languageSelect.cloneNode(true);
    languageSelect.parentNode.replaceChild(newLanguageSelect, languageSelect);
    
    newLanguageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        loadTranslations(currentLanguage);
    });
    
    // Initial translation load
    loadTranslations(currentLanguage);
}

// Initialize signup form
function initializeSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) {
        return;
    }

    // Remove any existing listeners before adding a new one
    const newForm = signupForm.cloneNode(true);
    signupForm.parentNode.replaceChild(newForm, signupForm);
    
    newForm.addEventListener('submit', function(e) {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (!passwordInput || !confirmPasswordInput) {
            e.preventDefault();
            alert('Password fields not found!');
            return;
        }
        
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        if (!password || !confirmPassword) {
            e.preventDefault();
            alert('Please fill in all password fields!');
            return;
        }
        
        if (password !== confirmPassword) {
            e.preventDefault();
            alert('Passwords do not match!');
            return;
        }
        
        if (password.length < 8) {
            e.preventDefault();
            alert('Password must be at least 8 characters long!');
            return;
        }
    });
}

// Initialize login form
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) {
        return;
    }

    // Remove any existing listeners before adding a new one
    const newForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newForm, loginForm);
    
    newForm.addEventListener('submit', function(e) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (!emailInput?.value || !passwordInput?.value) {
            e.preventDefault();
            alert('Please fill in all fields!');
            return;
        }
    });
}

// Main initialization - using a flag to prevent multiple initializations
let initialized = false;
document.addEventListener('DOMContentLoaded', function() {
    if (initialized) {
        return;
    }
    initialized = true;
    
    initializeLanguageSelector();
    initializeSignupForm();
    initializeLoginForm();
});
