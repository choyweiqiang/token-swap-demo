import type { ReactNode } from 'react';
import type { InputProps } from '../../types/form';

export default function Input({
  className = '',
  disabled = false,
  error = '',
  prefix,
  baseClasses = 'w-full h-10 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition text-gray-700 font-normal',
  disabledClasses = 'bg-gray-50 cursor-not-allowed opacity-80',
  ...props
}: Omit<InputProps, 'prefix'> & {
  baseClasses?: string;
  disabledClasses?: string;
  prefix?: string | ReactNode;
}) {
  return (
    <div className={`relative ${className}`}>
      {prefix && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {prefix}
        </div>
      )}
      <input
        className={`no-spinner ${baseClasses} ${prefix ? 'pl-14' : ''} ${
          disabled ? disabledClasses : 'bg-white'
        } ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        disabled={disabled}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
