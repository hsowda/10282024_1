// Language handling
let currentLanguage = 'en';
let translations = {};

async function loadTranslations(lang) {
    try {
        console.log('Loading translations for language:', lang);
        const response = await fetch(`/get_translation/${lang}`);
        translations = await response.json();
        console.log('Loaded translations:', translations);
        updatePageTranslations();
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

function updatePageTranslations() {
    console.log('Updating page translations...');
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            element.textContent = translations[key];
            console.log('Translation applied:', translations[key]);
        } else {
            console.warn('Missing translation for key:', key);
        }
    });
}

// Section toggling
function toggleSections(section) {
    const welcomeSection = document.getElementById('welcome-section');
    const signupSection = document.getElementById('signup-section');
    
    if (welcomeSection && signupSection) {
        if (section === 'signup') {
            welcomeSection.classList.add('hidden');
            signupSection.classList.remove('hidden');
        } else {
            welcomeSection.classList.remove('hidden');
            signupSection.classList.add('hidden');
        }
    }
}

// Initialize language selector
function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            console.log('Language changed to:', e.target.value);
            currentLanguage = e.target.value;
            loadTranslations(currentLanguage);
        });
        
        // Initial translation load
        console.log('Loading initial translations');
        loadTranslations(currentLanguage);
    }
}

// Initialize signup form
function initializeSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            
            if (!passwordInput || !confirmPasswordInput) {
                e.preventDefault();
                alert('Password fields not found!');
                return false;
            }
            
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (!password || !confirmPassword) {
                e.preventDefault();
                alert('Please fill in all password fields!');
                return false;
            }
            
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Passwords do not match!');
                return false;
            }
            
            if (password.length < 8) {
                e.preventDefault();
                alert('Password must be at least 8 characters long!');
                return false;
            }
        });
    }
}

// Initialize login form
function initializeLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            
            if (!emailInput || !passwordInput || !emailInput.value || !passwordInput.value) {
                e.preventDefault();
                alert('Please fill in all fields!');
                return false;
            }
        });
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Initialize all components
    initializeLanguageSelector();
    initializeSignupForm();
    initializeLoginForm();
});
