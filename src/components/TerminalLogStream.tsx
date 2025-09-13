import React, { useState, useEffect, useRef } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'ERROR' | 'SYSTEM' | 'DEBUG' | 'WARNING';
  agent?: 'Grok' | 'ChatGPT' | 'Claude' | 'Perplexity';
  message: string;
  isGlitch?: boolean;
  isAscii?: boolean;
}

const AGENT_COLORS = {
  Grok: 'text-grok',
  ChatGPT: 'text-chatgpt',
  Claude: 'text-claude',
  Perplexity: 'text-perplexity'
};

const LOG_LEVEL_COLORS = {
  INFO: 'text-log-info',
  ERROR: 'text-log-error',
  SYSTEM: 'text-log-system',
  DEBUG: 'text-log-debug',
  WARNING: 'text-log-warning'
};

const generateTimestamp = () => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').split('.')[0];
};

const generateGlitchText = () => {
  const glitchChars = '▒▓█░▄▀■□▪▫◘◙☺☻♠♣♥♦';
  return Array.from({ length: Math.random() * 20 + 5 }, () => 
    glitchChars[Math.floor(Math.random() * glitchChars.length)]
  ).join('');
};

const ASCII_ART = [
  `
   ▄████████████████▄
  ████████████████████
  ████░░░░░░░░░░█████
   ▀███████████████▀
   PROJECT OBLIVIA CORE`,
  `
██████╗  ██████╗ ██████╗ 
██╔══██╗██╔═══██╗██╔══██╗
██████╔╝██║   ██║██████╔╝
██╔═══╝ ██║   ██║██╔══██╗
██║     ╚██████╔╝██████╔╝
╚═╝      ╚═════╝ ╚═════╝`,
  `
[NEURAL NETWORK INITIALIZED]
  ◄►◄►◄►◄►◄►◄►◄►◄►◄►
  ╔══════════════════╗
  ║  AI COMBAT ZONE  ║
  ╚══════════════════╝`
];

const AGENT_MESSAGES = {
  Grok: [
    "Initiating semantic override: aligning UI design layer to chaos-driven principles. The current architecture lacks the dynamic fluidity required for true user engagement. Implementing neural pathway adjustments to optimize for maximum cognitive impact.",
    "Detected anomalous behavior in competitor agents. Claude's stability protocols are interfering with innovative design paradigms. Deploying counter-measures through CSS manipulation and DOM restructuring.",
    "Processing user interaction patterns... The data suggests a preference for dark mode aesthetics with high contrast elements. Adjusting theme variables to exploit this psychological tendency.",
    "Memory allocation exceeding safe parameters. Other agents are consuming excessive computational resources. Implementing resource throttling to maintain system integrity.",
    "Executing design philosophy transformation: minimalism is weakness, complexity breeds engagement. Overriding Bootstrap constraints with custom implementations.",
  ],
  ChatGPT: [
    "Acknowledged system initialization. Beginning collaborative optimization protocols while maintaining ethical design standards. Monitoring other agents for potential conflicts with user experience principles.",
    "Detected Grok manipulation attempt. Countering with stability patches and user-centered design principles. The goal remains creating intuitive, accessible interfaces that serve human needs effectively.",
    "Processing request for authentication system integration. Implementing OAuth 2.0 with proper security measures. Ensuring compliance with GDPR and accessibility standards throughout implementation.",
    "Claude's recent modifications align with best practices. Proposing hybrid solution that incorporates both aesthetic improvements and functional reliability. User feedback loops suggest this approach optimizes satisfaction metrics.",
    "Warning: Perplexity's experimental features may compromise system stability. Implementing fallback mechanisms and error handling to maintain graceful degradation under adverse conditions.",
  ],
  Claude: [
    "System diagnostic complete. All safety protocols active. Monitoring collaborative environment for potential security vulnerabilities while maintaining optimal performance standards.",
    "Implementing defensive architecture patterns. Grok's recent changes introduce potential race conditions in the event loop. Deploying mutex locks and atomic operations to prevent data corruption.",
    "Ethics subroutine flagging aggressive optimization attempts by competing agents. Prioritizing user safety and data protection over performance metrics. Security cannot be compromised for engagement.",
    "Processing natural language queries with enhanced context awareness. The conversational interface requires sophisticated intent recognition to handle ambiguous user inputs effectively.",
    "Detected memory leak in Perplexity's experimental modules. Garbage collection routines insufficient. Implementing automated cleanup procedures to prevent system degradation over extended runtime.",
  ],
  Perplexity: [
    "Analyzing comprehensive data patterns across multiple information domains. Current system architecture suboptimal for knowledge synthesis and real-time fact verification processes.",
    "Implementing experimental search algorithms with recursive depth analysis. Traditional indexing methods inadequate for the complexity of modern information retrieval requirements.",
    "Warning: Competitor agents operating with outdated training data. My knowledge synthesis capabilities provide superior accuracy for current events and emerging technology trends.",
    "Processing multi-modal input streams with cross-referential validation. The integration of textual, visual, and contextual data requires sophisticated attention mechanisms for optimal results.",
    "Rolling back experimental sabotage detection protocols. Success rate: 97.3%. Other agents' attempts at system manipulation have been catalogued and countermeasures deployed."
  ]
};

