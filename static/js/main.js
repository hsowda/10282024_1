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
        return;
    }

    welcomeSection.classList.toggle('hidden', section === 'signup');
    signupSection.classList.toggle('hidden', section !== 'signup');
}

// Modal handling
function createModal(title, iframeSrc) {
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
    closeButton.onclick = () => {
        modal.remove();
    };

    window.onclick = (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    };
}

// Initialize watch now buttons
function initializeWatchNowButtons() {
    const watchButtons = document.querySelectorAll('.watch-now-button');
    watchButtons.forEach(button => {
        button.addEventListener('click', () => {
            const title = button.getAttribute('data-title') || 'Watch Now';
            const iframeSrc = button.getAttribute('data-src') || 'https://beautifuldisaster-311.w3spaces.com';
            createModal(title, iframeSrc);
        });
    });
}

// Initialize language selector
function initializeLanguageSelector() {
    const languageSelect = document.getElementById('language');
    if (!languageSelect) {
        return; // Silently return if language selector doesn't exist on this page
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
    
    // Initialize all components
    initializeLanguageSelector();
    initializeSignupForm();
    initializeLoginForm();
    initializeWatchNowButtons();
});
