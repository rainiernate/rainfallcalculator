import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarViewProps, RainfallData } from '../../types';
import { getMockRainfallData } from '../../services/mockData';
import YearView from './YearView';
import MonthView from './MonthView';
import InfoPanel from '../InfoPanel/InfoPanel';

const Calendar = ({ viewLevel, selectedDate, unit, onDateSelect }: CalendarViewProps) => {
  const [rainfallData, setRainfallData] = useState<RainfallData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const year = selectedDate.getFullYear();
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        
        // Use mock data instead of API
        const data = getMockRainfallData(startDate, endDate);
        setRainfallData(data);
      } catch (err) {
        setError('Failed to load rainfall data. Please try again later.');
        console.error('Error loading rainfall data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate.getFullYear()]);

  const handleDateSelect = (date: Date) => {
    onDateSelect(date);
    setShowInfoPanel(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        <div className="mt-4 text-sm text-gray-600">Loading rainfall data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px]">
        <div className="text-red-500 text-center max-w-md">
          <div className="text-xl mb-2">⚠️</div>
          <div className="text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Location and Navigation Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-600 mb-6">
        <span className="font-medium text-gray-900">Puyallup, WA</span>
        <span className="mx-2">→</span>
        {format(selectedDate, viewLevel === 'year' ? 'yyyy' : 'MMMM yyyy')}
      </div>

      {/* Calendar Content */}
      <div className="flex justify-center">
        <div className="w-full">
          {viewLevel === 'year' ? (
            <YearView
              data={rainfallData}
              selectedDate={selectedDate}
              unit={unit}
              onDateSelect={handleDateSelect}
            />
          ) : (
            <MonthView
              data={rainfallData}
              selectedDate={selectedDate}
              unit={unit}
              onDateSelect={handleDateSelect}
            />
          )}
        </div>
      </div>

      {/* Info Panel (shown conditionally) */}
      {showInfoPanel && (
        <InfoPanel
          data={rainfallData}
          date={selectedDate}
          unit={unit}
          onClose={() => setShowInfoPanel(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
