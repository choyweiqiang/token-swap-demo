import { useState, useRef, useEffect } from 'react';

interface PopoverOption {
  value: string;
  label: string;
  symbol?: string;
  icon?: string;
  chainName?: string;
  chainIcon?: string;
}

interface PopoverProps {
  options: PopoverOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  optionClassName?: string;
  disabled?: boolean;
  placement?: 'bottom' | 'top';
  searchPlaceholder?: string;
  maxWidth?: string;
  minWidth?: string;
  align?: 'left' | 'right';
}

export default function Popover({
  options,
  value,
  onChange,
  placeholder = 'Select',
  className = '',
  buttonClassName = '',
  popoverClassName = '',
  optionClassName = '',
  disabled = false,
  placement = 'bottom',
  searchPlaceholder = 'Search',
  maxWidth = '24rem',
  minWidth = '16rem',
  align = 'left',
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState<PopoverOption | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((option) =>
    `${option.label} ${option.symbol || ''}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    if (value) {
      const option = options.find((opt) => opt.value === value);
      if (option) setSelectedOption(option);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key === 'Escape') {
        setIsOpen(false);
        return;
      }

      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleClickOutside);
    };
  }, []);

  const handleSelect = (option: PopoverOption) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm('');
    onChange?.(option.value);
  };

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      <button
        type="button"
        className={`inline-flex items-center justify-between px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${buttonClassName}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
      >
        <div className="flex items-center gap-2">
          {selectedOption?.icon ? (
            <img src={selectedOption.icon} alt="" className="w-5 h-5 rounded-full" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-gray-200" />
          )}
          <span className="font-medium">
            {selectedOption?.symbol || selectedOption?.label || placeholder}
          </span>
        </div>
        <svg
          className={`w-4 h-4 ml-2 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute z-20 ${align === 'right' ? 'right-0' : 'left-0'} ${
            placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
          } bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden ${popoverClassName}`}
          style={{ minWidth, maxWidth }}
        >
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                className="w-full pl-8 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-2.5 top-1/2 h-4 w-4 text-gray-400 -translate-y-1/2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`flex items-center w-full px-3 py-2.5 text-sm hover:bg-gray-50 ${
                    selectedOption?.value === option.value ? 'bg-gray-100' : ''
                  } ${optionClassName}`}
                  onClick={() => handleSelect(option)}
                >
                  <img
                    src={option.icon || '/unknown-logo.png'}
                    alt=""
                    className="w-6 h-6 mr-3 rounded-full"
                  />
                  <div className="text-left flex-1">
                    <div className="font-medium text-gray-900">{option.symbol || option.label}</div>
                    {option.symbol && <div className="text-xs text-gray-500">{option.label}</div>}
                  </div>
                  {option.chainName && (
                    <div className="flex items-center ml-2">
                      <span className="text-xs text-gray-500 mr-1">{option.chainName}</span>
                      {option.chainIcon && (
                        <img
                          src={option.chainIcon}
                          alt={option.chainName}
                          className="w-4 h-4 rounded-full"
                        />
                      )}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-3 text-center text-sm text-gray-500">No chains found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
