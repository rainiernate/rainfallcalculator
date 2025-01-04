import React from 'react';
import { format } from 'date-fns';

interface DataPanelProps {
  data: { [key: string]: number };
  selectedDate: Date;
}

const DataPanel: React.FC<DataPanelProps> = ({ data, selectedDate }) => {
  // Convert data object to array and sort by date
  const sortedData = Object.entries(data)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="fixed right-4 top-24 w-80 bg-white shadow-lg rounded-lg p-4 overflow-auto max-h-[calc(100vh-120px)]">
      <h2 className="text-lg font-medium mb-4">Raw Data</h2>
      
      {/* Current Selection */}
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-1">Selected Date</h3>
        <p className="text-sm text-blue-800">
          {format(selectedDate, 'MMMM d, yyyy')}
        </p>
        <p className="text-sm text-blue-800 mt-1">
          Rainfall: {data[format(selectedDate, 'yyyy-MM-dd')] || 0}mm
        </p>
      </div>

      {/* Data List */}
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-2 text-sm font-medium text-gray-500 mb-2">
          <div>Date</div>
          <div>Rainfall (mm)</div>
        </div>
        {sortedData.map(({ date, amount }) => (
          <div 
            key={date}
            className="grid grid-cols-2 gap-2 text-sm py-1 border-b border-gray-100"
          >
            <div>{format(new Date(date), 'MMM d')}</div>
            <div>{amount.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Data Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-medium mb-2">Summary</h3>
        <div className="text-sm text-gray-600">
          <p>Total Records: {sortedData.length}</p>
          <p>Total Rainfall: {sortedData.reduce((sum, { amount }) => sum + amount, 0).toFixed(2)}mm</p>
          <p>Days with Rain: {sortedData.filter(({ amount }) => amount > 0).length}</p>
        </div>
      </div>
    </div>
  );
};

export default DataPanel;
