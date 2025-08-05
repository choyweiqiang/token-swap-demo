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
      prefix="$"
      placeholder="0.00"
      type="text"
      inputMode="decimal"
      {...props}
    />
  );
}
