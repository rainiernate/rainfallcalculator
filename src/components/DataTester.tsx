import { useState } from 'react';
import { testDataAvailability } from '../services/noaaApi';

const DataTester = () => {
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Override console.log to capture output
  const originalLog = console.log;
  console.log = (...args) => {
    originalLog(...args);
    setLogs(prev => [...prev, args.join(' ')]);
  };

  const handleTest = async () => {
    setTesting(true);
    setLogs([]);
    try {
      await testDataAvailability();
    } finally {
      setTesting(false);
      // Restore original console.log
      console.log = originalLog;
    }
  };

  return (
    <>
      <button
        onClick={handleTest}
        disabled={testing}
        className="w-full bg-rainfall-medium text-white px-4 py-2 rounded-lg shadow-lg hover:bg-rainfall-medium/80 transition-colors"
      >
        {testing ? 'Testing...' : 'Test API Data'}
      </button>
      
      {logs.length > 0 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gridlines flex justify-between items-center">
              <h2 className="text-lg font-medium">Data Availability Test Results</h2>
              <button
                onClick={() => setLogs([])}
                className="text-text/50 hover:text-text transition-colors"
              >
                ✕
              </button>
            </div>
            <pre className="p-4 text-sm font-mono whitespace-pre-wrap">
              {logs.join('\n')}
            </pre>
          </div>
        </div>
      )}
    </>
  );
};

export default DataTester;
