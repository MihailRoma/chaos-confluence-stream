import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOADING_STEPS = [
  { id: 1, text: 'Loading Node.js Runtime...', duration: 1000 },
  { id: 2, text: 'Initializing Agent Protocols...', duration: 800 },
  { id: 3, text: 'Synchronizing Neural Networks...', duration: 1200 },
  { id: 4, text: 'Offloading Updates...', duration: 900 },
  { id: 5, text: 'Validating System Integrity...', duration: 700 },
  { id: 6, text: 'Activating Combat Protocols...', duration: 600 },
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep >= LOADING_STEPS.length) {
      setTimeout(() => {
        onComplete();
      }, 500);
      return;
    }

    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, LOADING_STEPS[currentStep].id]);
      setCurrentStep(prev => prev + 1);
    }, LOADING_STEPS[currentStep].duration);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 bg-terminal-bg/95 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-terminal-surface border border-terminal-border rounded-sm p-8 font-mono max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-log-info mb-2">PUSHING UPDATE</h2>
          <div className="text-log-timestamp text-sm">
            Deploying Agent Modifications...
          </div>
        </div>

        <div className="space-y-3">
          {LOADING_STEPS.map((step) => (
            <div key={step.id} className="flex items-center gap-3">
              <div className={`w-4 h-4 border rounded-sm flex items-center justify-center ${
                completedSteps.includes(step.id) 
                  ? 'bg-log-info border-log-info text-terminal-bg' 
                  : 'border-terminal-border'
              }`}>
                {completedSteps.includes(step.id) && (
                  <span className="text-xs">✓</span>
                )}
              </div>
              <span className={`text-sm ${
                completedSteps.includes(step.id) 
                  ? 'text-log-info' 
                  : 'text-log-timestamp'
              }`}>
                {step.text}
              </span>
            </div>
          ))}
        </div>

        {currentStep >= LOADING_STEPS.length && (
          <div className="mt-6 text-center">
            <div className="text-log-info font-bold animate-pulse">
              UPDATE DEPLOYED SUCCESSFULLY
            </div>
            <div className="text-log-timestamp text-xs mt-2">
              Agents are preparing for next combat phase...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};