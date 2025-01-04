import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { getColorForAmount } from '../../utils/colors';
import { convertUnit } from '../../utils/units';

interface YearViewProps {
  data: { [key: string]: number };
  selectedDate: Date;
  unit: string;
  onDateSelect: (date: Date) => void;
  onViewChange: (view: 'year' | 'month') => void;
}

const YearView = ({ data, selectedDate, unit, onDateSelect, onViewChange }: YearViewProps) => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(selectedDate.getFullYear(), i, 1);
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    const monthTotal = days.reduce((total, day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return total + (data[dateStr] || 0);
    }, 0);

    return {
      date,
      days,
      total: monthTotal
    };
  });

  return (
    <div className="container mx-auto px-4 flex flex-col items-center">
      <div className="w-full max-w-[1400px]">
        <div className="grid grid-cols-4 gap-10">
          {months.map(({ date, days, total }) => (
            <div key={format(date, 'M')} className="space-y-5">
              <button 
                onClick={() => {
                  onDateSelect(date);
                  onViewChange('month');
                }}
                className="w-full flex justify-between items-baseline p-3 rounded-xl hover:bg-gray-50"
              >
                <h3 className="text-2xl font-bold text-gray-700">
                  {format(date, 'MMMM')}
                </h3>
                <div className="text-xl font-medium text-gray-600">
                  {convertUnit(total, 'mm', unit).toFixed(1)}{unit}
                </div>
              </button>
              
              <div className="grid grid-cols-7 gap-2">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                  <div
                    key={day}
                    className="text-center text-base font-medium text-gray-500"
                    aria-label={day}
                    role="columnheader"
                  >
                    {day[0]}
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
                      className="p-0.5"
                      title={`${format(day, 'MMM d')}: ${convertUnit(amount, 'mm', unit).toFixed(1)}${unit}`}
                    >
                      <div 
                        className="aspect-square rounded-lg transition-shadow hover:shadow-lg"
                        style={{ backgroundColor: color }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YearView;
