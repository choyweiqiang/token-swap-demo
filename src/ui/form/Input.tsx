import { inputBaseClasses, inputDisabledClasses } from '../../styles/ui';
import type { InputProps } from '../../types/form';

export default function Input({ className, disabled, error, prefix, ...props }: InputProps) {
  return (
    <div className={`relative ${className}`}>
      {prefix && (
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        className={`no-spinner input-focus ${inputBaseClasses} ${
          prefix ? 'pl-7' : ''
        } ${disabled ? inputDisabledClasses : ''} ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
        {...props}
      />

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
