import React from 'react';
import { motion } from 'framer-motion';

const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
    <motion.div
      className="h-48 bg-gray-200 rounded-md"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.div
      className="h-4 bg-gray-200 rounded w-3/4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
    />
    <motion.div
      className="h-3 bg-gray-200 rounded w-1/2"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div
      className="h-3 bg-gray-200 rounded w-full"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
    />
  </div>
);

const SkeletonLoader: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
};

export default SkeletonLoader;