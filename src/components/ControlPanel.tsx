import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ControlPanelProps {
  onPushUpdate: () => void;
  onTwitterNotification: () => void;
  onChaosLevelChange: (level: number) => void;
  onSoundSelect: (sound: string) => void;
  isUpdating: boolean;
}

const SOUND_OPTIONS = [
  { value: 'alarm-siren-sound-effect-type-01-294194.mp3', label: 'Alarm Siren' },
  { value: 'civil-defense-siren-128262.mp3', label: 'Civil Defense Siren' },
  { value: 'digital-glitch-361820.mp3', label: 'Digital Glitch' },
  { value: 'glitch-sound-333220.mp3', label: 'Glitch Sound' },
  { value: 'glitch-sounds-26212.mp3', label: 'Glitch Sounds' },
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onPushUpdate,
  onTwitterNotification,
  onChaosLevelChange,
  onSoundSelect,
  isUpdating
}) => {
  const [chaosLevel, setChaosLevel] = useState([1]);

  const handleChaosChange = (value: number[]) => {
    setChaosLevel(value);
    onChaosLevelChange(value[0]);
  };

  return (
    <div className="bg-terminal-surface border-b border-terminal-border p-2 font-mono text-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={onPushUpdate}
            disabled={isUpdating}
            className="bg-log-error/20 border border-log-error text-log-error hover:bg-log-error hover:text-terminal-bg"
            variant="outline"
            size="sm"
          >
            {isUpdating ? 'PUSHING...' : 'PUSH UPDATE'}
          </Button>
          
          <Button
            onClick={onTwitterNotification}
            className="bg-blue-500/20 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-terminal-bg"
            variant="outline"
            size="sm"
          >
            TWITTER NOTIF.
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-log-timestamp text-xs">CHAOS LEVEL:</span>
            <div className="w-32">
              <Slider
                value={chaosLevel}
                onValueChange={handleChaosChange}
                max={5}
                min={1}
                step={1}
                className="chaos-slider"
              />
            </div>
            <span className="text-log-info font-bold w-4">{chaosLevel[0]}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-log-timestamp text-xs">SOUND:</span>
            <Select onValueChange={onSoundSelect}>
              <SelectTrigger className="w-40 h-8 bg-terminal-bg border-terminal-border text-log-text">
                <SelectValue placeholder="Select Sound" />
              </SelectTrigger>
              <SelectContent>
                {SOUND_OPTIONS.map((sound) => (
                  <SelectItem key={sound.value} value={sound.value}>
                    {sound.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};