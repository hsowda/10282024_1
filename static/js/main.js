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

        // Send style information to the iframe once it's loaded
        const iframe = modal.querySelector('iframe');
        if (iframe) {
            iframe.onload = () => {
                try {
                    iframe.contentWindow.postMessage({
                        type: 'STYLE_CONFIG',
                        styles: {
                            buttonColor: '#3b82f6',
                            buttonHoverColor: '#2563eb',
                            buttonClass: 'watch-now-button'
                        }
                    }, '*');
                } catch (error) {
                    console.error('Error sending styles to iframe:', error);
                }
            };
        }
    } catch (error) {
        console.error('Error creating modal:', error);
    }
}

// Initialize watch now buttons
function initializeWatchNowButtons() {
    try {
        const watchButtons = document.querySelectorAll('.watch-now-button');
        if (watchButtons.length === 0) return;

        watchButtons.forEach(button => {
            button.addEventListener('click', () => {
                const title = button.getAttribute('data-title') || 'Watch Now';
                const iframeSrc = button.getAttribute('data-src') || '';
                if (iframeSrc) {
                    createModal(title, iframeSrc);
                }
            });
        });
    } catch (error) {
        console.error('Error initializing watch buttons:', error);
    }
}

// Handle messages from iframes
function handleIframeMessages() {
    try {
        window.addEventListener('message', (event) => {
            // Verify the origin of the message
            const allowedOrigins = [
                'https://beautifuldisaster-311.w3spaces.com',
                'https://afflicted.w3spaces.com'
            ];
            
            if (!allowedOrigins.includes(event.origin)) {
                console.warn('Received message from unauthorized origin:', event.origin);
                return;
            }

            const data = event.data;
            if (data.type === 'OPEN_MODAL') {
                createModal(data.title || 'Watch Now', data.url);
            }
        }, false);
    } catch (error) {
        console.error('Error setting up iframe message handler:', error);
    }
}

// Initialize language selector
function initializeLanguageSelector() {
    try {
        const languageSelect = document.getElementById('language');
        if (!languageSelect) return;
        
        // Initial translation load
        loadTranslations(currentLanguage);
        
        // Add change event listener
        languageSelect.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            loadTranslations(currentLanguage);
        });
    } catch (error) {
        console.error('Error initializing language selector:', error);
    }
}

// Initialize signup form
function initializeSignupForm() {
    try {
        const signupForm = document.getElementById('signup-form');
        if (!signupForm) return;
        
        signupForm.addEventListener('submit', function(e) {
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
    } catch (error) {
        console.error('Error initializing signup form:', error);
    }
}

// Initialize login form
function initializeLoginForm() {
    try {
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
    } catch (error) {
        console.error('Error initializing login form:', error);
    }
}

// Main initialization - using a flag to prevent multiple initializations
let initialized = false;
document.addEventListener('DOMContentLoaded', function() {
    if (initialized) return;
    initialized = true;
    
    // Initialize all components
    initializeLanguageSelector();
    initializeSignupForm();
    initializeLoginForm();
    initializeWatchNowButtons();
    handleIframeMessages(); // Initialize iframe message handler
});
