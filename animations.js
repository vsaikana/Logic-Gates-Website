/**
 * Logic Gates Explorer - Canvas Animations
 * Handles visual animations and gate drawing on canvas
 */

/**
 * Draw gate visualization on canvas
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {string} gateType - Type of gate to draw
 * @param {number} inputA - State of input A (0 or 1)
 * @param {number} inputB - State of input B (0 or 1)
 * @param {number} output - Output state (0 or 1)
 */
function drawGateVisualization(canvas, gateType, inputA, inputB, output) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Colors
    const activeColor = '#7ED321';
    const inactiveColor = '#9B9B9B';
    const gateColor = getGateColor(gateType);
    
    // Draw based on gate type
    const isNotGate = gateType === 'not';
    
    if (isNotGate) {
        drawNotGateVisualization(ctx, width, height, inputA, output, gateColor, activeColor, inactiveColor);
    } else {
        drawTwoInputGateVisualization(ctx, width, height, gateType, inputA, inputB, output, gateColor, activeColor, inactiveColor);
    }
}

/**
 * Draw NOT gate visualization
 */
function drawNotGateVisualization(ctx, width, height, inputA, output, gateColor, activeColor, inactiveColor) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Input wire
    const inputColor = inputA === 1 ? activeColor : inactiveColor;
    drawWire(ctx, 30, centerY, 100, centerY, inputColor, inputA === 1);
    
    // Input circle
    drawInputCircle(ctx, 30, centerY, inputA, activeColor, inactiveColor);
    
    // Gate shape (triangle with circle)
    ctx.beginPath();
    ctx.moveTo(100, centerY - 30);
    ctx.lineTo(100, centerY + 30);
    ctx.lineTo(170, centerY);
    ctx.closePath();
    ctx.fillStyle = gateColor;
    ctx.fill();
    ctx.strokeStyle = darkenColor(gateColor);
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // NOT bubble
    ctx.beginPath();
    ctx.arc(175, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = darkenColor(gateColor);
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Output wire
    const outputColor = output === 1 ? activeColor : inactiveColor;
    drawWire(ctx, 180, centerY, 260, centerY, outputColor, output === 1);
    
    // Output circle
    drawOutputCircle(ctx, 260, centerY, output, activeColor, inactiveColor);
    
    // Labels
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Nunito';
    ctx.fillText('A', 20, centerY - 10);
    ctx.fillText('OUT', 235, centerY - 10);
}

/**
 * Draw two-input gate visualization
 */
function drawTwoInputGateVisualization(ctx, width, height, gateType, inputA, inputB, output, gateColor, activeColor, inactiveColor) {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Input wires
    const inputAColor = inputA === 1 ? activeColor : inactiveColor;
    const inputBColor = inputB === 1 ? activeColor : inactiveColor;
    
    drawWire(ctx, 30, centerY - 30, 90, centerY - 20, inputAColor, inputA === 1);
    drawWire(ctx, 30, centerY + 30, 90, centerY + 20, inputBColor, inputB === 1);
    
    // Input circles
    drawInputCircle(ctx, 30, centerY - 30, inputA, activeColor, inactiveColor);
    drawInputCircle(ctx, 30, centerY + 30, inputB, activeColor, inactiveColor);
    
    // Draw gate shape
    drawGateShape(ctx, gateType, centerX, centerY, gateColor);
    
    // Output wire
    const outputColor = output === 1 ? activeColor : inactiveColor;
    const outputStartX = (gateType === 'nand' || gateType === 'nor' || gateType === 'xnor') ? 195 : 190;
    drawWire(ctx, outputStartX, centerY, 260, centerY, outputColor, output === 1);
    
    // Output circle
    drawOutputCircle(ctx, 260, centerY, output, activeColor, inactiveColor);
    
    // Labels
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Nunito';
    ctx.fillText('A', 20, centerY - 40);
    ctx.fillText('B', 20, centerY + 45);
    ctx.fillText('OUT', 235, centerY - 10);
}

/**
 * Draw gate shape based on type
 */
