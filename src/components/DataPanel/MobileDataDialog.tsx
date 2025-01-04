import { format } from 'date-fns';
import { convertUnit } from '../../utils/units';

interface MobileDataDialogProps {
  date: Date;
  data: { [key: string]: number };
  unit: string;
  onClose: () => void;
  isOpen: boolean;
}

const MobileDataDialog = ({ date, data, unit, onClose, isOpen }: MobileDataDialogProps) => {
  if (!isOpen) return null;

  const dateStr = format(date, 'yyyy-MM-dd');
  const amount = data[dateStr] || 0;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" onClick={onClose}>
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 shadow-lg">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {format(date, 'MMMM d, yyyy')}
              </h2>
              <p className="text-sm text-gray-500">Daily rainfall data</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-500"
            >
              ✕
            </button>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900">
              {convertUnit(amount, 'mm', unit).toFixed(1)}
            </span>
            <span className="text-xl text-gray-600">{unit}</span>
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
        </div>
      </div>
    </div>
  );
};

export default MobileDataDialog;
