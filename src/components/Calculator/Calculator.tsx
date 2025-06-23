import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, History } from 'lucide-react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isScientific, setIsScientific] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDot = () => {
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
      
      // Add to history
      setHistory(prev => [`${currentValue} ${operation} ${inputValue} = ${newValue}`, ...prev.slice(0, 9)]);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleScientificFunction = (func: string) => {
    const value = parseFloat(display);
    let result = 0;

    switch (func) {
      case 'sin':
        result = Math.sin(value * Math.PI / 180);
        break;
      case 'cos':
        result = Math.cos(value * Math.PI / 180);
        break;
      case 'tan':
        result = Math.tan(value * Math.PI / 180);
        break;
      case 'log':
        result = Math.log10(value);
        break;
      case 'ln':
        result = Math.log(value);
        break;
      case 'sqrt':
        result = Math.sqrt(value);
        break;
      case 'x²':
        result = value * value;
        break;
      case '1/x':
        result = 1 / value;
        break;
      case 'π':
        result = Math.PI;
        break;
      case 'e':
        result = Math.E;
        break;
    }

    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  const scientificButtons = [
    ['sin', 'cos', 'tan', 'π'],
    ['log', 'ln', 'sqrt', 'e'],
    ['x²', '1/x', '(', ')']
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setIsScientific(false)}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              !isScientific
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Standard
          </button>
          <button
            onClick={() => setIsScientific(true)}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              isScientific
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Scientific
          </button>
        </div>

        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-3 bg-gray-200 hover:bg-gray-300 rounded-xl transition-colors flex items-center space-x-2"
        >
          <History className="w-5 h-5" />
          <span>History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator */}
        <div className={`${isScientific ? 'lg:col-span-2' : 'lg:col-span-2'} bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50`}>
          {/* Display */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">
                {previousValue !== null && operation && `${previousValue} ${operation}`}
              </div>
              <div className="text-4xl font-mono font-bold text-gray-900 truncate">
                {display}
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            {/* Scientific Functions */}
            {isScientific && (
              <div className="flex-1">
                <div className="grid grid-cols-4 gap-2">
                  {scientificButtons.flat().map((btn) => (
                    <motion.button
                      key={btn}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleScientificFunction(btn)}
                      className="h-12 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg font-medium transition-colors text-sm"
                    >
                      {btn}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Main Calculator */}
            <div className="flex-1">
              <div className="grid grid-cols-4 gap-3">
                {buttons.flat().map((btn, index) => {
                  const isOperator = ['÷', '×', '-', '+', '='].includes(btn);
                  const isSpecial = ['C', '±', '%'].includes(btn);
                  const isZero = btn === '0';

                  return (
                    <motion.button
                      key={`${btn}-${index}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (btn === 'C') clear();
                        else if (btn === '=') performOperation('=');
                        else if (isOperator) performOperation(btn);
                        else if (btn === '.') inputDot();
                        else if (btn === '±') setDisplay(String(-parseFloat(display)));
                        else if (btn === '%') setDisplay(String(parseFloat(display) / 100));
                        else inputNumber(btn);
                      }}
                      className={`h-16 rounded-xl font-semibold text-lg transition-all ${
                        isOperator
                          ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:shadow-lg'
                          : isSpecial
                          ? 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      } ${isZero ? 'col-span-2' : ''}`}
                    >
                      {btn}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* History */}
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-gray-200/50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">History</h3>
              <button
                onClick={() => setHistory([])}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {history.length > 0 ? (
                history.map((calc, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg text-sm font-mono cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      const result = calc.split(' = ')[1];
                      setDisplay(result);
                    }}
                  >
                    {calc}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No calculations yet</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};