/**
 * Logic Gates Explorer - Main Application
 * Coordinates all modules and initializes the application
 */

// Application state
const appState = {
    initialized: false,
    activeSection: null,
    userProgress: {
        gatesExplored: [],
        demosWatched: []
    }
};

/**
 * Initialize the application
 */
function initializeApp() {
    if (appState.initialized) return;
    
    console.log('🔌 Logic Gates Explorer - Initializing...');
    
    // Check if required functions are available
    if (typeof initializeAllSimulators === 'undefined') {
        console.error('❌ initializeAllSimulators function not found!');
        return;
    }
    
    if (typeof initializeCanvases === 'undefined') {
        console.error('❌ initializeCanvases function not found!');
        return;
    }
    
    // Initialize all simulators and canvases
    initializeAllSimulators();
    initializeCanvases();
    
    // Set up smooth scrolling for navigation
    setupSmoothScrolling();
    
    // Set up intersection observer for section tracking
    setupSectionObserver();
    
    // Load user progress from localStorage (if any)
    loadUserProgress();
    
    // Add welcome message
    showWelcomeMessage();
    
    appState.initialized = true;
    console.log('✅ Logic Gates Explorer - Ready!');
}

/**
 * Set up smooth scrolling for navigation links
 */
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Track section visit
                trackSectionVisit(targetId.replace('#', ''));
            }
        });
    });
}

/**
 * Set up intersection observer to track which section is in view
 */
function setupSectionObserver() {
    const sections = document.querySelectorAll('.gate-section');
    
    const observerOptions = {
        root: null,
        rootMargin: '-100px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                appState.activeSection = sectionId;
                highlightActiveNavLink(sectionId);
                
                // Track that user has explored this gate
                const gateType = sectionId.replace('-gate', '');
                if (gateType && !appState.userProgress.gatesExplored.includes(gateType)) {
                    appState.userProgress.gatesExplored.push(gateType);
                    saveUserProgress();
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

/**
 * Highlight active navigation link
 */
function highlightActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${sectionId}`) {
            link.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
        } else {
            link.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        }
    });
}

/**
 * Track section visit
 */
function trackSectionVisit(sectionId) {
    console.log(`📍 User visited: ${sectionId}`);
    
    // Could send analytics here if needed
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
    // Optional: Add a fun welcome animation or message
    console.log('👋 Welcome to Logic Gates Explorer!');
    console.log('💡 Tip: Click the toggle buttons to change inputs!');
}

/**
 * Load user progress from localStorage
 */
function loadUserProgress() {
    try {
        const saved = localStorage.getItem('logicGatesProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            appState.userProgress = {
                gatesExplored: progress.gatesExplored || [],
                demosWatched: progress.demosWatched || []
            };
            console.log(`📊 Loaded progress: ${appState.userProgress.gatesExplored.length} gates explored`);
        }
    } catch (error) {
        console.warn('Could not load user progress:', error);
    }
}

/**
 * Save user progress to localStorage
 */
function saveUserProgress() {
    try {
        localStorage.setItem('logicGatesProgress', JSON.stringify(appState.userProgress));
    } catch (error) {
        console.warn('Could not save user progress:', error);
    }
}

/**
 * Track demo completion
 */
function trackDemoCompletion(gateType) {
    if (!appState.userProgress.demosWatched.includes(gateType)) {
        appState.userProgress.demosWatched.push(gateType);
        saveUserProgress();
        console.log(`✅ Demo completed: ${gateType}`);
        
        // Show encouragement message
        if (appState.userProgress.demosWatched.length === 7) {
            showCompletionMessage();
        }
    }
}

/**
 * Show completion message when all gates are explored
 */
function showCompletionMessage() {
    console.log('🎉 Congratulations! You\'ve explored all logic gates!');
    
    // Optional: Could add a visual celebration here
    // For example, confetti animation or a congratulations modal
}

/**
 * Handle keyboard shortcuts
 */
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Press 'R' to reset current simulator
        if (e.key === 'r' || e.key === 'R') {
            const activeSimulator = document.querySelector('.simulator');
            if (activeSimulator) {
                const resetBtn = activeSimulator.querySelector('.reset-btn');
                if (resetBtn) resetBtn.click();
            }
        }
        
        // Press 'D' to toggle demo
        if (e.key === 'd' || e.key === 'D') {
            const activeSimulator = document.querySelector('.simulator');
            if (activeSimulator) {
                const demoBtn = activeSimulator.querySelector('.demo-btn');
                if (demoBtn) demoBtn.click();
            }
        }
        
        // Press number keys 1-7 to jump to gate sections
        const gateMap = {
            '1': 'and-gate',
            '2': 'or-gate',
            '3': 'not-gate',
            '4': 'nand-gate',
            '5': 'nor-gate',
            '6': 'xor-gate',
            '7': 'xnor-gate'
        };
        
        if (gateMap[e.key]) {
            const section = document.getElementById(gateMap[e.key]);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
    
    console.log('⌨️ Keyboard shortcuts enabled:');
    console.log('  • R - Reset simulator');
    console.log('  • D - Toggle demo');
    console.log('  • 1-7 - Jump to gate sections');
}

/**
 * Handle errors gracefully
 */
function setupErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
        // Display user-friendly error message instead of breaking
    });
}

/**
 * Check browser compatibility
 */
function checkBrowserCompatibility() {
    // Check for canvas support
    const canvas = document.createElement('canvas');
    if (!canvas.getContext) {
        console.warn('Canvas not supported. Some features may not work.');
        return false;
    }
    
    // Check for localStorage
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
    } catch (e) {
        console.warn('localStorage not available. Progress will not be saved.');
    }
    
    return true;
}

/**
 * Add accessibility improvements
 */
function enhanceAccessibility() {
    // Add ARIA labels to interactive elements
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach((btn, index) => {
        btn.setAttribute('aria-label', `Toggle input ${btn.getAttribute('data-input')?.toUpperCase()}`);
        btn.setAttribute('role', 'switch');
    });
    
    const demoButtons = document.querySelectorAll('.demo-btn');
    demoButtons.forEach(btn => {
        btn.setAttribute('aria-label', 'Play automatic demonstration');
    });
    
    const resetButtons = document.querySelectorAll('.reset-btn');
    resetButtons.forEach(btn => {
        btn.setAttribute('aria-label', 'Reset simulator to initial state');
    });
}

/**
 * Print debug information
 */
function printDebugInfo() {
    console.log('=== Logic Gates Explorer Debug Info ===');
    console.log('Gates explored:', appState.userProgress.gatesExplored);
    console.log('Demos watched:', appState.userProgress.demosWatched);
    console.log('Active section:', appState.activeSection);
    console.log('Browser:', navigator.userAgent);
    console.log('Screen size:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('======================================');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkBrowserCompatibility();
        initializeApp();
        setupKeyboardShortcuts();
        enhanceAccessibility();
        setupErrorHandling();
        
        // Debug mode (remove in production)
        if (window.location.search.includes('debug')) {
            printDebugInfo();
        }
    });
} else {
    checkBrowserCompatibility();
    initializeApp();
    setupKeyboardShortcuts();
    enhanceAccessibility();
    setupErrorHandling();
}

// Export for debugging/testing (optional)
window.logicGatesApp = {
    state: appState,
    printDebugInfo,
    trackDemoCompletion
};
