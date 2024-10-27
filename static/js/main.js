// Language handling
let currentLanguage = 'en';
let translations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/get_translation/${lang}`);
        if (!response.ok) {
            throw new Error('Failed to load translations');
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
            if (element.tagName.toLowerCase() === 'input' && element.getAttribute('type') === 'submit') {
                element.value = translations[key];
            } else {
                element.textContent = translations[key];
            }
        }
    });
}

function initializeLanguageHandling() {
    const languageSelect = document.getElementById('language');
    if (!languageSelect) {
        return; // Exit if language selector isn't present
    }
    
    currentLanguage = localStorage.getItem('preferred_language') || 'en';
    loadTranslations(currentLanguage);
    
    languageSelect.value = currentLanguage;
    languageSelect.addEventListener('change', (e) => {
        currentLanguage = e.target.value;
        localStorage.setItem('preferred_language', currentLanguage);
        loadTranslations(currentLanguage);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguageHandling();
});
