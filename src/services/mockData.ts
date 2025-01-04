import { RainfallData } from '../types';
import { addDays, format, parseISO } from 'date-fns';

// Realistic rainfall patterns for Puyallup, WA
// Wetter in winter (Nov-Feb), drier in summer (Jul-Aug)
const MONTHLY_PATTERNS = {
  0: { min: 0, max: 25 },   // Jan: heavy rain
  1: { min: 0, max: 20 },   // Feb: heavy rain
  2: { min: 0, max: 15 },   // Mar: moderate rain
  3: { min: 0, max: 10 },   // Apr: moderate rain
  4: { min: 0, max: 8 },    // May: light rain
  5: { min: 0, max: 5 },    // Jun: light rain
  6: { min: 0, max: 2 },    // Jul: very dry
  7: { min: 0, max: 2 },    // Aug: very dry
  8: { min: 0, max: 5 },    // Sep: light rain
  9: { min: 0, max: 15 },   // Oct: moderate rain
  10: { min: 0, max: 25 },  // Nov: heavy rain
  11: { min: 0, max: 25 },  // Dec: heavy rain
};

// Generate random number between min and max
const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Add some randomness to make it look more natural
const addNoise = (value: number) => {
  const noise = random(-1, 1);
  return Math.max(0, value + noise);
};

export const generateMockData = (year: number): RainfallData[] => {
  const startDate = new Date(year, 0, 1);
  const data: RainfallData[] = [];
  
  // Generate data for each day of the year
  for (let i = 0; i < 365 + (year % 4 === 0 ? 1 : 0); i++) {
    const currentDate = addDays(startDate, i);
    const month = currentDate.getMonth();
    const { min, max } = MONTHLY_PATTERNS[month];
    
    // Generate rainfall with 30% chance of no rain
    const hasRain = Math.random() > 0.3;
    const amount = hasRain ? addNoise(random(min, max)) : 0;
    
    data.push({
      date: format(currentDate, 'yyyy-MM-dd'),
      amount: Number(amount.toFixed(1)),
      quality: 'standard'
    });
  }
  
  return data;
};

// Cache for mock data
const mockDataCache = new Map<number, RainfallData[]>();

export const getMockRainfallData = (
  startDate: string,
  endDate: string
): RainfallData[] => {
  const year = parseISO(startDate).getFullYear();
  
  if (!mockDataCache.has(year)) {
    mockDataCache.set(year, generateMockData(year));
  }
  
  const yearData = mockDataCache.get(year)!;
  
  // Filter data for the requested date range
  return yearData.filter(
    item => item.date >= startDate && item.date <= endDate
  );
};
