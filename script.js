
        const display = document.getElementById('result');
        const history = document.getElementById('history');
        const buttons = document.querySelectorAll('.buttons button');
        const modeToggle = document.getElementById('toggleMode');

        let currentInput = '';
        let operator = null;
        let firstOperand = null;
        let historyLog = '';
        let isDegreeMode = true;

        // Toggle between degrees and radians
        modeToggle.addEventListener('click', () => {
            isDegreeMode = !isDegreeMode;
            modeToggle.textContent = isDegreeMode ? 'Degrees' : 'Radians';
        });

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.getAttribute('data-value');
                handleInput(value);
            });
        });

        function handleInput(value) {
            if (value === 'C') {
                clearAll();
            } else if (value === 'DEL') {
                deleteLastChar();
            } else if (value === '=') {
                calculateResult();
            } else if (['+', '-', '*', '/', '^'].includes(value)) {
                handleOperator(value);
            } else if (['sqrt', 'sin', 'cos', 'tan'].includes(value)) {
                handleScientific(value);
            } else {
                appendInput(value);
            }
            updateDisplay();
        }

        function clearAll() {
            currentInput = '';
            operator = null;
            firstOperand = null;
            historyLog = '';
            history.innerHTML = '';
        }

        function deleteLastChar() {
            currentInput = currentInput.slice(0, -1);
        }

        function appendInput(value) {
            currentInput += value;
        }

        function handleOperator(op) {
            if (currentInput === '' && firstOperand !== null) {
                operator = op; // Allow changing the operator
                return;
            }
            if (currentInput !== '') {
                if (firstOperand === null) {
                    firstOperand = parseFloat(currentInput);
                } else if (operator) {
                    firstOperand = calculate(firstOperand, parseFloat(currentInput), operator);
                }
                operator = op;
                currentInput = '';
            }
        }

        function calculateResult() {
            if (operator && firstOperand !== null && currentInput !== '') {
                const secondOperand = parseFloat(currentInput);
                const result = calculate(firstOperand, secondOperand, operator);
                logHistory(`${firstOperand} ${operator} ${secondOperand}`, result);
                currentInput = result.toString();
                operator = null;
                firstOperand = null;
            }
        }

        function handleScientific(func) {
            if (currentInput === '') return;
            const num = parseFloat(currentInput);
            let angle = isDegreeMode ? num * Math.PI / 180 : num;
            let result;

            switch (func) {
                case 'sqrt':
                    if (num < 0) {
                        result = 'Error: √(Negative)';
                        break;
                    }
                    result = roundResult(Math.sqrt(num));
                    break;
                case 'sin':
                    result = roundResult(Math.sin(angle));
                    break;
                case 'cos':
                    result = roundResult(Math.cos(angle));
                    break;
                case 'tan':
                    if (isDegreeMode && (num % 180 === 90 || num % 180 === -90)) {
                        result = 'Undefined';
                    } else if (!isDegreeMode && (angle % (Math.PI / 2) === 0 && angle % Math.PI !== 0)) {
                        result = 'Undefined';
                    } else {
                        result = roundResult(Math.tan(angle));
                    }
                    break;
                default:
                    result = num;
            }

            logHistory(`${func}(${num}${isDegreeMode ? '°' : ''})`, result);
            currentInput = result.toString();
            operator = null;
            firstOperand = null;
        }

        function calculate(a, b, op) {
            let result;
            switch (op) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = b !== 0 ? a / b : 'Error: Div/0'; break;
                case '^': result = Math.pow(a, b); break;
                default: result = b;
            }
            return typeof result === 'number' ? roundResult(result) : result;
        }

        function roundResult(value) {
            return Math.round(value * 1e10) / 1e10; // Round to 10 decimal places
        }

        function logHistory(operation, result) {
            const entry = document.createElement('div');
            entry.textContent = `${operation} = ${result}`;
            if (result.toString().includes('Error') || result === 'Undefined') {
                entry.classList.add('error');
            }
            history.appendChild(entry);
            history.scrollTop = history.scrollHeight;
        }

        function updateDisplay() {
            display.value = currentInput || '0';
        }
