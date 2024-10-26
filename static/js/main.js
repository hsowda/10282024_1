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
        // Silently handle all errors to avoid console noise
        return;
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
        if (closeButton) {
            closeButton.onclick = () => modal.remove();
        }

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.remove();
            }
        };
    } catch (error) {
        // Silently handle modal errors
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
                if (title === 'Trending') {
                    window.location.href = iframeSrc;
                } else {
                    createModal(title, iframeSrc);
                }
            }
        });
    });
}

// Initialize language selector with improved silent handling
function initializeLanguageSelector() {
    // Get stored language preference from localStorage
    currentLanguage = localStorage.getItem('preferred_language') || 'en';
    
    // Always load translations for the current language
    loadTranslations(currentLanguage);
    
    // Try to initialize language selector only if it exists
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            localStorage.setItem('preferred_language', currentLanguage);
            loadTranslations(currentLanguage);
        });
    }
}

// Initialize signup form
function initializeSignupForm() {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return; // Silently return if form doesn't exist
    
    signupForm.addEventListener('submit', function(e) {
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (!passwordInput || !confirmPasswordInput) {
            e.preventDefault();
            alert('Password fields not found!');
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
    if (!loginForm) return; // Silently return if form doesn't exist
    
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
        initializeLanguageSelector();
        initializeSignupForm();
        initializeLoginForm();
        initializeWatchNowButtons();
    } catch (error) {
        // Silently handle initialization errors
        return;
    }
});
