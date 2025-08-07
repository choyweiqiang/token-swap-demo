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
    lg: 'p-2.5',
  };

  // Icon size
  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  // Arrow paths
  const horizontalArrow = 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4';
  const verticalArrow = 'M16 4v12l-4-4m4 4l4-4M8 20V8l4 4m-4-4l-4 4';

  return (
    <button
      onClick={handleClick}
      className={`
        rounded-full border border-gray-200 
        hover:bg-gray-50 
        transition-all duration-200
        shadow-sm hover:shadow-md
        ${sizeClasses[size]} 
        ${className}
      `}
      aria-label="Swap tokens"
    >
      {/* Horizontal arrow (desktop) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`
          ${iconSize[size]} text-gray-600 
          transition-transform duration-300
          hidden md:block
          ${isRotated ? 'rotate-180' : ''}
        `}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={horizontalArrow} />
      </svg>

      {/* Vertical arrow (mobile) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`
          ${iconSize[size]} text-gray-600 
          transition-transform duration-300
          block md:hidden
          ${isRotated ? 'rotate-180' : ''}
        `}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={verticalArrow} />
      </svg>
    </button>
  );
}
