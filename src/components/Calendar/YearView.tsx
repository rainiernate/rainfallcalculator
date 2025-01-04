import { format } from 'date-fns';
import { useState } from 'react';
import { getColorForAmount } from '../../utils/colors';
import { convertUnit } from '../../utils/units';
import MobileDataDialog from '../DataPanel/MobileDataDialog';

interface YearViewProps {
  data: { [key: string]: number };
  selectedDate: Date;
  unit: string;
  onDateSelect: (date: Date) => void;
  onViewChange: (view: 'year' | 'month') => void;
}

const YearView = ({ data, selectedDate, unit, onDateSelect, onViewChange }: YearViewProps) => {
  const [showMobileDialog, setShowMobileDialog] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(selectedDate.getFullYear(), i, 1);
    const days = [];
    const tempDate = new Date(date);

    while (tempDate.getMonth() === i) {
      days.push(new Date(tempDate));
      tempDate.setDate(tempDate.getDate() + 1);
    }

    const total = days.reduce((sum, day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      return sum + (data[dateStr] || 0);
    }, 0);

    return { date, days, total };
  });

  const handleMonthClick = (date: Date) => {
    onDateSelect(date);
    onViewChange('month');
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
    // Only show mobile dialog on smaller screens
    if (window.innerWidth < 1024) {
      setShowMobileDialog(true);
    }
  };

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {months.map((month) => (
        <div key={format(month.date, 'M')} className="space-y-3 sm:space-y-4">
          <button
            className="w-full flex justify-between items-baseline p-2 sm:p-3 rounded-xl hover:bg-gray-50"
            onClick={() => handleMonthClick(month.date)}
          >
            <h3 className="text-lg sm:text-xl font-bold text-gray-700">{format(month.date, 'MMMM')}</h3>
            <div className="text-base sm:text-lg font-medium text-gray-600">
              {convertUnit(month.total, 'mm', unit).toFixed(1)}{unit}
            </div>
          </button>

          <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-xs sm:text-sm font-medium text-gray-500"
                aria-label={day}
                role="columnheader"
              >
                {window.innerWidth < 640 ? day[0] : day[0]}
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
                  onClick={() => handleDateClick(day)}
                  title={`${format(day, 'MMM d')}: ${convertUnit(amount, 'mm', unit).toFixed(1)}${unit}`}
                >
                  <div
                    className="aspect-square rounded-lg transition-shadow hover:shadow-lg relative"
                    style={{ backgroundColor: color }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs sm:text-sm font-normal text-gray-600">
                      {format(day, 'd')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}

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

export default YearView;
