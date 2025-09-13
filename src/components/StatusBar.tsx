import React, { useState, useEffect } from 'react';

interface AgentStatus {
  name: string;
  status: 'LIVE' | 'IDLE' | 'PAUSED';
  color: string;
  lastActive: string;
}

const INITIAL_AGENTS: AgentStatus[] = [
  { name: 'Grok', status: 'LIVE', color: 'text-grok', lastActive: '00:01' },
  { name: 'ChatGPT', status: 'LIVE', color: 'text-chatgpt', lastActive: '00:02' },
  { name: 'Claude', status: 'LIVE', color: 'text-claude', lastActive: '00:01' },
  { name: 'Perplexity', status: 'LIVE', color: 'text-perplexity', lastActive: '00:03' },
];

export const StatusBar: React.FC = () => {
  const [agents, setAgents] = useState<AgentStatus[]>(INITIAL_AGENTS);
  const [systemMetrics, setSystemMetrics] = useState({
    cpu: 73,
    memory: 84,
    connections: 15847,
    uptime: '02:47:32'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change agent status occasionally
      if (Math.random() < 0.05) { // 5% chance every second
        setAgents(prev => prev.map(agent => {
          if (Math.random() < 0.3) { // 30% chance for each agent
            const statuses: AgentStatus['status'][] = ['LIVE', 'IDLE', 'PAUSED'];
            const currentIndex = statuses.indexOf(agent.status);
            // Bias toward LIVE status
            const newStatus = Math.random() < 0.8 ? 'LIVE' : statuses[Math.floor(Math.random() * statuses.length)];
            return {
              ...agent,
              status: newStatus,
              lastActive: newStatus === 'LIVE' ? '00:00' : agent.lastActive
            };
          }
          return agent;
        }));
      }

      // Update system metrics
      setSystemMetrics(prev => ({
        cpu: Math.max(65, Math.min(95, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(70, Math.min(90, prev.memory + (Math.random() - 0.5) * 5)),
        connections: prev.connections + Math.floor((Math.random() - 0.5) * 100),
        uptime: prev.uptime // Keep static for now
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'LIVE': return 'text-log-info';
      case 'IDLE': return 'text-log-warning';
      case 'PAUSED': return 'text-log-error';
    }
  };

  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'LIVE': return '●';
      case 'IDLE': return '◐';
      case 'PAUSED': return '○';
    }
  };

  return (
    <div className="bg-terminal-surface border-b border-terminal-border p-3 font-mono text-sm">
      <div className="flex justify-between items-center">
        {/* Agent Status */}
        <div className="flex space-x-6">
          {agents.map((agent) => (
            <div key={agent.name} className="flex items-center space-x-2">
              <span className={`${getStatusColor(agent.status)} animate-pulse`}>
                {getStatusIcon(agent.status)}
              </span>
              <span className={agent.color}>{agent.name}</span>
              <span className="text-log-timestamp">
                [{agent.status}]
              </span>
              {agent.status !== 'LIVE' && (
                <span className="text-log-timestamp text-xs">
                  {agent.lastActive}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* System Metrics */}
        <div className="flex space-x-4 text-log-timestamp">
          <span>CPU: <span className="text-log-warning">{systemMetrics.cpu}%</span></span>
          <span>MEM: <span className="text-log-warning">{systemMetrics.memory}%</span></span>
          <span>CONN: <span className="text-log-info">{systemMetrics.connections.toLocaleString()}</span></span>
          <span>UP: <span className="text-log-system">{systemMetrics.uptime}</span></span>
        </div>
      </div>
    </div>
  );
};