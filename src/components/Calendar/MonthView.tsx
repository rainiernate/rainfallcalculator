import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { useState } from 'react';
import { getColorForAmount } from '../../utils/colors';
import { convertUnit } from '../../utils/units';
import MobileDataDialog from '../DataPanel/MobileDataDialog';

interface MonthViewProps {
  data: { [key: string]: number };
  selectedDate: Date;
  unit: string;
  onDateSelect: (date: Date) => void;
}

const MonthView = ({ data, selectedDate, unit, onDateSelect }: MonthViewProps) => {
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const monthTotal = days.reduce((total, day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return total + (data[dateStr] || 0);
  }, 0);

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    // Only show mobile dialog on smaller screens
    if (window.innerWidth < 1024) {
      setShowMobileDialog(true);
    }
  };

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <div className="text-right text-base sm:text-xl font-medium text-gray-600">
        Monthly Total: {convertUnit(monthTotal, 'mm', unit).toFixed(1)}{unit}
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="text-center text-xs sm:text-sm md:text-base font-medium text-gray-600 pb-1 sm:pb-2"
          >
            {window.innerWidth < 640 ? day[0] : day}
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
              onClick={() => handleDateClick(day)}
              className="p-0.5 sm:p-1"
              title={`${format(day, 'MMM d')}: ${convertUnit(amount, 'mm', unit).toFixed(1)}${unit}`}
            >
              <div 
                className="aspect-square rounded-lg sm:rounded-xl flex flex-col items-center justify-start p-1 sm:p-2 md:p-4 transition-shadow hover:shadow-lg"
                style={{ backgroundColor: color }}
              >
                <span className="text-sm sm:text-xl md:text-2xl lg:text-3xl font-bold">
                  {format(day, 'd')}
                </span>
                {amount > 0 && window.innerWidth >= 640 && (
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg font-medium mt-1">
                    {convertUnit(amount, 'mm', unit).toFixed(1)}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <MobileDataDialog
        date={selectedDate}
        data={data}
        unit={unit}
        isOpen={showMobileDialog}
        onClose={() => setShowMobileDialog(false)}
      />
    </div>
  );
};

export default MonthView;
