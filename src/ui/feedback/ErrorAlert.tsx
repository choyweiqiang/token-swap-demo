import { useEffect, useState } from 'react';
import CrossMarkIcon from '../../assets/icons/CrossMarkIcon';

export function ErrorAlert({
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
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg max-w-xs md:max-w-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CrossMarkIcon className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <button
              onClick={() => {
                setVisible(false);
                onDismiss?.();
              }}
              className="text-red-500 hover:text-red-700"
            >
              <CrossMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
