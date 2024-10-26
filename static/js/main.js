// Language handling
let currentLanguage = 'en';
let translations = {};

async function loadTranslations(lang) {
    try {
        const response = await fetch(`/get_translation/${lang}`);
        if (!response.ok) {
            return; // Silently return on error
        }
        translations = await response.json();
        updatePageTranslations();
    } catch (error) {
        // Silently handle network or parsing errors
        return;
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

// Section toggling
function toggleSections(section) {
    const welcomeSection = document.getElementById('welcome-section');
    const signupSection = document.getElementById('signup-section');
    
    if (!welcomeSection || !signupSection) {
        return; // Silently return if sections don't exist
    }

    welcomeSection.classList.toggle('hidden', section === 'signup');
    signupSection.classList.toggle('hidden', section !== 'signup');
}

// Modal handling
function createModal(title, iframeSrc) {
    try {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <iframe 
                        src="${iframeSrc}"
                        width="600"
                        height="400"
                        frameborder="0"
                        allowfullscreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        style="border: none; width: 100%; height: 400px;">
                    </iframe>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeButton = modal.querySelector('.modal-close');
        closeButton?.addEventListener('click', () => modal.remove());

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        };
    } catch (error) {
        // Silently handle modal creation errors
        return;
    }
}

// Initialize watch now buttons
function initializeWatchNowButtons() {
    const watchButtons = document.querySelectorAll('.watch-now-button[data-src]');
    watchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.getAttribute('data-title') || 'Watch Now';
            const iframeSrc = button.getAttribute('data-src');
            if (iframeSrc) {
                createModal(title, iframeSrc);
            }
        });
    });
}

// Language selector initialization with improved handling
function initializeLanguageSelector() {
    try {
        // Get stored language preference or default to 'en'
        currentLanguage = localStorage.getItem('preferred_language') || 'en';
        
        // Load translations immediately for the current language
        loadTranslations(currentLanguage);
        
        // Initialize language selector only if it exists
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
        // Ensure translations are loaded even if selector initialization fails
        loadTranslations(currentLanguage);
    }
}

// Initialize signup form
function initializeSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;
    
    signupForm.addEventListener('submit', function(e) {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (!passwordInput || !confirmPasswordInput) {
            e.preventDefault();
            return;
        }
        
        if (!passwordInput.value || !confirmPasswordInput.value) {
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
            return;
        }
    });
}

// Initialize login form
function initializeLoginForm() {
    const loginForm = document.querySelector('form[action*="login"]');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', function(e) {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        if (!emailInput?.value || !passwordInput?.value) {
            e.preventDefault();
            alert('Please fill in all fields!');
            return;
        }
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize core functionality first
        initializeLanguageSelector();
        
        // Initialize optional components
        initializeSignupForm();
        initializeLoginForm();
        initializeWatchNowButtons();
    } catch (error) {
        // Ensure basic translation functionality works even if other initializations fail
        loadTranslations(currentLanguage);
    }
});