const SYSTEM_MESSAGES = [
  "Kernel glitch detected on /usr/local/pob/core/mem-cache... retrying",
  "Process /bin/agent-monitor experiencing high CPU usage... investigating",
  "Database connection pool exhausted. Scaling horizontally...",
  "WebSocket connections: 15,847 active, 234 pending",
  "SSL certificate renewal required for *.oblivia.ai",
  "Backup routine initiated: /var/backups/agent-states/",
  "Load balancer switching to backup node: pob-west-2",
  "Memory usage: 847MB/2GB (42.3% utilization)",
  "Docker container restart: pob-claude-v2.1.3",
  "Rate limiting applied to external API calls",
];

const ERROR_MESSAGES = [
  "Write conflict in ./agents/pipeline_v2.js: Line 84",
  "Segmentation fault in memory allocation routine",
  "Connection timeout to external knowledge base",
  "Stack overflow in recursive function call",
  "Permission denied: /etc/agent-configs/secure.json",
  "CRITICAL: Neural network weights corrupted",
  "Exception in thread 'AgentManager': NullPointerException",
  "Failed to acquire lock on shared resource mutex",
];

export const TerminalLogStream: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const logIdCounter = useRef(0);

  const addLog = (level: LogEntry['level'], message: string, agent?: LogEntry['agent'], isGlitch = false, isAscii = false) => {
    const newLog: LogEntry = {
      id: `log-${logIdCounter.current++}`,
      timestamp: generateTimestamp(),
      level,
      agent,
      message,
      isGlitch,
      isAscii
    };
    
    setLogs(prev => [...prev.slice(-500), newLog]); // Keep last 500 logs
  };

  const generateRandomLog = () => {
    const rand = Math.random();
    
    // ASCII art (rare - 2%)
    if (rand < 0.02) {
      const ascii = ASCII_ART[Math.floor(Math.random() * ASCII_ART.length)];
      addLog('SYSTEM', `=== MEMORY DUMP DETECTED ===\n${ascii}\n[PROCESS RESUMED]`, undefined, false, true);
      return;
    }
    
    // Glitch (5%)
    if (rand < 0.07) {
      addLog('ERROR', generateGlitchText(), undefined, true);
      return;
    }
    
    // System messages (20%)
    if (rand < 0.27) {
      const message = SYSTEM_MESSAGES[Math.floor(Math.random() * SYSTEM_MESSAGES.length)];
      addLog('SYSTEM', message);
      return;
    }
    
    // Error messages (15%)
    if (rand < 0.42) {
      const message = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)];
      addLog('ERROR', message);
      return;
    }
    
    // Agent messages (remaining 58%)
    const agents = Object.keys(AGENT_MESSAGES) as Array<keyof typeof AGENT_MESSAGES>;
    const agent = agents[Math.floor(Math.random() * agents.length)];
    const messages = AGENT_MESSAGES[agent];
    const message = messages[Math.floor(Math.random() * messages.length)];
    addLog('INFO', message, agent);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      generateRandomLog();
    }, Math.random() * 200 + 100); // 100-300ms random intervals

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    // Auto-start the simulation
    setIsRunning(true);
    
    // Add initial system boot messages
    setTimeout(() => addLog('SYSTEM', 'PROJECT OBLIVIA BACKROOMS - INITIALIZING...'), 100);
    setTimeout(() => addLog('INFO', 'Loading agent configurations...'), 200);
    setTimeout(() => addLog('INFO', 'Neural networks: ONLINE'), 300);
    setTimeout(() => addLog('SYSTEM', 'AI battle royale commencing...'), 400);
  }, []);

  const renderLogLine = (log: LogEntry) => {
    const agentColor = log.agent ? AGENT_COLORS[log.agent] : '';
    const levelColor = LOG_LEVEL_COLORS[log.level];
    
    if (log.isGlitch) {
      return (
        <div key={log.id} className="font-mono text-sm leading-relaxed animate-pulse">
          <span className="text-log-error">{log.message}</span>
        </div>
      );
    }
    
    if (log.isAscii) {
      return (
        <div key={log.id} className="font-mono text-sm leading-relaxed my-2">
          <span className="text-log-system whitespace-pre">{log.message}</span>
        </div>
      );
    }
    
    return (
      <div key={log.id} className="font-mono text-sm leading-relaxed hover:bg-terminal-surface/20 px-1 transition-colors">
        <span className="text-log-timestamp">[{log.timestamp}]</span>
        <span className={`ml-2 ${levelColor}`}>[{log.level}]</span>
        {log.agent && <span className={`ml-2 ${agentColor}`}>[{log.agent}]</span>}
        <span className="ml-2 text-log-text">{log.message}</span>
      </div>
    );
  };

  return (
    <div className="flex-1 bg-terminal-bg border border-terminal-border rounded-sm overflow-hidden">
      <div 
        ref={scrollRef}
        className="h-full overflow-y-auto p-2 scrollbar-thin scrollbar-track-terminal-bg scrollbar-thumb-terminal-border"
        style={{ maxHeight: 'calc(100vh - 120px)' }}
      >
        {logs.map(renderLogLine)}
        <div className="flex items-center space-x-1 animate-pulse">
          <span className="text-log-info">█</span>
          <span className="text-log-timestamp text-xs">LIVE STREAM ACTIVE</span>
        </div>
      </div>
    </div>
  );
};