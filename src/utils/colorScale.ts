const RAINFALL_THRESHOLDS = {
  none: 0,
  light: 5,    // 5mm
  medium: 15,  // 15mm
  heavy: 30    // 30mm
};

export const calculateColor = (rainfall: number): string => {
  if (rainfall === 0) return 'rainfall-none';
  if (rainfall <= RAINFALL_THRESHOLDS.light) return 'rainfall-light';
  if (rainfall <= RAINFALL_THRESHOLDS.medium) return 'rainfall-medium';
  return 'rainfall-heavy';
};

export const convertToInches = (mm: number): number => {
  return mm * 0.0393701;
};

export const formatRainfall = (amount: number, unit: 'mm' | 'inches'): string => {
  const value = unit === 'inches' ? convertToInches(amount) : amount;
  return `${value.toFixed(2)}${unit}`;
};
