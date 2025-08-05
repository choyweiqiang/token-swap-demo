import { useState } from 'react';

export default function SwapButton({ onClick }: { onClick: () => void }) {
  const [hasRotated, setHasRotated] = useState(false);

  const handleClick = () => {
    setHasRotated(true);
    onClick();
    setTimeout(() => setHasRotated(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-300"
      aria-label="Swap tokens"
    >
      {/* Horizontal arrows (shown on md screens and up) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 text-gray-600 hidden md:block transition-transform duration-300 ${hasRotated ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
        />
      </svg>

      {/* Vertical arrows (shown on small screens) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 text-gray-600 md:hidden transition-transform duration-300 ${hasRotated ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 4v12l-4-4m4 4l4-4M8 20V8l4 4m-4-4l-4 4"
        />
      </svg>
    </button>
  );
}
