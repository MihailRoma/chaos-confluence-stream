import React, { useState, useEffect, useRef } from 'react';
import { TerminalLogStream } from '@/components/TerminalLogStream';
import { StatisticsWindow } from '@/components/StatisticsWindow';
import { ControlPanel } from '@/components/ControlPanel';
import { BottomPanel } from '@/components/BottomPanel';
import { LoadingScreen } from '@/components/LoadingScreen';
import { TwitterNotification } from '@/components/TwitterNotification';
import { useChaosEffects } from '@/hooks/useChaosEffects';

const Index = () => {
  const [updateCount, setUpdateCount] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showTwitterNotif, setShowTwitterNotif] = useState(false);
  const [chaosLevel, setChaosLevel] = useState(1);
  const [selectedSound, setSelectedSound] = useState<string>('');
  const [status, setStatus] = useState<'IDLE' | 'PAUSED' | 'LIVE'>('LIVE');
  const [isRunning, setIsRunning] = useState(true);
  
  // Agent statistics
  const [agentStatuses, setAgentStatuses] = useState([
    { name: 'Grok' as const, status: 'ONLINE' as 'ONLINE' | 'IDLE' | 'PROCESSING', color: 'text-grok' },
    { name: 'ChatGPT' as const, status: 'ONLINE' as 'ONLINE' | 'IDLE' | 'PROCESSING', color: 'text-chatgpt' },
    { name: 'Claude' as const, status: 'ONLINE' as 'ONLINE' | 'IDLE' | 'PROCESSING', color: 'text-claude' },
    { name: 'Perplexity' as const, status: 'ONLINE' as 'ONLINE' | 'IDLE' | 'PROCESSING', color: 'text-perplexity' },
  ]);
  
  const [systemStats, setSystemStats] = useState({
    cpu: 73,
    memory: 67,
    connections: 15847
  });

  const [messageDistribution, setMessageDistribution] = useState({
    Grok: 0,
    ChatGPT: 0,
    Claude: 0,
    Perplexity: 0
  });

  const [messagesPerSecond, setMessagesPerSecond] = useState(0);
  const messagesInLastSecond = useRef(0);
  const lastSecondTimestamp = useRef(Date.now());

  const chaosClass = useChaosEffects(chaosLevel);

  // Timer countdown
  useEffect(() => {
    if (!isRunning || timeLeft <= 0 || isUpdating) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isUpdating]);

  // Simulate system stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        cpu: Math.max(50, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(40, Math.min(90, prev.memory + (Math.random() - 0.5) * 8)),
        connections: prev.connections + Math.floor((Math.random() - 0.5) * 100)
      }));

      // Randomly update agent statuses
      if (Math.random() < 0.1) {
        setAgentStatuses(prev => prev.map(agent => ({
          ...agent,
          status: Math.random() < 0.8 ? 'ONLINE' : Math.random() < 0.6 ? 'PROCESSING' : 'IDLE'
        })));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Calculate messages per second
  useEffect(() => {
    const now = Date.now();
    messagesInLastSecond.current++;
    
    if (now - lastSecondTimestamp.current >= 1000) {
      setMessagesPerSecond(messagesInLastSecond.current);
      messagesInLastSecond.current = 0;
      lastSecondTimestamp.current = now;
    }
  }, [totalMessages]);

  const handleMessageAdd = (agent?: string) => {
    setTotalMessages(prev => prev + 1);
    
    // Update message distribution if agent is provided
    if (agent) {
      setMessageDistribution(prev => ({
        ...prev,
        [agent]: (prev[agent as keyof typeof prev] || 0) + 1
      }));
    }
  };

  const handlePushUpdate = async () => {
    setIsUpdating(true);
    setStatus('PAUSED');
    
    // Show loading screen, then restart cycle
    setTimeout(() => {
      setUpdateCount(prev => prev + 1);
      setTimeLeft(300);
      setIsRunning(true);
      setIsUpdating(false);
      setStatus('LIVE');
      
      // Play notification sound
      if (selectedSound) {
        const audio = new Audio(`/${selectedSound}`);
        audio.play().catch(console.error);
      } else {
        const audio = new Audio('/mixkit-doorbell-tone-2864.wav');
        audio.play().catch(console.error);
      }
    }, 6000);
  };

  const handleTwitterNotification = () => {
    setShowTwitterNotif(true);
    const audio = new Audio('/mixkit-doorbell-tone-2864.wav');
    audio.play().catch(console.error);
  };

  const handleSoundSelect = (sound: string) => {
    setSelectedSound(sound);
    // Test play the selected sound
    const audio = new Audio(`/${sound}`);
    audio.play().catch(console.error);
  };

  return (
    <div className={`min-h-screen bg-terminal-bg text-log-text font-mono overflow-hidden ${chaosClass}`}>
      {/* Control Panel */}
      <ControlPanel
        onPushUpdate={handlePushUpdate}
        onTwitterNotification={handleTwitterNotification}
        onChaosLevelChange={setChaosLevel}
        onSoundSelect={handleSoundSelect}
        isUpdating={isUpdating}
      />

      {/* Main Content Area */}
      <div className="flex h-screen pt-16 pb-8">
        {/* Statistics Window */}
        <div className="w-1/6 p-4">
          <StatisticsWindow
            timeLeft={timeLeft}
            agentStatuses={agentStatuses}
            cpuUsage={systemStats.cpu}
            memUsage={systemStats.memory}
            connections={systemStats.connections}
            messagesPerSecond={messagesPerSecond}
            messageDistribution={messageDistribution}
          />
        </div>

        {/* Terminal Log Stream */}
        <div className="flex-1 p-4">
          <TerminalLogStream 
            onMessageAdd={handleMessageAdd}
            chaosLevel={chaosLevel}
            isPaused={isUpdating}
          />
        </div>
      </div>

      {/* Bottom Panel */}
      <BottomPanel
        totalMessages={totalMessages}
        currentCycle={updateCount + 1}
        status={status}
      />

      {/* Loading Screen */}
      {isUpdating && (
        <LoadingScreen onComplete={() => {}} />
      )}

      {/* Twitter Notification */}
      <TwitterNotification
        isVisible={showTwitterNotif}
        onClose={() => setShowTwitterNotif(false)}
      />
    </div>
  );
};

export default Index;