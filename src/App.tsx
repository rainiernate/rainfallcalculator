import { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { CalendarState } from './types';
import DataPanel from './components/DataPanel';
import { fetchRainfallData } from './services/noaaApi';
import YearView from './components/Calendar/YearView';
import MonthView from './components/Calendar/MonthView';

function App() {
  const [calendarState, setCalendarState] = useState<CalendarState>({
    selectedDate: new Date(2024, 0, 1), // Start with January 2024
    viewLevel: 'year',
    unit: 'in'
  });

  // Cache for storing fetched data
  const [dataCache, setDataCache] = useState<{
    [key: string]: {
      data: { [key: string]: number };
      timestamp: number;
    };
  }>({});

  const [rainfallData, setRainfallData] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);

  // Fetch data for the selected year
  useEffect(() => {
    const fetchYearData = async () => {
      const year = calendarState.selectedDate.getFullYear();
      setLoading(true);
      try {
        // Fetch data for the selected year
        const data = await fetchRainfallData(`${year}-01-01`, `${year}-12-31`);
        
        // Convert array to object with date keys
        const dataMap = data.reduce((acc, item) => {
          acc[item.date] = item.amount;
          return acc;
        }, {} as {[key: string]: number});

        setRainfallData(dataMap);

        // Cache the data
        setDataCache(prev => ({
          ...prev,
          [year]: {
            data: dataMap,
            timestamp: Date.now()
          }
        }));
      } catch (error) {
        console.error('Error fetching rainfall data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check if we have cached data for the selected year
    const year = calendarState.selectedDate.getFullYear();
    const cachedData = dataCache[year];
    if (cachedData && (Date.now() - cachedData.timestamp) < 60 * 60 * 1000) {
      setRainfallData(cachedData.data);
    } else {
      fetchYearData();
    }
  }, [calendarState.selectedDate.getFullYear()]); // Fetch when year changes

  const handleYearChange = (delta: number) => {
    setCalendarState(prev => ({
      ...prev,
      selectedDate: new Date(prev.selectedDate.getFullYear() + delta, 0, 1)
    }));
  };

  const handleMonthChange = (delta: number) => {
    setCalendarState(prev => ({
      ...prev,
      selectedDate: addMonths(prev.selectedDate, delta)
    }));
  };

  const handleDateSelect = (date: Date) => {
    setCalendarState(prev => ({
      ...prev,
      selectedDate: date
    }));
  };

  const handleViewChange = (view: 'year' | 'month') => {
    setCalendarState(prev => ({
      ...prev,
      viewLevel: view
    }));
  };

  const handleUnitToggle = () => {
    setCalendarState(prev => ({
      ...prev,
      unit: prev.unit === 'mm' ? 'in' : 'mm'
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200">
        <div className="w-full px-3 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Rainfall Calendar</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={handleUnitToggle}
                className="px-2 sm:px-3 py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700"
              >
                {calendarState.unit.toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full py-4 sm:py-8">
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-8">
            {/* Calendar Section */}
            <div className="w-full lg:flex-1 min-w-0">
              <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-6">
                {/* View Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => calendarState.viewLevel === 'year' ? handleYearChange(-1) : handleMonthChange(-1)}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      ←
                    </button>
                    <h2 className="text-lg sm:text-xl font-medium">
                      {calendarState.viewLevel === 'year' 
                        ? calendarState.selectedDate.getFullYear()
                        : format(calendarState.selectedDate, 'MMMM yyyy')}
                    </h2>
                    <button
                      onClick={() => calendarState.viewLevel === 'year' ? handleYearChange(1) : handleMonthChange(1)}
                      className="p-2 rounded-md hover:bg-gray-100"
                    >
                      →
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewChange('year')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        calendarState.viewLevel === 'year'
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      Year
                    </button>
                    <button
                      onClick={() => handleViewChange('month')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        calendarState.viewLevel === 'month'
                          ? 'bg-blue-100 text-blue-700'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      Month
                    </button>
                  </div>
                </div>

                {/* Calendar View */}
                {calendarState.viewLevel === 'year' ? (
                  <YearView
                    selectedDate={calendarState.selectedDate}
                    onDateSelect={handleDateSelect}
                    data={rainfallData}
                    unit={calendarState.unit}
                  />
                ) : (
                  <MonthView
                    selectedDate={calendarState.selectedDate}
                    onDateSelect={handleDateSelect}
                    data={rainfallData}
                    unit={calendarState.unit}
                  />
                )}
              </div>
            </div>

            {/* Data Panel - Only show on desktop */}
            <div className="hidden lg:block w-96">
              <div className="sticky top-4">
                <DataPanel
                  date={calendarState.selectedDate}
                  data={rainfallData}
                  unit={calendarState.unit}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
