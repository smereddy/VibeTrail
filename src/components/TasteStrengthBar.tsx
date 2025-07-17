import React from 'react';
import { motion } from 'framer-motion';

interface TasteStrengthBarProps {
  strength: number;
  className?: string;
}

const TasteStrengthBar: React.FC<TasteStrengthBarProps> = ({ strength, className = '' }) => {
  const percentage = Math.round(strength * 100);
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600">{percentage}%</span>
    </div>
  );
};

export default TasteStrengthBar;