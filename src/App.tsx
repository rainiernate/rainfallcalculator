import { useState } from 'react';
import { CalendarState, ViewLevel } from './types';
import Calendar from './components/Calendar';
import { addYears, subYears, addMonths, subMonths } from 'date-fns';

function App() {
  const [calendarState, setCalendarState] = useState<CalendarState>({
    viewLevel: 'year',
    selectedDate: new Date(2023, 0, 1), // Start with 2023 as it should have data
    unit: 'mm',
    year: 2023,
  });

  const handleDateSelect = (date: Date) => {
    setCalendarState(prev => ({
      ...prev,
      selectedDate: date,
    }));
  };

  const handleYearChange = (delta: number) => {
    const newDate = delta > 0 
      ? addYears(calendarState.selectedDate, delta)
      : subYears(calendarState.selectedDate, Math.abs(delta));
    
    setCalendarState(prev => ({
      ...prev,
      selectedDate: newDate,
      year: newDate.getFullYear(),
    }));
  };

  const handleMonthChange = (delta: number) => {
    const newDate = delta > 0
      ? addMonths(calendarState.selectedDate, delta)
      : subMonths(calendarState.selectedDate, Math.abs(delta));
    
    setCalendarState(prev => ({
      ...prev,
      selectedDate: newDate,
      year: newDate.getFullYear(),
    }));
  };

  const handleViewLevelChange = (level: ViewLevel) => {
    setCalendarState(prev => ({
      ...prev,
      viewLevel: level,
    }));
  };

  const handleUnitToggle = () => {
    setCalendarState(prev => ({
      ...prev,
      unit: prev.unit === 'mm' ? 'inches' : 'mm',
    }));
  };

  return (
    <div className="min-h-screen bg-background text-text">
      <header className="py-4 px-6 border-b border-gridlines bg-white shadow-sm">
        <div className="max-w-[1400px] mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Rainfall Calendar</h1>
          <div className="flex items-center space-x-6">
            {/* Date Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => calendarState.viewLevel === 'year' 
                  ? handleYearChange(-1) 
                  : handleMonthChange(-1)
                }
                className="p-2 rounded-md hover:bg-gridlines transition-colors"
                aria-label={calendarState.viewLevel === 'year' ? "Previous Year" : "Previous Month"}
              >
                ←
              </button>
              <span className="text-lg font-medium min-w-[120px] text-center">
                {calendarState.viewLevel === 'year' 
                  ? calendarState.selectedDate.getFullYear()
                  : new Intl.DateTimeFormat('en-US', { 
                      month: 'long',
                      year: 'numeric'
                    }).format(calendarState.selectedDate)
                }
              </span>
              <button
                onClick={() => calendarState.viewLevel === 'year'
                  ? handleYearChange(1)
                  : handleMonthChange(1)
                }
                className="p-2 rounded-md hover:bg-gridlines transition-colors"
                aria-label={calendarState.viewLevel === 'year' ? "Next Year" : "Next Month"}
              >
                →
              </button>
            </div>

            {/* View Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewLevelChange('year')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  calendarState.viewLevel === 'year'
                    ? 'bg-rainfall-medium text-white'
                    : 'bg-gridlines hover:bg-gridlines/80'
                }`}
              >
                Year
              </button>
              <button
                onClick={() => handleViewLevelChange('month')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  calendarState.viewLevel === 'month'
                    ? 'bg-rainfall-medium text-white'
                    : 'bg-gridlines hover:bg-gridlines/80'
                }`}
              >
                Month
              </button>
            </div>

            {/* Unit Toggle */}
            <button
              onClick={handleUnitToggle}
              className="px-4 py-2 rounded-md bg-gridlines hover:bg-gridlines/80 transition-colors"
            >
              {calendarState.unit.toUpperCase()}
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <Calendar
            data={[]} // This will be populated by the Calendar component
            viewLevel={calendarState.viewLevel}
            selectedDate={calendarState.selectedDate}
            unit={calendarState.unit}
            onDateSelect={handleDateSelect}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
