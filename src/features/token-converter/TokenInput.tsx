import Input from '../../ui/form/Input';
import type { InputProps } from '../../types/form';
import { sanitizeInput } from '../../utils/sanitize';

export function TokenInput({
  value,
  onChange,
  ...props
}: Omit<InputProps, 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(sanitizeInput(e.target.value));
  };

  return (
    <Input
      value={value}
      onChange={handleChange}
      prefix={<span className="text-gray-500 font-mono text-sm tracking-tight">USD</span>}
      placeholder="0.00"
      type="text"
      inputMode="decimal"
      baseClasses="w-full h-10 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-gray-700 font-mono placeholder-gray-400"
      {...props}
    />
  );
}
