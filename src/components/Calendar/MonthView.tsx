import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { getColorForAmount } from '../../utils/colors';
import { convertUnit } from '../../utils/units';

interface MonthViewProps {
  data: { [key: string]: number };
  selectedDate: Date;
  unit: string;
  onDateSelect: (date: Date) => void;
}

const MonthView = ({ data, selectedDate, unit, onDateSelect }: MonthViewProps) => {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const monthTotal = days.reduce((total, day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return total + (data[dateStr] || 0);
  }, 0);

  return (
    <div className="container mx-auto px-4 flex flex-col items-center">
      <div className="w-full max-w-[1400px] space-y-8">
        <div className="text-right text-2xl font-medium text-gray-600">
          Monthly Total: {convertUnit(monthTotal, 'mm', unit).toFixed(1)}{unit}
        </div>
        
        <div className="grid grid-cols-7 gap-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div
              key={day}
              className="text-center text-2xl font-medium text-gray-600 pb-2"
            >
              {day}
            </div>
          ))}

          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const amount = data[dateStr] || 0;
            const color = getColorForAmount(amount);

            return (
              <button
                key={dateStr}
                onClick={() => onDateSelect(day)}
                className="p-1.5"
                title={`${format(day, 'MMM d')}: ${convertUnit(amount, 'mm', unit).toFixed(1)}${unit}`}
              >
                <div 
                  className="aspect-square rounded-xl flex flex-col items-center justify-start p-4 transition-shadow hover:shadow-xl"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-4xl font-bold mb-2">{format(day, 'd')}</span>
                  {amount > 0 && (
                    <span className="text-xl font-medium">
                      {convertUnit(amount, 'mm', unit).toFixed(1)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MonthView;