function drawGateShape(ctx, gateType, centerX, centerY, gateColor) {
    const darkColor = darkenColor(gateColor);
    
    ctx.fillStyle = gateColor;
    ctx.strokeStyle = darkColor;
    ctx.lineWidth = 2;
    
    switch(gateType) {
        case 'and':
        case 'nand':
            // D-shaped gate
            ctx.beginPath();
            ctx.moveTo(90, centerY - 40);
            ctx.lineTo(140, centerY - 40);
            ctx.arc(140, centerY, 40, -Math.PI/2, Math.PI/2);
            ctx.lineTo(90, centerY + 40);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            if (gateType === 'nand') {
                // Add NOT bubble
                ctx.beginPath();
                ctx.arc(185, centerY, 5, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = darkColor;
                ctx.stroke();
            }
            break;
            
        case 'or':
        case 'nor':
            // Curved OR shape
            ctx.beginPath();
            ctx.moveTo(90, centerY - 40);
            ctx.quadraticCurveTo(110, centerY - 40, 130, centerY - 30);
            ctx.quadraticCurveTo(160, centerY - 10, 180, centerY);
            ctx.quadraticCurveTo(160, centerY + 10, 130, centerY + 30);
            ctx.quadraticCurveTo(110, centerY + 40, 90, centerY + 40);
            ctx.quadraticCurveTo(100, centerY, 90, centerY - 40);
            ctx.fill();
            ctx.stroke();
            
            if (gateType === 'nor') {
                // Add NOT bubble
                ctx.beginPath();
                ctx.arc(185, centerY, 5, 0, Math.PI * 2);
                ctx.fillStyle = 'white';
                ctx.fill();
                ctx.strokeStyle = darkColor;
                ctx.stroke();
            }
            break;
            
        case 'xor':
            // XOR shape (OR with extra line)
            // Draw extra curved line first
            ctx.strokeStyle = darkColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(75, centerY - 40);
            ctx.quadraticCurveTo(85, centerY, 75, centerY + 40);
            ctx.stroke();
            
            // Draw OR shape
            ctx.fillStyle = gateColor;
            ctx.beginPath();
            ctx.moveTo(90, centerY - 40);
            ctx.quadraticCurveTo(110, centerY - 40, 130, centerY - 30);
            ctx.quadraticCurveTo(160, centerY - 10, 180, centerY);
            ctx.quadraticCurveTo(160, centerY + 10, 130, centerY + 30);
            ctx.quadraticCurveTo(110, centerY + 40, 90, centerY + 40);
            ctx.quadraticCurveTo(100, centerY, 90, centerY - 40);
            ctx.fill();
            ctx.stroke();
            break;
            
        case 'xnor':
            // XNOR shape (XOR with NOT bubble)
            // Draw extra curved line first
            ctx.strokeStyle = darkColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(75, centerY - 40);
            ctx.quadraticCurveTo(85, centerY, 75, centerY + 40);
            ctx.stroke();
            
            // Draw OR shape
            ctx.fillStyle = gateColor;
            ctx.beginPath();
            ctx.moveTo(90, centerY - 40);
            ctx.quadraticCurveTo(110, centerY - 40, 130, centerY - 30);
            ctx.quadraticCurveTo(160, centerY - 10, 180, centerY);
            ctx.quadraticCurveTo(160, centerY + 10, 130, centerY + 30);
            ctx.quadraticCurveTo(110, centerY + 40, 90, centerY + 40);
            ctx.quadraticCurveTo(100, centerY, 90, centerY - 40);
            ctx.fill();
            ctx.stroke();
            
            // Add NOT bubble
            ctx.beginPath();
            ctx.arc(185, centerY, 5, 0, Math.PI * 2);
            ctx.fillStyle = 'white';
            ctx.fill();
            ctx.strokeStyle = darkColor;
            ctx.stroke();
            break;
    }
}

/**
 * Draw a wire with optional glow effect
 */
function drawWire(ctx, x1, y1, x2, y2, color, isActive) {
    ctx.strokeStyle = color;
    ctx.lineWidth = isActive ? 4 : 3;
    
    // Add glow for active wires
    if (isActive) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = color;
    }
    
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

/**
 * Draw input circle indicator
 */
function drawInputCircle(ctx, x, y, value, activeColor, inactiveColor) {
    const color = value === 1 ? activeColor : inactiveColor;
    
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Add glow for active state
    if (value === 1) {
        ctx.shadowBlur = 8;
        ctx.shadowColor = activeColor;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

/**
 * Draw output circle indicator
 */
function drawOutputCircle(ctx, x, y, value, activeColor, inactiveColor) {
    const color = value === 1 ? activeColor : inactiveColor;
    
    ctx.beginPath();
    ctx.arc(x, y, 12, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add glow for active state
    if (value === 1) {
        ctx.shadowBlur = 15;
        ctx.shadowColor = activeColor;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

/**
 * Darken a color (for borders/shadows)
 */
function darkenColor(color) {
    // Simple darkening by reducing RGB values
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 30);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 30);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 30);
    
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Animate signal particles flowing through the gate
 * This creates moving dots that travel along the wires
 */
function animateSignalParticles(canvas, startX, startY, endX, endY, isActive) {
    if (!isActive) return;
    
    const ctx = canvas.getContext('2d');
    let progress = 0;
    const duration = 800; // milliseconds
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);
        
        // Calculate current position
        const currentX = startX + (endX - startX) * progress;
        const currentY = startY + (endY - startY) * progress;
        
        // Draw particle
        ctx.save();
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#7ED321';
        ctx.fillStyle = '#7ED321';
        ctx.beginPath();
        ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

/**
 * Resize canvas for high-DPI displays
 */
function setupHighDPICanvas(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
}

/**
 * Initialize all canvases
 */
function initializeCanvases() {
    const canvases = document.querySelectorAll('.gate-visual canvas');
    canvases.forEach(canvas => {
        // Set up for high DPI if needed (optional)
        // setupHighDPICanvas(canvas);
    });
}

// Note: Initialization is now handled by main.js
