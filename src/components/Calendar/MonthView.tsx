import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  getDay,
} from 'date-fns';
import { RainfallData } from '../../types';
import { calculateColor, formatRainfall } from '../../utils/colorScale';

interface MonthViewProps {
  data: RainfallData[];
  selectedDate: Date;
  unit: 'mm' | 'inches';
  onDateSelect: (date: Date) => void;
}

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MonthView = ({ data, selectedDate, unit, onDateSelect }: MonthViewProps) => {
  const monthData = useMemo(() => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const startWeekday = getDay(monthStart);
    
    // Get all days in the month
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Create a map of date strings to rainfall amounts
    const rainfallMap = new Map(
      data.map(d => [d.date, d])
    );
    
    // Add empty cells before the first day of the month
    const calendarDays = [];
    for (let i = 0; i < startWeekday; i++) {
      calendarDays.push(null);
    }
    
    // Add the actual days with their rainfall data
    daysInMonth.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const rainfall = rainfallMap.get(dateStr);
      calendarDays.push({
        date,
        rainfall: rainfall?.amount || 0,
        color: calculateColor(rainfall?.amount || 0),
      });
    });
    
    // Add empty cells to complete the last week if needed
    while (calendarDays.length % 7 !== 0) {
      calendarDays.push(null);
    }
    
    return calendarDays;
  }, [data, selectedDate]);

  return (
    <div className="min-w-[1200px] p-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-2xl font-medium mb-8 text-center">
          {format(selectedDate, 'MMMM yyyy')}
        </div>
        
        {/* Day of week headers */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {DAYS_OF_WEEK.map(day => (
            <div
              key={day}
              className="text-base font-medium text-text/70 text-center"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-4">
          {monthData.map((day, index) => (
            <div
              key={index}
              className={`
                aspect-square rounded-lg p-3
                ${!day ? 'bg-transparent' : `
                  cursor-pointer
                  hover:ring-2 hover:ring-text/20
                  transition-all
                  ${day.color === 'rainfall-none' ? 'bg-rainfall-none' : 
                    day.color === 'rainfall-light' ? 'bg-rainfall-light' :
                    day.color === 'rainfall-medium' ? 'bg-rainfall-medium' :
                    'bg-rainfall-heavy'}
                  ${day.date && isSameDay(day.date, selectedDate) ? 'ring-2 ring-text' : ''}
                `}
              `}
              onClick={() => day?.date && onDateSelect(day.date)}
            >
              {day && (
                <div className="h-full flex flex-col justify-between">
                  <div className="text-lg font-medium">
                    {format(day.date, 'd')}
                  </div>
                  <div className="text-sm text-text/70">
                    {formatRainfall(day.rainfall, unit)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
