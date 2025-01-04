import { format } from 'date-fns';
import { RainfallData } from '../../types';
import { formatRainfall } from '../../utils/colorScale';

interface InfoPanelProps {
  selectedDate: Date;
  data: RainfallData[];
  unit: 'mm' | 'inches';
  onClose: () => void;
}

const InfoPanel = ({ selectedDate, data, unit, onClose }: InfoPanelProps) => {
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayData = data.find(d => d.date === dateStr);
  
  // Calculate some statistics for context
  const monthData = data.filter(d => d.date.startsWith(format(selectedDate, 'yyyy-MM')));
  const monthTotal = monthData.reduce((sum, d) => sum + d.amount, 0);
  const monthAverage = monthTotal / monthData.length;
  const daysWithRain = monthData.filter(d => d.amount > 0).length;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text/50 hover:text-text transition-colors"
          aria-label="Close panel"
        >
          ✕
        </button>
        
        {/* Header */}
        <div className="p-6 border-b border-gridlines">
          <h2 className="text-2xl font-medium">
            {format(selectedDate, 'MMMM d, yyyy')}
          </h2>
          <p className="text-text/70 mt-1">
            {format(selectedDate, 'EEEE')}
          </p>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Daily rainfall */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Daily Rainfall</h3>
            <div className="text-3xl font-bold text-rainfall-medium">
              {formatRainfall(dayData?.amount || 0, unit)}
            </div>
          </div>
          
          {/* Monthly context */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Monthly Context</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gridlines/30 rounded-lg p-4">
                <div className="text-sm text-text/70 mb-1">Monthly Total</div>
                <div className="text-lg font-medium">
                  {formatRainfall(monthTotal, unit)}
                </div>
              </div>
              <div className="bg-gridlines/30 rounded-lg p-4">
                <div className="text-sm text-text/70 mb-1">Daily Average</div>
                <div className="text-lg font-medium">
                  {formatRainfall(monthAverage, unit)}
                </div>
              </div>
            </div>
            <div className="bg-gridlines/30 rounded-lg p-4">
              <div className="text-sm text-text/70 mb-1">Days with Rain</div>
              <div className="text-lg font-medium">
                {daysWithRain} of {monthData.length} days
                <span className="text-sm text-text/70 ml-1">
                  ({Math.round(daysWithRain / monthData.length * 100)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
