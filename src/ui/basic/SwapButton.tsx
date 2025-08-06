import { useState } from 'react';

interface SwapButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SwapButton({ onClick, size = 'md', className = '' }: SwapButtonProps) {
  const [isRotated, setIsRotated] = useState(false);

  const handleClick = () => {
    setIsRotated(!isRotated);
    onClick();
  };

  // Size classes
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  // Icon size
  const iconSize = {
    sm: 'h-5 w-5',
    md: 'h-6 w-6',
    lg: 'h-7 w-7',
  };

  // Arrow paths
  const horizontalArrow = 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4';
  const verticalArrow = 'M16 4v12l-4-4m4 4l4-4M8 20V8l4 4m-4-4l-4 4';

  return (
    <button
      onClick={handleClick}
      className={`rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 ${sizeClasses[size]} ${className}`}
      aria-label="Swap tokens"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize[size]} text-gray-600 transition-transform duration-300 hidden md:block ${
          isRotated ? 'rotate-180' : ''
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={horizontalArrow} />
      </svg>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSize[size]} text-gray-600 transition-transform duration-300 md:hidden ${
          isRotated ? 'rotate-180' : ''
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={verticalArrow} />
      </svg>
    </button>
  );
}
