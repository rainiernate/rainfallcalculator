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
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto flex gap-4">
        <main className="flex-1 min-w-0">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">
                {calendarState.viewLevel === 'year' 
                  ? calendarState.selectedDate.getFullYear()
                  : format(calendarState.selectedDate, 'MMMM yyyy')}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => handleYearChange(-1)}
                  className="p-2 hover:bg-gray-50 rounded"
                >
                  ←
                </button>
                {calendarState.viewLevel === 'month' && (
                  <button
                    onClick={() => handleViewChange('year')}
                    className="px-3 py-1 text-sm hover:bg-gray-50 rounded"
                  >
                    Year View
                  </button>
                )}
                <button
                  onClick={() => handleYearChange(1)}
                  className="p-2 hover:bg-gray-50 rounded"
                >
                  →
                </button>
                <button
                  onClick={handleUnitToggle}
                  className="px-4 py-2 text-lg font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  {calendarState.unit.toUpperCase()}
                </button>
              </div>
            </div>

            {calendarState.viewLevel === 'year' ? (
              <YearView
                data={rainfallData}
                selectedDate={calendarState.selectedDate}
                unit={calendarState.unit}
                onDateSelect={handleDateSelect}
                onViewChange={handleViewChange}
              />
            ) : (
              <MonthView
                data={rainfallData}
                selectedDate={calendarState.selectedDate}
                unit={calendarState.unit}
                onDateSelect={handleDateSelect}
              />
            )}
          </div>
        </main>

        <aside className="w-80 border-l border-gridlines p-4">
          <DataPanel
            data={rainfallData}
            selectedDate={calendarState.selectedDate}
            unit={calendarState.unit}
          />
        </aside>
      </div>
    </div>
  );
}

export default App;
