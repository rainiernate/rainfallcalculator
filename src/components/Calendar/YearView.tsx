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

  const handleMonthClick = (index: number) => {
    onDateSelect(months[index].date);
    onViewChange('month');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
      {months.map((month, index) => (
        <div key={format(month.date, 'M')} className="space-y-4">
          <button
            className="w-full flex justify-between items-baseline p-3 rounded-xl hover:bg-gray-50"
            onClick={() => handleMonthClick(index)}
          >
            <h3 className="text-xl font-bold text-gray-700">{format(month.date, 'MMMM')}</h3>
            <div className="text-lg font-medium text-gray-600">
              {convertUnit(month.total, 'mm', unit).toFixed(1)}{unit}
            </div>
          </button>

          <div className="grid grid-cols-7 gap-1.5">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-500"
                aria-label={day}
                role="columnheader"
              >
                {day[0]}
              </div>
            ))}

            {/* Empty cells for alignment */}
            {[...Array(month.days[0].getDay())].map((_, i) => (
              <div key={`empty-${i}`}></div>
            ))}

            {/* Date cells */}
            {month.days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const amount = data[dateStr] || 0;
              const color = getColorForAmount(amount);

              return (
                <button
                  key={dateStr}
                  className="p-0.5"
                  onClick={() => onDateSelect(day)}
                  title={`${format(day, 'MMM d')}: ${convertUnit(amount, 'mm', unit).toFixed(1)}${unit}`}
                >
                  <div
                    className="aspect-square rounded-lg transition-shadow hover:shadow-lg"
                    style={{ backgroundColor: color }}
                  ></div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YearView;
