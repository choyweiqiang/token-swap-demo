export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

interface Option {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
}
