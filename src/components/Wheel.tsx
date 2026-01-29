import { useEffect, useRef, useState, useCallback } from 'react';
import { PRIZES, WHEEL_CONFIG } from '@/config/prizes';

interface WheelProps {
  targetSlot: number | null;
  isSpinning: boolean;
  onSpinComplete?: () => void;
}

export function Wheel({ targetSlot, isSpinning, onSpinComplete }: WheelProps) {
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTickAngleRef = useRef<number>(0);

  // Haptic feedback при прокрутке
  const triggerTick = useCallback(() => {
    try {
      window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
    } catch {
      // Haptic not available
    }
  }, []);

  // Анимация спина
  useEffect(() => {
    if (!isSpinning || targetSlot === null) return;

    const slotAngle = 360 / WHEEL_CONFIG.slots;
    const targetAngle = 360 - (targetSlot * slotAngle) - (slotAngle / 2);
    const fullRotations = WHEEL_CONFIG.minRotations + Math.floor(Math.random() * 3);
    const finalAngle = rotation + (fullRotations * 360) + ((targetAngle - (rotation % 360) + 360) % 360);
    
    const duration = WHEEL_CONFIG.spinDuration;
    const startTime = Date.now();
    const startAngle = rotation;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing: cubic-bezier для плавного замедления
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentAngle = startAngle + (finalAngle - startAngle) * eased;
      setRotation(currentAngle);

      // Tick при прохождении каждого сектора
      const normalizedAngle = currentAngle % 360;
      const tickInterval = slotAngle;
      if (Math.floor(normalizedAngle / tickInterval) !== Math.floor(lastTickAngleRef.current / tickInterval)) {
        if (progress < 0.85) {
          triggerTick();
        }
        lastTickAngleRef.current = normalizedAngle;
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        onSpinComplete?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning, targetSlot]);

  // Создание секторов
  const createSector = (index: number, total: number) => {
    const angle = 360 / total;
    const startAngle = index * angle - 90;
    const endAngle = startAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const cx = 200;
    const cy = 200;
    const outerR = 190;
    const innerR = 90;
    
    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);
    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    const path = `
      M ${x1} ${y1}
      A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
    
    const prize = PRIZES[index];
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = (midAngle * Math.PI) / 180;
    const textR = (outerR + innerR) / 2;
    const textX = cx + textR * Math.cos(midRad);
    const textY = cy + textR * Math.sin(midRad);
    
    return (
      <g key={index}>
        <path
          d={path}
          fill={prize.color}
          stroke="#1a1a2e"
          strokeWidth="2"
        />
        <text
          x={textX}
          y={textY}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="28"
          transform={`rotate(${midAngle + 90}, ${textX}, ${textY})`}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {prize.image}
        </text>
      </g>
    );
  };

  return (
    <div className="relative w-full max-w-[350px] aspect-square mx-auto">
      {/* Pointer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 -mt-1">
        <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] 
                        border-l-transparent border-r-transparent border-t-yellow-400
                        drop-shadow-lg" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 blur-2xl" />

      {/* Wheel */}
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-2xl"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {/* Outer ring */}
        <circle cx="200" cy="200" r="195" fill="none" stroke="#4a4a6a" strokeWidth="6" />
        
        {/* Sectors */}
        {Array.from({ length: WHEEL_CONFIG.slots }).map((_, i) => 
          createSector(i, WHEEL_CONFIG.slots)
        )}
        
        {/* Center circle */}
        <circle cx="200" cy="200" r="90" fill="#1a1a2e" />
        <circle cx="200" cy="200" r="85" fill="#2d2d4a" />
        <circle cx="200" cy="200" r="70" fill="#1a1a2e" />
        
        {/* Center logo */}
        <text x="200" y="200" textAnchor="middle" dominantBaseline="central" fontSize="40">
          🎰
        </text>
      </svg>

      {/* Decorative lights */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 - 90) * (Math.PI / 180);
          const x = 50 + 48 * Math.cos(angle);
          const y = 50 + 48 * Math.sin(angle);
          return (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full transition-colors duration-200 ${
                isSpinning 
                  ? i % 2 === 0 ? 'bg-yellow-400' : 'bg-purple-400'
                  : 'bg-gray-600'
              }`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
