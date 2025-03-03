import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculatePoints = (place: number, eventType: 'individual' | 'dual' | 'group'): number => {
  const pointsTable = {
    individual: { 1: 8, 2: 5, 3: 3 },
    dual: { 1: 10, 2: 6, 3: 4 },
    group: { 1: 12, 2: 8, 3: 6 }
  };
  
  return pointsTable[eventType][place as keyof typeof pointsTable['individual']] || 0;
};