import { useEffect, useState } from 'react';

export const useChaosEffects = (chaosLevel: number) => {
  const [chaosClass, setChaosClass] = useState('');

  useEffect(() => {
    const updateChaosEffect = () => {
      switch (chaosLevel) {
        case 1:
          setChaosClass('chaos-level-1');
          break;
        case 2:
          setChaosClass('chaos-level-2');
          break;
        case 3:
          setChaosClass('chaos-level-3');
          break;
        case 4:
          setChaosClass('chaos-level-4');
          break;
        case 5:
          setChaosClass('chaos-level-5');
          break;
        default:
          setChaosClass('');
      }
    };

    updateChaosEffect();
  }, [chaosLevel]);

  return chaosClass;
};