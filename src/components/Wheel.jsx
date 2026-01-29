import { useEffect, useRef, useState } from 'react';
import { createWheel } from '../utils/wheel/createWheel';
import { wheelConfig } from '../utils/wheel/config';
import { startSpinAdvanced, initSpinGenerator } from '../logic/spinLogic';
import { createSpinGenerator } from '../logic/random';

export const Wheel = ({ onSpinStart, onSpinEnd, targetSlot, shouldSpin }) => {
  const svgRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const cancelSpinRef = useRef(null);
  const spinGeneratorRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;
    
    createWheel(svgRef);
    
    spinGeneratorRef.current = createSpinGenerator({
      slots: wheelConfig.slots,
      prizes: wheelConfig.prizes,
      pointerPosition: 0
    });
    
    initSpinGenerator({
      slots: wheelConfig.slots,
      prizes: wheelConfig.prizes,
      pointerPosition: 0
    });
  }, []);

  useEffect(() => {
    if (shouldSpin && targetSlot !== null && targetSlot !== undefined) {
      performSpin(targetSlot);
    }
  }, [shouldSpin, targetSlot]);

  const performSpin = (forcedSlot) => {
    if (cancelSpinRef.current) {
      cancelSpinRef.current.cancel();
    }

    if (onSpinStart) onSpinStart();

    const spinInstance = startSpinAdvanced({
      currentRotation: rotation,
      slots: wheelConfig.slots,
      prizes: wheelConfig.prizes,
      generator: spinGeneratorRef.current,
      forcedSlot: forcedSlot,
      generateOptions: {
        guaranteed: forcedSlot,
        antiRepeat: false,
      },
      onGenerate: (result) => {
        console.log('🎲 Сгенерирован результат:', {
          слот: result.targetSlot,
          приз: `${result.prize?.image || ''} ${result.prize?.value || 'неизвестно'}`,
        });
      },
      onUpdate: (newRotation) => {
        setRotation(newRotation);
      },
      onComplete: (finalRotation, winningIndex, prize) => {
        console.log('🏆 Выигрышный приз:', `${prize?.value || 'Неизвестно'}`);
        setRotation(finalRotation);
        if (onSpinEnd) onSpinEnd(winningIndex, prize);
      }
    });

    cancelSpinRef.current = spinInstance;
  };

  return (
    <div className="wheel-container">
      <div className="roulette-container">
        <svg
          ref={svgRef}
          viewBox="0 0 800 800"
          style={{ 
            width: '100%', 
            height: '100%',
            transform: `rotate(${rotation}deg)`,
            transformOrigin: 'center',
            transition: 'none',
            overflow: 'visible'
          }}
        >
          <defs>
            <filter id="slot-glow" x="-200%" y="-200%" width="400%" height="400%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="25" />
            </filter>
          </defs>
          <circle cx="400" cy="400" r="400" fill="none" stroke="none" />
        </svg>
      </div>

      <div className="pointer" style={{ 
        top: '112px', 
        bottom: 'auto',
        transform: 'translateX(-50%)'
      }}></div>
    </div>
  );
};
