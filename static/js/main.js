// Language handling
let currentLanguage = 'en';
let translations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/get_translation/${lang}`);
        if (!response.ok) {
            console.warn(`Failed to load translations for ${lang}`);
            return;
        }
        translations = await response.json();
        updatePageTranslations();
    } catch (error) {
        console.warn(`Error loading translations: ${error.message}`);
    }
}

function updatePageTranslations() {
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[key]) {
            if (element.tagName.toLowerCase() === 'input' && element.type === 'submit') {
                element.value = translations[key];
            } else {
                element.textContent = translations[key];
            }
        }
    });
}

// Initialize language handling
function initializeLanguageHandling() {
    try {
        // Get stored language preference from localStorage or default to 'en'
        currentLanguage = localStorage.getItem('preferred_language') || 'en';
        
        // Load translations for the current language
        loadTranslations(currentLanguage);
        
        // Try to initialize language selector if present
        const languageSelect = document.getElementById('language');
        if (languageSelect) {
            languageSelect.value = currentLanguage;
            languageSelect.addEventListener('change', (e) => {
                currentLanguage = e.target.value;
                localStorage.setItem('preferred_language', currentLanguage);
                loadTranslations(currentLanguage);
            });
        }
    } catch (error) {
        console.warn('Language selector initialization error:', error.message);
    }
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize language handling first
        initializeLanguageHandling();
        
        // Initialize form handling
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                const emailInput = document.getElementById('login-email');
                const passwordInput = document.getElementById('login-password');
                
                if (!emailInput?.value || !passwordInput?.value) {
                    e.preventDefault();
                    alert('Please fill in all fields!');
                }
            });
        }
        
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                const passwordInput = document.getElementById('register-password');
                const confirmPasswordInput = document.getElementById('register-confirm-password');
                
                if (!passwordInput?.value || !confirmPasswordInput?.value) {
                    e.preventDefault();
                    alert('Please fill in all password fields!');
                    return;
                }
                
                if (passwordInput.value !== confirmPasswordInput.value) {
                    e.preventDefault();
                    alert('Passwords do not match!');
                    return;
                }
                
                if (passwordInput.value.length < 8) {
                    e.preventDefault();
                    alert('Password must be at least 8 characters long!');
                }
            });
        }
    } catch (error) {
        console.warn('Initialization error:', error.message);
    }
});

// Auth mode toggling
function toggleAuthMode(event) {
    event.preventDefault();
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTitle = document.querySelector('.auth-title');
    const authSubtitle = document.querySelector('.auth-subtitle');

    if (!loginForm || !registerForm || !authTitle || !authSubtitle) {
        console.warn('Required elements not found');
        return;
    }

    if (loginForm.style.display !== 'none') {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.setAttribute('data-translate', 'create_account_title');
        authTitle.textContent = translations['create_account_title'] || 'Create an account';
        authSubtitle.innerHTML = `
            <span data-translate="already_have_account">Already have an account?</span>
            <a href="#" onclick="toggleAuthMode(event)" data-translate="signin_link">Sign in</a>
        `;
    } else {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.setAttribute('data-translate', 'signin_title');
        authTitle.textContent = translations['signin_title'] || 'Sign in to your account';
        authSubtitle.innerHTML = `
            <span data-translate="new_to_adbay">New to Adbay?</span>
            <a href="#" onclick="toggleAuthMode(event)" data-translate="create_account">Create account</a>
        `;
    }
    updatePageTranslations();
}

// Auth continuation
function continueAuth() {
    const emailInput = document.getElementById('login-email');
    const passwordGroup = document.getElementById('login-password-group');
    const continueBtn = document.getElementById('continue-btn');
    const signinBtn = document.getElementById('signin-btn');
    
    if (!emailInput || !passwordGroup || !continueBtn || !signinBtn) {
        console.warn('Required elements not found');
        return;
    }
    
    if (emailInput.value) {
        passwordGroup.style.display = 'block';
        continueBtn.style.display = 'none';
        signinBtn.style.display = 'block';
        document.getElementById('login-password')?.focus();
    }
}
