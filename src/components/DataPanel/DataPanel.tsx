import { format } from 'date-fns';
import { convertUnit } from '../../utils/units';

interface DataPanelProps {
  date: Date;
  data: { [key: string]: number };
  unit: string;
  loading?: boolean;
}

const DataPanel = ({ date, data, unit, loading }: DataPanelProps) => {
  const dateStr = format(date, 'yyyy-MM-dd');
  const amount = data[dateStr] || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            {format(date, 'MMMM d, yyyy')}
          </h2>
          <p className="text-sm text-gray-500">Daily rainfall data</p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {convertUnit(amount, 'mm', unit).toFixed(1)}
              </span>
              <span className="text-lg text-gray-600">{unit}</span>
            </div>

            {amount > 0 ? (
              <p className="text-gray-600">
                Rainfall recorded for this date.
              </p>
            ) : (
              <p className="text-gray-500">
                No rainfall recorded for this date.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataPanel;
