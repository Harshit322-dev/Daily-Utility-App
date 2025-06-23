import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  colors,
  selectedColor,
  onColorSelect,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {colors.map((color) => (
        <motion.button
          key={color}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onColorSelect(color)}
          className={`${sizeClasses[size]} rounded-full ${color} border-3 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl ${
            selectedColor === color 
              ? 'border-gray-900 dark:border-white scale-110 ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-gray-800' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          {selectedColor === color && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-white drop-shadow-lg"
            >
              <Check className={iconSizes[size]} strokeWidth={3} />
            </motion.div>
          )}
        </motion.button>
      ))}
    </div>
  );
};