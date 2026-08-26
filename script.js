let display = document.getElementById('display');
let expression = '';

function appendNumber(num) {
    expression += num;
    updateDisplay();
}

function appendOperator(op) {
    // Prevent multiple operators in a row
    if (expression === '' && op !== '.') return;
    
    // Handle decimal point
    if (op === '.') {
        // Only add decimal if there isn't one already in the current number
        const lastOperator = Math.max(
            expression.lastIndexOf('+'),
            expression.lastIndexOf('-'),
            expression.lastIndexOf('*'),
            expression.lastIndexOf('/')
        );
        const currentNumber = expression.substring(lastOperator + 1);
        if (currentNumber.includes('.')) return;
    }
    
    // Prevent multiple operators in a row (except for decimal)
    const lastChar = expression.slice(-1);
    if (['+', '-', '*', '/', '.'].includes(lastChar) && op !== '.') {
        expression = expression.slice(0, -1) + op;
    } else {
        expression += op;
    }
    
    updateDisplay();
}

function clearDisplay() {
    expression = '';
    updateDisplay();
}

function deleteLast() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function calculate() {
    try {
        // Replace display operators with JavaScript operators
        let calculation = expression
            .replace(/×/g, '*')
            .replace(/−/g, '-');
        
        // Evaluate the expression
        let result = eval(calculation);
        
        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;
        
        expression = result.toString();
        updateDisplay();
    } catch (error) {
        display.value = 'Error';
        expression = '';
    }
}

function updateDisplay() {
    // Replace operators for display
    let displayText = expression
        .replace(/\*/g, '×')
        .replace(/-/g, '−');
    
    display.value = displayText || '0';
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        event.preventDefault();
        appendOperator(key === '*' ? '*' : key === '/' ? '/' : key);
    } else if (key === '.') {
        event.preventDefault();
        appendOperator('.');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    } else if (key === 'Escape') {
        event.preventDefault();
        clearDisplay();
    }
});

// Initialize display
updateDisplay();
