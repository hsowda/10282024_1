// Language handling
let currentLanguage = 'en';
let translations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/get_translation/${lang}`);
        if (!response.ok) {
            return;
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

// Initialize language handling
function initializeLanguageHandling() {
    currentLanguage = localStorage.getItem('preferred_language') || 'en';
    loadTranslations(currentLanguage);
    
    const languageSelect = document.getElementById('language');
    if (!languageSelect) {
        return; // Silently return if language selector is not present on this page
    }

    languageSelect.value = currentLanguage;
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('preferred_language', currentLanguage);
        loadTranslations(currentLanguage);
    });
}

// Form validation
function initializeForms() {
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
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
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageHandling();
    initializeForms();
});
