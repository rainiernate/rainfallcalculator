import { useMemo } from 'react';
import { addDays, startOfYear, format, isSameDay, startOfMonth, endOfMonth, getDay } from 'date-fns';
import { RainfallData } from '../../types';
import { calculateColor, formatRainfall } from '../../utils/colorScale';

interface YearViewProps {
  data: RainfallData[];
  selectedDate: Date;
  unit: 'mm' | 'inches';
  onDateSelect: (date: Date) => void;
}

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const YearView = ({ data, selectedDate, unit, onDateSelect }: YearViewProps) => {
  const yearData = useMemo(() => {
    const year = selectedDate.getFullYear();
    const startDate = startOfYear(new Date(year, 0, 1));
    const days = [];
    const dataMap = new Map(data.map(d => [d.date.split('T')[0], d.amount]));

    for (let i = 0; i < 365 + (year % 4 === 0 ? 1 : 0); i++) {
      const date = addDays(startDate, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const rainfall = dataMap.get(dateStr) || 0;

      days.push({
        date,
        rainfall,
        color: calculateColor(rainfall),
        monthIndex: date.getMonth(),
        dayOfMonth: date.getDate(),
      });
    }

    return days;
  }, [data, selectedDate]);

  const months = useMemo(() => {
    const year = selectedDate.getFullYear();
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const monthStart = startOfMonth(new Date(year, monthIndex, 1));
      const monthEnd = endOfMonth(monthStart);
      const startDayOfWeek = getDay(monthStart);
      
      // Create array for all days in the month grid
      const daysGrid = [];
      
      // Add empty cells for days before the start of the month
      for (let i = 0; i < startDayOfWeek; i++) {
        daysGrid.push(null);
      }
      
      // Add the actual days of the month
      const monthDays = yearData.filter(day => day.monthIndex === monthIndex);
      daysGrid.push(...monthDays);
      
      // Add empty cells to complete the grid if needed
      while (daysGrid.length < 42) { // 6 rows * 7 days
        daysGrid.push(null);
      }

      return {
        name: format(monthStart, 'MMM'),
        days: daysGrid,
      };
    });
  }, [yearData, selectedDate]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[1200px] p-4">
        <div className="grid grid-cols-4 gap-6">
          {months.map((month, monthIndex) => (
            <div key={monthIndex} className="bg-white rounded-lg p-2 shadow-sm">
              <div className="text-center text-sm font-medium mb-2 text-text/70">
                {month.name}
              </div>
              
              {/* Days of week headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="text-center text-xs font-medium text-text/50">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {month.days.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      aspect-square rounded-sm
                      ${!day ? 'bg-transparent' : `
                        cursor-pointer
                        hover:ring-2 hover:ring-text/20 
                        transition-all
                        flex items-center justify-center text-xs
                        ${day.color === 'rainfall-none' ? 'bg-rainfall-none' : 
                          day.color === 'rainfall-light' ? 'bg-rainfall-light' :
                          day.color === 'rainfall-medium' ? 'bg-rainfall-medium' :
                          'bg-rainfall-heavy'}
                        ${isSameDay(day.date, selectedDate) ? 'ring-2 ring-text' : ''}
                      `}
                    `}
                    onClick={() => day && onDateSelect(day.date)}
                    title={day ? `${format(day.date, 'MMM d, yyyy')}: ${formatRainfall(day.rainfall, unit)}` : ''}
                  >
                    {day?.dayOfMonth}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearView;
