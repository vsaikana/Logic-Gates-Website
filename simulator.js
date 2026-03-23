/**
 * Logic Gates Explorer - Simulator Module
 * Handles interactive gate simulation and user input
 */

// Simulator state management
const simulatorStates = new Map();

/**
 * Initialize a gate simulator
 * @param {HTMLElement} simulatorElement - The simulator container element
 */
function initializeSimulator(simulatorElement) {
    const gateType = simulatorElement.getAttribute('data-gate');
    const isNotGate = gateType === 'not';
    
    // Initialize state
    const state = {
        gateType: gateType,
        inputA: 0,
        inputB: isNotGate ? 0 : 0,
        output: isNotGate ? 1 : 0,
        isPlaying: false,
        demoInterval: null,
        currentDemoStep: 0
    };
    
    simulatorStates.set(simulatorElement, state);
    
    // Get elements
    const toggleButtons = simulatorElement.querySelectorAll('.toggle-btn');
    const outputIndicator = simulatorElement.querySelector('.output-indicator');
    const demoBtn = simulatorElement.querySelector('.demo-btn');
    const resetBtn = simulatorElement.querySelector('.reset-btn');
    const truthTable = simulatorElement.closest('.gate-section').querySelector('.truth-table tbody');
    
    // Attach event listeners to toggle buttons
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const inputName = btn.getAttribute('data-input');
            toggleInput(simulatorElement, inputName, btn, outputIndicator, truthTable);
        });
    });
    
    // Attach event listener to demo button
    if (demoBtn) {
        demoBtn.addEventListener('click', () => {
            toggleDemo(simulatorElement, toggleButtons, outputIndicator, demoBtn, truthTable);
        });
    }
    
    // Attach event listener to reset button
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetSimulator(simulatorElement, toggleButtons, outputIndicator, truthTable);
        });
    }
    
    // Initialize output display
    updateOutput(simulatorElement, outputIndicator, truthTable);
}

/**
 * Toggle input state
 */
function toggleInput(simulatorElement, inputName, button, outputIndicator, truthTable) {
    const state = simulatorStates.get(simulatorElement);
    
    // Stop demo if playing
    if (state.isPlaying) {
        stopDemo(simulatorElement);
    }
    
    // Toggle the input
    if (inputName === 'a') {
        state.inputA = state.inputA === 0 ? 1 : 0;
        updateButton(button, state.inputA);
    } else if (inputName === 'b') {
        state.inputB = state.inputB === 0 ? 1 : 0;
        updateButton(button, state.inputB);
    }
    
    // Update output
    updateOutput(simulatorElement, outputIndicator, truthTable);
    
    // Animate signal flow
    animateSignalFlow(simulatorElement, state.inputA, state.inputB);
}

/**
 * Update button appearance
 */
function updateButton(button, value) {
    button.textContent = value;
    button.classList.remove('on', 'off');
    button.classList.add(value === 1 ? 'on' : 'off');
}

/**
 * Update output display
 */
function updateOutput(simulatorElement, outputIndicator, truthTable) {
    const state = simulatorStates.get(simulatorElement);
    
    // Calculate output
    state.output = evaluateGate(state.gateType, state.inputA, state.inputB);
    
    // Update output indicator
    outputIndicator.textContent = state.output;
    outputIndicator.classList.remove('on', 'off');
    outputIndicator.classList.add(state.output === 1 ? 'on' : 'off');
    
    // Update truth table highlighting
    updateTruthTableHighlight(truthTable, state);
}

/**
 * Update truth table row highlighting
 */
function updateTruthTableHighlight(truthTable, state) {
    if (!truthTable) return;
    
    const rows = truthTable.querySelectorAll('tr');
    const isNotGate = state.gateType === 'not';
    
    rows.forEach(row => {
        row.classList.remove('active');
        
        const combo = row.getAttribute('data-combo');
        
        if (isNotGate) {
            // NOT gate has single input
            if (combo === String(state.inputA)) {
                row.classList.add('active');
            }
        } else {
            // Two-input gates
            const expectedCombo = `${state.inputA}-${state.inputB}`;
            if (combo === expectedCombo) {
                row.classList.add('active');
            }
        }
    });
}

/**
 * Toggle demo mode
 */
