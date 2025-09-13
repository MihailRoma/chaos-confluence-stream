import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface CountdownTimerProps {
  onPushUpdate: () => void;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ onPushUpdate }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isRunning, setIsRunning] = useState(true);
  const [canPush, setCanPush] = useState(false);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) {
        setCanPush(true);
      }
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanPush(true);
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePushUpdate = () => {
    onPushUpdate();
    setTimeLeft(300); // Reset to 5 minutes
    setCanPush(false);
    setIsRunning(true);
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return 'text-log-error';
    if (timeLeft <= 60) return 'text-log-warning';
    return 'text-log-info';
  };

  return (
    <div className="fixed top-4 right-4 bg-terminal-surface border border-terminal-border rounded-sm p-4 font-mono">
      <div className="text-center space-y-2">
        <div className="text-log-timestamp text-xs uppercase tracking-wider">
          NEXT UPDATE CYCLE
        </div>
        <div className={`text-2xl font-bold ${getTimerColor()} tabular-nums`}>
          {formatTime(timeLeft)}
        </div>
        {canPush && (
          <Button
            onClick={handlePushUpdate}
            className="w-full bg-log-error/20 border border-log-error text-log-error hover:bg-log-error hover:text-terminal-bg transition-all duration-200 font-mono text-xs uppercase tracking-wider"
            variant="outline"
          >
            PUSH UPDATE
          </Button>
        )}
        {!canPush && (
          <div className="text-log-timestamp text-xs">
            STANDBY MODE
          </div>
        )}
      </div>
    </div>
  );
};