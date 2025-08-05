import { inputBaseClasses, inputDisabledClasses } from '../../styles/ui';
import type { SelectProps } from '../../types/form';

export default function Select({
  options,
  placeholder = 'Please select',
  className,
  disabled,
  error,
  ...props
}: SelectProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        {...props}
        disabled={disabled}
        className={`${inputBaseClasses} select-focus select-arrow appearance-none ${disabled ? inputDisabledClasses : ''} ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
