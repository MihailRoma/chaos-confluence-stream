import React, { useState } from 'react';
import { TerminalLogStream } from '@/components/TerminalLogStream';
import { StatusBar } from '@/components/StatusBar';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [updateCount, setUpdateCount] = useState(0);
  const { toast } = useToast();

  const handlePushUpdate = () => {
    setUpdateCount(prev => prev + 1);
    toast({
      title: "UPDATE PUSHED",
      description: `Cycle ${updateCount + 1} initiated. Agents are preparing for next combat phase.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-terminal-bg text-log-text font-mono overflow-hidden">
      {/* Header */}
      <div className="bg-terminal-surface border-b border-terminal-border p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-log-info tracking-wider">
              PROJECT OBLIVIA BACKROOMS
            </h1>
            <p className="text-log-timestamp text-sm mt-1">
              AI BATTLE ROYALE • LIVE SYSTEM LOGS • CYCLE #{updateCount + 1}
            </p>
          </div>
          <div className="text-right">
            <div className="text-log-system text-lg font-bold">
              ■ LIVE STREAM ACTIVE
            </div>
            <div className="text-log-timestamp text-xs">
              4 AGENTS • COMBAT MODE • HIGH INTENSITY
            </div>
          </div>
        </div>
      </div>

      {/* Agent Status Bar */}
      <StatusBar />

      {/* Main Terminal Area */}
      <div className="flex-1 p-4" style={{ height: 'calc(100vh - 140px)' }}>
        <TerminalLogStream />
      </div>

      {/* Countdown Timer */}
      <CountdownTimer onPushUpdate={handlePushUpdate} />

      {/* Terminal Cursor Effect */}
      <div className="fixed bottom-4 left-4 text-log-info animate-pulse">
        <span className="font-mono text-sm">█ NODE.JS v18.17.0 | POB-CORE v2.1.3</span>
      </div>
    </div>
  );
};

export default Index;