// Color thresholds for rainfall amounts (in mm)
const THRESHOLDS = {
  NONE: 0,
  LIGHT: 0.25,  // Light rain
  MEDIUM: 2.5,  // Moderate rain
  HEAVY: 7.5    // Heavy rain
};

// Convert mm to inches for comparison
const mmToInches = (mm: number) => mm / 25.4;

export const getColorForAmount = (amount: number): string => {
  // Convert mm to inches for threshold comparison
  const inches = mmToInches(amount);

  if (inches === 0) return '#ffffff';  // White for no rain
  
  // Scale with emphasis on heavy rain thresholds
  if (inches <= 0.01) return '#f0f9ff';  // Very light blue - trace amounts
  if (inches <= 0.1) return '#dbeafe';   // Light blue - drizzle
  if (inches <= 0.25) return '#93c5fd';  // Medium light blue - light rain
  if (inches <= 0.5) return '#60a5fa';   // Medium blue - moderate rain
  if (inches <= 0.75) return '#3b82f6';  // Medium strong blue - moderate-heavy rain
  if (inches <= 1.0) return '#2563eb';   // Strong blue - heavy rain
  if (inches <= 1.5) return '#1d4ed8';   // Darker blue - very heavy rain
  
  // Ton of rain (>1.5 inches)
  if (inches <= 2.0) return '#7c3aed';   // Purple - ton of rain
  
  // Truck ton of rain (>2 inches)
  return '#6d28d9';  // Darker purple - truck ton of rain
};
