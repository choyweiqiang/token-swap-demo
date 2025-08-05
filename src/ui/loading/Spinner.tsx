export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-[2px]',
    md: 'h-6 w-6 border-[3px]',
    lg: 'h-8 w-8 border-[4px]',
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <div
        className={`absolute rounded-full border-t-transparent border-r-transparent border-l-transparent 
        ${sizeClasses[size]} 
        border-b-blue-500 animate-spin-slow`}
        style={{
          animationDuration: '1.5s',
          borderStyle: 'solid',
        }}
      />

      <div
        className={`rounded-full border-t-transparent border-r-transparent border-l-transparent 
        ${sizeClasses[size]} 
        border-b-purple-500 animate-spin-reverse`}
        style={{
          animationDuration: '2s',
          borderStyle: 'solid',
          opacity: 0.7,
        }}
      />

      <div className="absolute">
        <svg
          width={size === 'lg' ? '16' : '12'}
          height={size === 'lg' ? '16' : '12'}
          viewBox="0 0 24 24"
          className="text-gray-400"
        >
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
          />
        </svg>
      </div>
    </div>
  );
}
