import React, { useState, useEffect, useCallback } from 'react';

const CalculatorDemo = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState(null);
  const [operator, setOperator] = useState(null);
  const [secondOperand, setSecondOperand] = useState(null);
  const [usedEquals, setUsedEquals] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const formatNumber = (num) => {
    let parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
  };

  const operate = (first, second, op) => {
    const num1 = parseFloat(first);
    const num2 = parseFloat(second);
    
    switch (op) {
      case 'add': return num1 + num2;
      case 'subtract': return num1 - num2;
      case 'multiply': return num1 * num2;
      case 'divide': 
        if (num2 === 0) return 'Error';
        return num1 / num2;
      default: return num2;
    }
  };

  const clearMemory = () => {
    setFirstOperand(null);
    setOperator(null);
    setSecondOperand(null);
    setUsedEquals(false);
  };

  const inputNumber = useCallback((num) => {
    if (operator === null) {
      if (firstOperand === null || usedEquals) {
        setFirstOperand(num);
        setDisplay(num);
        setUsedEquals(false);
      } else {
        const newValue = display === '0' ? num : display + num;
        setFirstOperand(newValue);
        setDisplay(newValue);
      }
    } else {
      if (secondOperand === null) {
        setSecondOperand(num);
        setDisplay(num);
      } else {
        const newValue = display === '0' ? num : display + num;
        setSecondOperand(newValue);
        setDisplay(newValue);
      }
    }
  }, [display, firstOperand, operator, secondOperand, usedEquals]);

  const inputOperator = useCallback((op) => {
    if (firstOperand !== null && secondOperand === null) {
      setOperator(op);
    } else if (firstOperand !== null && secondOperand !== null) {
      const result = operate(firstOperand, secondOperand, operator);
      if (result === 'Error') {
        setDisplay('Error');
        clearMemory();
        return;
      }
      setFirstOperand(result.toString());
      setDisplay(result.toString());
      setSecondOperand(null);
      setOperator(op === 'equals' ? null : op);
      setUsedEquals(op === 'equals');
    }
  }, [firstOperand, secondOperand, operator]);

  const inputFunction = useCallback((func) => {
    switch (func) {
      case 'clear':
        setDisplay('0');
        clearMemory();
        break;
      case 'plus-minus':
        const negated = (parseFloat(display) * -1).toString();
        setDisplay(negated);
        if (operator === null) {
          setFirstOperand(negated);
        } else {
          setSecondOperand(negated);
        }
        break;
      case 'percentage':
        const percentage = (parseFloat(display) / 100).toString();
        setDisplay(percentage);
        if (operator === null) {
          setFirstOperand(percentage);
        } else {
          setSecondOperand(percentage);
        }
        break;
      case 'dot':
        if (!display.includes('.')) {
          const newValue = display + '.';
          setDisplay(newValue);
          if (operator === null) {
            setFirstOperand(newValue);
          } else {
            setSecondOperand(newValue);
          }
        }
        break;
    }
  }, [display, operator]);

  const handleButtonClick = (input, type) => {
    if (type === 'number') {
      inputNumber(input);
    } else if (type === 'operator') {
      inputOperator(input);
    } else if (type === 'function') {
      inputFunction(input);
    }
  };

  const buttonClass = `
    h-12 w-12 rounded-lg font-bold text-sm transition-all duration-150
    active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400
    ${isDark 
      ? 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600' 
      : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300'
    }
  `;

  const operatorButtonClass = `
    h-12 w-12 rounded-lg font-bold text-sm transition-all duration-150
    active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400
    bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-500
  `;

  return (
    <div className={`
      p-4 rounded-lg border max-w-xs mx-auto
      ${isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-300'
      }
    `}>
      <div className="mb-4 flex justify-between items-center">
        <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Calculator
        </h3>
        <button
          onClick={() => setIsDark(!isDark)}
          className={`
            px-2 py-1 rounded text-xs font-bold transition-colors
            ${isDark 
              ? 'bg-yellow-600 hover:bg-yellow-500 text-white' 
              : 'bg-gray-800 hover:bg-gray-700 text-white'
            }
          `}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Display */}
      <div className={`
        p-4 mb-4 rounded-lg text-right text-xl font-mono
        ${isDark 
          ? 'bg-gray-900 text-green-400 border border-gray-700' 
          : 'bg-gray-100 text-gray-800 border border-gray-300'
        }
      `}>
        {formatNumber(display)}
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {/* Row 1 */}
        <button className={buttonClass} onClick={() => handleButtonClick('clear', 'function')}>C</button>
        <button className={buttonClass} onClick={() => handleButtonClick('plus-minus', 'function')}>±</button>
        <button className={buttonClass} onClick={() => handleButtonClick('percentage', 'function')}>%</button>
        <button className={operatorButtonClass} onClick={() => handleButtonClick('divide', 'operator')}>÷</button>

        {/* Row 2 */}
        <button className={buttonClass} onClick={() => handleButtonClick('7', 'number')}>7</button>
        <button className={buttonClass} onClick={() => handleButtonClick('8', 'number')}>8</button>
        <button className={buttonClass} onClick={() => handleButtonClick('9', 'number')}>9</button>
        <button className={operatorButtonClass} onClick={() => handleButtonClick('multiply', 'operator')}>×</button>

        {/* Row 3 */}
        <button className={buttonClass} onClick={() => handleButtonClick('4', 'number')}>4</button>
        <button className={buttonClass} onClick={() => handleButtonClick('5', 'number')}>5</button>
        <button className={buttonClass} onClick={() => handleButtonClick('6', 'number')}>6</button>
        <button className={operatorButtonClass} onClick={() => handleButtonClick('subtract', 'operator')}>−</button>

        {/* Row 4 */}
        <button className={buttonClass} onClick={() => handleButtonClick('1', 'number')}>1</button>
        <button className={buttonClass} onClick={() => handleButtonClick('2', 'number')}>2</button>
        <button className={buttonClass} onClick={() => handleButtonClick('3', 'number')}>3</button>
        <button className={operatorButtonClass} onClick={() => handleButtonClick('add', 'operator')}>+</button>

        {/* Row 5 */}
        <button className={`${buttonClass} col-span-2`} onClick={() => handleButtonClick('0', 'number')}>0</button>
        <button className={buttonClass} onClick={() => handleButtonClick('dot', 'function')}>.</button>
        <button className={operatorButtonClass} onClick={() => handleButtonClick('equals', 'operator')}>=</button>
      </div>
    </div>
  );
};

export default CalculatorDemo;