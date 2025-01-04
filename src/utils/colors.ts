// Color thresholds for rainfall amounts (in mm)
const THRESHOLDS = {
  NONE: 0,
  LIGHT: 0.25,  // Light rain
  MEDIUM: 2.5,  // Moderate rain
  HEAVY: 7.5    // Heavy rain
};

export const getColorForAmount = (amount: number): string => {
  if (amount === 0) return '#f3f4f6';  // bg-gray-100
  if (amount < THRESHOLDS.LIGHT) return '#dbeafe';  // bg-blue-100
  if (amount < THRESHOLDS.MEDIUM) return '#93c5fd'; // bg-blue-300
  if (amount < THRESHOLDS.HEAVY) return '#3b82f6';  // bg-blue-500
  return '#1d4ed8';  // bg-blue-700
};
