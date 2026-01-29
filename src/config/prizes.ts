// Конфигурация призов рулетки
export interface Prize {
  id: number;
  image: string;
  name: string;
  value: string;
  multiplier: number;
  chance: number;
  color: string;
  isBoost?: boolean;
}

export const PRIZES: Prize[] = [
  { id: 0, image: '🧸', name: 'bear', value: '0.6x', multiplier: 0.6, chance: 12, color: '#8B4513' },
  { id: 1, image: '🧸', name: 'bear', value: '0.6x', multiplier: 0.6, chance: 12, color: '#8B4513' },
  { id: 2, image: '🌹', name: 'rose', value: '1x', multiplier: 1, chance: 10, color: '#FF6B6B' },
  { id: 3, image: '🚀', name: 'boost', value: 'Boost', multiplier: 0, chance: 8, color: '#FF9033', isBoost: true },
  { id: 4, image: '❤️', name: 'heart', value: '0.6x', multiplier: 0.6, chance: 12, color: '#E91E63' },
  { id: 5, image: '💐', name: 'flowers', value: '2x', multiplier: 2, chance: 6, color: '#9C27B0' },
  { id: 6, image: '💎', name: 'diamond', value: '4x', multiplier: 4, chance: 2, color: '#00BCD4' },
  { id: 7, image: '🎁', name: 'gift', value: '1x', multiplier: 1, chance: 10, color: '#E91E63' },
  { id: 8, image: '🚀', name: 'rocket', value: '2x', multiplier: 2, chance: 6, color: '#FF5722' },
  { id: 9, image: '🧸', name: 'bear', value: '0.6x', multiplier: 0.6, chance: 12, color: '#8B4513' },
  { id: 10, image: '❤️', name: 'heart', value: '0.6x', multiplier: 0.6, chance: 12, color: '#E91E63' },
  { id: 11, image: '💍', name: 'ring', value: '4x', multiplier: 4, chance: 2, color: '#FFD700' },
  { id: 12, image: '🌹', name: 'rose', value: '1x', multiplier: 1, chance: 10, color: '#FF6B6B' },
  { id: 13, image: '⚡', name: 'boost', value: 'Boost', multiplier: 0, chance: 8, color: '#FF9033', isBoost: true },
  { id: 14, image: '🏆', name: 'trophy', value: '4x', multiplier: 4, chance: 2, color: '#FFD700' },
  { id: 15, image: '🧸', name: 'bear', value: '0.6x', multiplier: 0.6, chance: 12, color: '#8B4513' },
  { id: 16, image: '🌹', name: 'rose', value: '1x', multiplier: 1, chance: 10, color: '#FF6B6B' },
  { id: 17, image: '💐', name: 'flowers', value: '2x', multiplier: 2, chance: 6, color: '#9C27B0' },
  { id: 18, image: '🎁', name: 'gift', value: '1x', multiplier: 1, chance: 10, color: '#E91E63' },
  { id: 19, image: '🐍', name: 'snake', value: '20x', multiplier: 20, chance: 0.3, color: '#4CAF50' },
  { id: 20, image: '🌹', name: 'rose', value: '1x', multiplier: 1, chance: 10, color: '#FF6B6B' },
];

export const WHEEL_CONFIG = {
  slots: 21,
  spinDuration: 5000,
  minRotations: 5,
  maxRotations: 8,
};

export const BET_OPTIONS = [25, 50, 100, 250];

export const DEPOSIT_OPTIONS = [
  { amount: 100, bonus: 0 },
  { amount: 250, bonus: 10 },
  { amount: 500, bonus: 15 },
  { amount: 1000, bonus: 20 },
];

// Функция для взвешенного выбора приза (для демо режима)
export function getRandomPrizeIndex(): number {
  const totalWeight = PRIZES.reduce((sum, p) => sum + p.chance, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < PRIZES.length; i++) {
    random -= PRIZES[i].chance;
    if (random <= 0) return i;
  }
  return 0;
}
