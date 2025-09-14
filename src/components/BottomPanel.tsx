import React from 'react';

interface BottomPanelProps {
  totalMessages: number;
  currentCycle: number;
  status: 'IDLE' | 'PAUSED' | 'LIVE';
}

export const BottomPanel: React.FC<BottomPanelProps> = ({ 
  totalMessages, 
  currentCycle, 
  status 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'LIVE': return 'text-log-info';
      case 'PAUSED': return 'text-log-warning';
      case 'IDLE': return 'text-log-error';
      default: return 'text-log-text';
    }
  };

  return (
    <div className="bg-terminal-surface border-t border-terminal-border px-4 py-2 font-mono text-xs">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <span className="text-log-timestamp">
            CYCLE: <span className="text-log-info font-bold">{currentCycle}</span>
          </span>
          <span className="text-log-timestamp">
            MESSAGES: <span className="text-log-info font-bold">{totalMessages}</span>
          </span>
          <span className="text-log-timestamp">
            STATUS: <span className={`font-bold ${getStatusColor()}`}>{status}</span>
          </span>
        </div>
        
        <div className="text-log-timestamp">
          Project Oblivia Backrooms v1.0.0 | Multi-Agent Development Environment
        </div>
      </div>
    </div>
  );
};