function toggleDemo(simulatorElement, toggleButtons, outputIndicator, demoBtn, truthTable) {
    const state = simulatorStates.get(simulatorElement);
    
    if (state.isPlaying) {
        stopDemo(simulatorElement);
        demoBtn.textContent = '▶ Play Demo';
        demoBtn.classList.remove('playing');
    } else {
        startDemo(simulatorElement, toggleButtons, outputIndicator, demoBtn, truthTable);
        demoBtn.textContent = '⏸ Pause Demo';
        demoBtn.classList.add('playing');
    }
}

/**
 * Start demo animation
 */
function startDemo(simulatorElement, toggleButtons, outputIndicator, demoBtn, truthTable) {
    const state = simulatorStates.get(simulatorElement);
    const isNotGate = state.gateType === 'not';
    
    state.isPlaying = true;
    state.currentDemoStep = 0;
    
    // Demo sequences
    const notSequence = [0, 1];
    const twoInputSequence = [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1]
    ];
    
    const sequence = isNotGate ? notSequence : twoInputSequence;
    
    // Run demo
    state.demoInterval = setInterval(() => {
        if (state.currentDemoStep >= sequence.length) {
            state.currentDemoStep = 0;
        }
        
        if (isNotGate) {
            state.inputA = sequence[state.currentDemoStep];
            const buttonA = toggleButtons[0];
            updateButton(buttonA, state.inputA);
        } else {
            const [a, b] = sequence[state.currentDemoStep];
            state.inputA = a;
            state.inputB = b;
            
            const buttonA = Array.from(toggleButtons).find(btn => btn.getAttribute('data-input') === 'a');
            const buttonB = Array.from(toggleButtons).find(btn => btn.getAttribute('data-input') === 'b');
            
            updateButton(buttonA, state.inputA);
            updateButton(buttonB, state.inputB);
        }
        
        updateOutput(simulatorElement, outputIndicator, truthTable);
        animateSignalFlow(simulatorElement, state.inputA, state.inputB);
        
        state.currentDemoStep++;
    }, 2000); // Change every 2 seconds
}

/**
 * Stop demo animation
 */
function stopDemo(simulatorElement) {
    const state = simulatorStates.get(simulatorElement);
    
    if (state.demoInterval) {
        clearInterval(state.demoInterval);
        state.demoInterval = null;
    }
    
    state.isPlaying = false;
}

/**
 * Reset simulator to initial state
 */
function resetSimulator(simulatorElement, toggleButtons, outputIndicator, truthTable) {
    const state = simulatorStates.get(simulatorElement);
    const isNotGate = state.gateType === 'not';
    
    // Stop demo if playing
    if (state.isPlaying) {
        stopDemo(simulatorElement);
        const demoBtn = simulatorElement.querySelector('.demo-btn');
        if (demoBtn) {
            demoBtn.textContent = '▶ Play Demo';
            demoBtn.classList.remove('playing');
        }
    }
    
    // Reset inputs
    state.inputA = 0;
    state.inputB = 0;
    state.currentDemoStep = 0;
    
    // Update buttons
    toggleButtons.forEach(btn => {
        const inputName = btn.getAttribute('data-input');
        updateButton(btn, 0);
    });
    
    // Update output
    updateOutput(simulatorElement, outputIndicator, truthTable);
    
    // Clear canvas animation
    const canvas = simulatorElement.querySelector('canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGateVisualization(canvas, state.gateType, state.inputA, state.inputB, state.output);
    }
}

/**
 * Animate signal flow through the gate (canvas-based)
 */
function animateSignalFlow(simulatorElement, inputA, inputB) {
    const state = simulatorStates.get(simulatorElement);
    const canvas = simulatorElement.querySelector('canvas');
    
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const gateType = state.gateType;
    
    // Clear and redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGateVisualization(canvas, gateType, inputA, inputB, state.output);
}

/**
 * Initialize all simulators on the page
 */
function initializeAllSimulators() {
    const simulators = document.querySelectorAll('.simulator');
    console.log(`🎮 Initializing ${simulators.length} simulators...`);
    
    simulators.forEach(simulator => {
        initializeSimulator(simulator);
        
        // Initialize canvas visualization
        const canvas = simulator.querySelector('canvas');
        if (canvas) {
            const gateType = simulator.getAttribute('data-gate');
            drawGateVisualization(canvas, gateType, 0, 0, gateType === 'not' ? 1 : 0);
        }
    });
    
    console.log('✅ All simulators initialized!');
}

// Note: Initialization is now handled by main.js
