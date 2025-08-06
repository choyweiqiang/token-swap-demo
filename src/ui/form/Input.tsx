import type { InputProps } from '../../types/form';

export default function Input({
  className = '',
  disabled = false,
  error = '',
  prefix,
  baseClasses = 'w-full h-10 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition align-middle',
  disabledClasses = 'bg-gray-100 cursor-not-allowed opacity-80',
  ...props
}: InputProps & {
  baseClasses?: string;
  disabledClasses?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {prefix && (
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        className={`no-spinner input-focus ${baseClasses} ${prefix ? 'pl-7' : ''} ${
          disabled ? disabledClasses : ''
        } ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
        disabled={disabled}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
