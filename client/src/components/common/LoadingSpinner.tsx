import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-3.5 h-3.5 border-[1.5px]',
    md: 'w-5 h-5 border-2',
    lg: 'w-7 h-7 border-2',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} border-gray-300 border-t-gray-700 rounded-full`}
        style={{ animation: 'spin 0.6s linear infinite' }}
      />
    </div>
  );
};

export default LoadingSpinner;
