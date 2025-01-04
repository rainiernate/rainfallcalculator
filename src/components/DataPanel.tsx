import React from 'react';
import { format } from 'date-fns';
import { convertUnit } from '../utils/units';

interface DataPanelProps {
  date: Date;
  data: { [key: string]: number };
  unit: string;
  loading?: boolean;
}

const DataPanel: React.FC<DataPanelProps> = ({ data, date, unit, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Convert data object to array and sort by date
  const sortedData = Object.entries(data)
    .map(([dateStr, amount]) => ({ date: dateStr, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const dateStr = format(date, 'yyyy-MM-dd');
  const amount = data[dateStr] || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Rainfall Data</h2>
      
      {/* Current Selection */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Selected Date</h3>
        <p className="text-sm text-blue-800">
          {format(date, 'MMMM d, yyyy')}
        </p>
        <p className="text-sm text-blue-800 mt-2 font-medium">
          Rainfall: {convertUnit(amount, 'mm', unit).toFixed(2)} {unit}
        </p>
      </div>

      {/* Data List */}
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-4 text-sm font-medium text-gray-500 mb-3 px-1">
          <div>Date</div>
          <div>Rainfall ({unit})</div>
        </div>
        <div className="space-y-1 max-h-[400px] overflow-y-auto">
          {sortedData.map(({ date: itemDate, amount }) => (
            <div 
              key={itemDate}
              className={`grid grid-cols-2 gap-4 text-sm py-2 px-1 border-b border-gray-100 ${
                itemDate === dateStr ? 'bg-blue-50' : ''
              }`}
            >
              <div>{format(new Date(itemDate), 'MMM d, yyyy')}</div>
              <div>{convertUnit(amount, 'mm', unit).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
