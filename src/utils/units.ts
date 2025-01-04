const MM_TO_INCHES = 0.0393701;

export const convertUnit = (value: number, fromUnit: 'mm' | 'in', toUnit: string): number => {
  if (fromUnit === toUnit) return value;
  
  // Convert mm to inches
  if (fromUnit === 'mm' && toUnit === 'in') {
    return value * MM_TO_INCHES;
  }
  
  // Convert inches to mm
  if (fromUnit === 'in' && toUnit === 'mm') {
    return value / MM_TO_INCHES;
  }
  
  return value;
};
