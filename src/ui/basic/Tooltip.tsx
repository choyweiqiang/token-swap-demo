import ReactDOM from 'react-dom';
import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const isTouchDevice = 'ontouchstart' in window;

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        x: rect.left + rect.width / 2,
        y: position === 'top' ? rect.top : rect.bottom,
      });
    }
  }, [isVisible, position]);

  // Mobile touch handlers
  useEffect(() => {
    const element = triggerRef.current;
    if (!element || !isTouchDevice) return;

    const handleTouch = () => {
      showTooltip();
      setTimeout(hideTooltip, 2000); // Auto-hide after 2 seconds
    };

    element.addEventListener('touchstart', handleTouch);
    return () => element.removeEventListener('touchstart', handleTouch);
  }, [isTouchDevice]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`inline-block ${className}`}
      >
        {children}
      </div>

      {isVisible &&
        ReactDOM.createPortal(
          <div
            className={`
            fixed z-[99999] px-3 py-1.5 text-sm rounded
            bg-[var(--color-card)]/95 backdrop-blur-sm
            border border-[var(--color-border)] shadow-sm
            text-[var(--color-text)]
          `}
            style={{
              left: `${coords.x}px`,
              top: `${coords.y}px`,
              transform:
                position === 'top' ? 'translate(-50%, calc(-100% - 6px))' : 'translate(-50%, 6px)',
            }}
          >
            {content}

            <div
              className={`
            absolute w-3 h-3 
            ${
              position === 'top'
                ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2'
                : 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2'
            }
          `}
            >
              <div
                className={`
              absolute w-full h-full bg-[var(--color-card)]/95 backdrop-blur-sm
              ${
                position === 'top'
                  ? 'border-b border-r border-[var(--color-border)] rotate-45'
                  : 'border-t border-l border-[var(--color-border)] rotate-45'
              }
            `}
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
