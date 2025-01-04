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

  const renderBreadcrumbs = () => {
    const parts = [];
    const year = selectedDate.getFullYear();
    parts.push(year);

    if (viewLevel !== 'year') {
      parts.push(format(selectedDate, 'MMMM'));
      
      if (viewLevel === 'week' || viewLevel === 'day') {
        parts.push(`Week ${format(selectedDate, 'w')}`);
        
        if (viewLevel === 'day') {
          parts.push(format(selectedDate, 'd'));
        }
      }
    }

    return (
      <div className="text-sm text-text/70 mb-4 px-4">
        <span className="font-medium">Puyallup, WA</span> &gt; {parts.join(' → ')}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rainfall-medium mb-4"></div>
        <div className="text-text/70">Loading rainfall data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <div className="text-red-500 text-center max-w-md">
          <div className="text-xl mb-2">⚠️</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {renderBreadcrumbs()}
      {viewLevel === 'year' ? (
        <YearView
          data={rainfallData}
          selectedDate={selectedDate}
          unit={unit}
          onDateSelect={handleDateSelect}
        />
      ) : viewLevel === 'month' && (
        <MonthView
          data={rainfallData}
          selectedDate={selectedDate}
          unit={unit}
          onDateSelect={handleDateSelect}
        />
      )}
      
      {/* Info Panel */}
      {showInfoPanel && (
        <InfoPanel
          selectedDate={selectedDate}
          data={rainfallData}
          unit={unit}
          onClose={() => setShowInfoPanel(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
