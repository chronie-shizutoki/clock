// Define the function to create a clock
function createClock(language = 'en-US') {
    // Create a div element as the clock container
    const container = document.createElement('div');
    // Set the class name of the container to 'clock-container'
    container.className = 'clock-container';
    // Set the HTML content of the container, including elements for glow effect, particle effect, clock dial, time display, and date display
    container.innerHTML = `
        <div class="glow"></div>
        <div class="particles"></div>
            <div class="time-display" id="clockTime"></div>
            <div class="date-display" id="clockDate"></div>
    `;

    // Update the time display
    // Define the function to update the time display
    function updateTime() {
        // Get the current time
        const now = new Date();
        // Get the element with id 'clockTime' in the container
        const timeEl = container.querySelector('#clockTime');
        // Get the element with id 'clockDate' in the container
        const dateEl = container.querySelector('#clockDate');
        
        // Format time and date - Support internationalization
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        
        timeEl.textContent = new Intl.DateTimeFormat(language, timeOptions).format(now);
        dateEl.textContent = new Intl.DateTimeFormat(language, dateOptions).format(now);
    }

    // Call the function to update the time display
    updateTime();
    // Call the function to update the time display every second to achieve real-time time update
    setInterval(updateTime, 1000);
    // Return the created clock container
    return container;
}

// Initialize the clock when the DOM is loaded
// Listen for the DOM content loaded event
document.addEventListener('DOMContentLoaded', () => {
    // Create a div element as the outer container of the clock
    const clockContainer = document.createElement('div');
    // Set the text alignment of the outer container to center
    clockContainer.style.textAlign = 'center';
    // Add the created clock to the outer container
    let currentClockElement = null;

    // Function to update the clock language
    function updateClockLanguage(locale) {
        // Remove the old clock
        if (currentClockElement) {
            clockContainer.removeChild(currentClockElement);
        }
        // Create a new clock
        currentClockElement = createClock(locale);
        clockContainer.appendChild(currentClockElement);
    }

    // Wait for i18n initialization to complete before setting the clock language
    document.addEventListener('i18nInitialized', () => {
        // Check if i18n exists to avoid reference errors
        const userLanguage = typeof i18n !== 'undefined' ? (i18n.locale || navigator.language || 'en-US') : navigator.language || 'en-US';
        updateClockLanguage(userLanguage);
    });

    // Listen for the language change event
    document.addEventListener('i18nLanguageChanged', (e) => {
        updateClockLanguage(e.detail.locale);
    });

    // If i18n has been initialized during the initial load
    if (typeof i18n !== 'undefined' && i18n.locale) {
        updateClockLanguage(i18n.locale);
    }
    // Insert the outer container before the first child of the body element
    document.body.insertBefore(clockContainer, document.body.firstChild);
});