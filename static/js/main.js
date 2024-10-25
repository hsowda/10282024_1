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
        console.log('Translating element:', element, 'with key:', key);
        if (translations[key]) {
            if (element.tagName.toLowerCase() === 'a') {
                // For anchor tags, update text content
                element.textContent = translations[key];
            } else {
                element.textContent = translations[key];
            }
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
    
    if (section === 'signup') {
        welcomeSection.classList.add('hidden');
        signupSection.classList.remove('hidden');
    } else {
        welcomeSection.classList.remove('hidden');
        signupSection.classList.add('hidden');
    }
}

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    const signupForm = document.getElementById('signup-form');
    const languageSelect = document.getElementById('language');
    
    // Language change handler
    languageSelect.addEventListener('change', (e) => {
        console.log('Language changed to:', e.target.value);
        currentLanguage = e.target.value;
        loadTranslations(currentLanguage);
    });
    
    // Initial translation load
    console.log('Loading initial translations');
    loadTranslations(currentLanguage);
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
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
});
