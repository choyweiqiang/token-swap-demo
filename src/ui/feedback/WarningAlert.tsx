import { useEffect, useState } from 'react';
import CrossMarkIcon from '../../assets/icons/CrossMarkIcon';

export function WarningAlert({
  message,
  onDismiss,
  autoDismiss = 5000,
}: {
  message: string;
  onDismiss?: () => void;
  autoDismiss?: number | false;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow-lg max-w-xs md:max-w-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-yellow-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => {
                setVisible(false);
                onDismiss?.();
              }}
              className="text-yellow-500 hover:text-yellow-700"
            >
              <CrossMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
