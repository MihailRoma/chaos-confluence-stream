import React from 'react';

interface AgentStatus {
  name: 'Grok' | 'ChatGPT' | 'Claude' | 'Perplexity';
  status: 'ONLINE' | 'IDLE' | 'PROCESSING';
  color: string;
}

interface StatisticsWindowProps {
  timeLeft: number;
  agentStatuses: AgentStatus[];
  cpuUsage: number;
  memUsage: number;
  connections: number;
  messagesPerSecond: number;
  messageDistribution: Record<string, number>;
}

export const StatisticsWindow: React.FC<StatisticsWindowProps> = ({
  timeLeft,
  agentStatuses,
  cpuUsage,
  memUsage,
  connections,
  messagesPerSecond,
  messageDistribution
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft <= 30) return 'text-log-error';
    if (timeLeft <= 60) return 'text-log-warning';
    return 'text-log-info';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ONLINE': return 'text-log-info';
      case 'PROCESSING': return 'text-log-warning';
      case 'IDLE': return 'text-log-error';
      default: return 'text-log-text';
    }
  };

  const total = Object.values(messageDistribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-terminal-surface border border-terminal-border rounded-sm p-3 font-mono text-xs space-y-3">
      {/* Countdown Timer */}
      <div className="text-center border-b border-terminal-border pb-2">
        <div className="text-log-timestamp text-xs uppercase tracking-wider mb-1">
          NEXT CYCLE
        </div>
        <div className={`text-xl font-bold ${getTimerColor()} tabular-nums`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Agent Status */}
      <div className="space-y-1">
        <div className="text-log-timestamp text-xs uppercase tracking-wider border-b border-terminal-border pb-1">
          AGENT STATUS
        </div>
        {agentStatuses.map(agent => (
          <div key={agent.name} className="flex justify-between items-center">
            <span className={agent.color}>{agent.name}</span>
            <span className={`text-xs ${getStatusColor(agent.status)}`}>
              ● {agent.status}
            </span>
          </div>
        ))}
      </div>

      {/* System Resources */}
      <div className="space-y-1">
        <div className="text-log-timestamp text-xs uppercase tracking-wider border-b border-terminal-border pb-1">
          SYSTEM
        </div>
        <div className="flex justify-between">
          <span className="text-log-timestamp">CPU</span>
          <span className="text-log-info">{cpuUsage}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-log-timestamp">MEM</span>
          <span className="text-log-info">{memUsage}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-log-timestamp">CONN</span>
          <span className="text-log-info">{connections}</span>
        </div>
      </div>

      {/* Performance */}
      <div className="space-y-1">
        <div className="text-log-timestamp text-xs uppercase tracking-wider border-b border-terminal-border pb-1">
          PERFORMANCE
        </div>
        <div className="flex justify-between">
          <span className="text-log-timestamp">MSG/SEC</span>
          <span className="text-log-info">{messagesPerSecond.toFixed(1)}</span>
        </div>
      </div>

      {/* Message Distribution */}
      <div className="space-y-1">
        <div className="text-log-timestamp text-xs uppercase tracking-wider border-b border-terminal-border pb-1">
          DISTRIBUTION
        </div>
        {Object.entries(messageDistribution).map(([agent, count]) => (
          <div key={agent} className="flex justify-between items-center text-xs">
            <span className="text-log-timestamp">{agent.toUpperCase()}</span>
            <div className="flex items-center gap-2">
              <span className="text-log-info">{count}</span>
              <div className="w-8 bg-terminal-bg rounded-sm h-1">
                <div 
                  className="h-full bg-log-info rounded-sm transition-all"
                  style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};