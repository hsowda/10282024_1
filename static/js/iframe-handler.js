// Style configuration received from parent
let buttonStyles = {
    buttonColor: '#3b82f6',
    buttonHoverColor: '#2563eb',
    buttonClass: 'watch-now-button'
};

// Apply styles to Watch Now buttons
function applyButtonStyles() {
    try {
        const style = document.createElement('style');
        style.textContent = `
            .${buttonStyles.buttonClass} {
                background-color: ${buttonStyles.buttonColor};
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                cursor: pointer;
                border: none;
                font-size: 1rem;
                margin: 0.5rem;
                transition: background-color 0.2s;
            }

            .${buttonStyles.buttonClass}:hover {
                background-color: ${buttonStyles.buttonHoverColor};
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('Error applying button styles:', error);
    }
}

// Initialize Watch Now buttons in iframe
function initializeIframeButtons() {
    try {
        const watchButtons = document.querySelectorAll('.watch-now-button');
        if (!watchButtons.length) return;

        watchButtons.forEach(button => {
            button.addEventListener('click', () => {
                const title = button.getAttribute('data-title') || 'Watch Now';
                const url = button.getAttribute('data-src');
                
                if (url) {
                    // Send message to parent window
                    window.parent.postMessage({
                        type: 'OPEN_MODAL',
                        title: title,
                        url: url
                    }, '*');
                }
            });
        });
    } catch (error) {
        console.error('Error initializing iframe buttons:', error);
    }
}

// Handle messages from parent window
window.addEventListener('message', (event) => {
    try {
        const data = event.data;
        if (data.type === 'STYLE_CONFIG') {
            buttonStyles = { ...buttonStyles, ...data.styles };
            applyButtonStyles();
            initializeIframeButtons();
        }
    } catch (error) {
        console.error('Error handling message from parent:', error);
    }
}, false);

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    try {
        applyButtonStyles();
        initializeIframeButtons();
    } catch (error) {
        console.error('Error in initial iframe setup:', error);
    }
});
