/**
 * Logic Gates Explorer - Gate Logic Functions
 * Contains the core logic for all gate types
 */

/**
 * Logic Gate Functions
 * All functions accept boolean inputs (0 or 1) and return boolean outputs
 */

// AND Gate: Returns 1 only if ALL inputs are 1
function AND(a, b) {
    return (a === 1 && b === 1) ? 1 : 0;
}

// OR Gate: Returns 1 if AT LEAST ONE input is 1
function OR(a, b) {
    return (a === 1 || b === 1) ? 1 : 0;
}

// NOT Gate: Returns the opposite of the input
function NOT(a) {
    return a === 1 ? 0 : 1;
}

// NAND Gate: Returns the opposite of AND (NOT AND)
function NAND(a, b) {
    return NOT(AND(a, b));
}

// NOR Gate: Returns the opposite of OR (NOT OR)
function NOR(a, b) {
    return NOT(OR(a, b));
}

// XOR Gate: Returns 1 only if inputs are DIFFERENT
function XOR(a, b) {
    return (a !== b) ? 1 : 0;
}

// XNOR Gate: Returns 1 only if inputs are the SAME (opposite of XOR)
function XNOR(a, b) {
    return (a === b) ? 1 : 0;
}

/**
 * Gate Evaluator
 * Evaluates any gate type based on the gate name and inputs
 * @param {string} gateType - The type of gate (and, or, not, nand, nor, xor, xnor)
 * @param {number} inputA - First input (0 or 1)
 * @param {number} inputB - Second input (0 or 1) - optional for NOT gate
 * @returns {number} - Output (0 or 1)
 */
function evaluateGate(gateType, inputA, inputB = 0) {
    switch(gateType.toLowerCase()) {
        case 'and':
            return AND(inputA, inputB);
        case 'or':
            return OR(inputA, inputB);
        case 'not':
            return NOT(inputA);
        case 'nand':
            return NAND(inputA, inputB);
        case 'nor':
            return NOR(inputA, inputB);
        case 'xor':
            return XOR(inputA, inputB);
        case 'xnor':
            return XNOR(inputA, inputB);
        default:
            console.error(`Unknown gate type: ${gateType}`);
            return 0;
    }
}

/**
 * Generate Truth Table
 * Creates a truth table for a specific gate type
 * @param {string} gateType - The type of gate
 * @returns {Array} - Array of truth table rows
 */
function generateTruthTable(gateType) {
    const isNotGate = gateType.toLowerCase() === 'not';
    
    if (isNotGate) {
        // NOT gate has only one input
        return [
            { a: 0, output: NOT(0) },
            { a: 1, output: NOT(1) }
        ];
    } else {
        // Two-input gates
        return [
            { a: 0, b: 0, output: evaluateGate(gateType, 0, 0) },
            { a: 0, b: 1, output: evaluateGate(gateType, 0, 1) },
            { a: 1, b: 0, output: evaluateGate(gateType, 1, 0) },
            { a: 1, b: 1, output: evaluateGate(gateType, 1, 1) }
        ];
    }
}

/**
 * Get Gate Color
 * Returns the primary color for each gate type
 * @param {string} gateType - The type of gate
 * @returns {string} - Hex color code
 */
function getGateColor(gateType) {
    const colors = {
        'and': '#BD10E0',
        'or': '#F5A623',
        'not': '#E94B3C',
        'nand': '#FF6B9D',
        'nor': '#50E3C2',
        'xor': '#B8E986',
        'xnor': '#9B59B6'
    };
    
    return colors[gateType.toLowerCase()] || '#4A90E2';
}

/**
 * Get Gate Description
 * Returns a simple description of what the gate does
 * @param {string} gateType - The type of gate
 * @returns {string} - Description
 */
function getGateDescription(gateType) {
    const descriptions = {
        'and': 'Outputs 1 only when ALL inputs are 1',
        'or': 'Outputs 1 when AT LEAST ONE input is 1',
        'not': 'Outputs the OPPOSITE of the input',
        'nand': 'Outputs 0 only when ALL inputs are 1 (opposite of AND)',
        'nor': 'Outputs 1 only when ALL inputs are 0 (opposite of OR)',
        'xor': 'Outputs 1 only when inputs are DIFFERENT',
        'xnor': 'Outputs 1 only when inputs are the SAME (opposite of XOR)'
    };
    
    return descriptions[gateType.toLowerCase()] || 'Unknown gate';
}

/**
 * Validate Input
 * Ensures input is either 0 or 1
 * @param {any} value - Value to validate
 * @returns {number} - 0 or 1
 */
function validateInput(value) {
    return (value === 1 || value === '1' || value === true) ? 1 : 0;
}

// Export functions for use in other modules (if using ES6 modules)
// Uncomment if using ES6 modules:
/*
export {
    AND,
    OR,
    NOT,
    NAND,
    NOR,
    XOR,
    evaluateGate,
    generateTruthTable,
    getGateColor,
    getGateDescription,
    validateInput
};
*/
