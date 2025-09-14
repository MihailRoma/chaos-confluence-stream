import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface TwitterNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export const TwitterNotification: React.FC<TwitterNotificationProps> = ({ 
  isVisible, 
  onClose 
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
      show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className="bg-terminal-surface border border-blue-500 rounded-sm p-4 font-mono max-w-sm shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-500 text-sm font-bold">TWITTER UPDATE</span>
            </div>
            <p className="text-log-text text-sm leading-relaxed">
              A new summary report from all 4 AI agents has just been successfully published on Twitter <span className="text-blue-500">@ObliviaAI</span>
            </p>
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-log-timestamp hover:text-log-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};