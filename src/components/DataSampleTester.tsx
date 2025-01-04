import { useState } from 'react';
import { format } from 'date-fns';
import axios from 'axios';

const API_BASE_URL = 'https://www.ncei.noaa.gov/access/services/data/v1';

interface RainfallSample {
  date: string;
  PRCP: number;
  TMAX: number;
  TMIN: number;
  name?: string;
  latitude?: number;
  longitude?: number;
}

interface WeatherRecord {
  DATE: string;
  STATION: string;
  LONGITUDE: string;
  LATITUDE: string;
  NAME: string;
  ELEVATION: string;
  PRCP: string;
  TMAX: string;
  TMIN: string;
}

const processWeatherData = (record: WeatherRecord) => ({
  date: record.DATE,
  rainfall: parseFloat(record.PRCP.trim()) / 10, // Convert from tenths of mm to mm
  temperature: {
    max: parseFloat(record.TMAX.trim()) / 10, // Convert from tenths of °C to °C
    min: parseFloat(record.TMIN.trim()) / 10
  },
  station: {
    name: record.NAME,
    longitude: parseFloat(record.LONGITUDE),
    latitude: parseFloat(record.LATITUDE),
    elevation: parseFloat(record.ELEVATION)
  }
});

const DataSampleTester = () => {
  const [testing, setTesting] = useState(false);
  const [samples, setSamples] = useState<RainfallSample[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [stationInfo, setStationInfo] = useState<{name?: string; latitude?: number; longitude?: number} | null>(null);

  const fetchSampleData = async () => {
    setTesting(true);
    setError(null);
    setSamples([]);
    setStationInfo(null);

    try {
      const response = await axios.get(API_BASE_URL, {
        params: {
          dataset: 'daily-summaries',
          stations: 'USW00014739',
          startDate: '2023-01-01',
          endDate: '2023-01-31',
          dataTypes: 'TMAX,TMIN,PRCP',
          format: 'json',
          includeStationName: true,
          includeStationLocation: true
        }
      });

      console.log('API Response:', response.data);

      if (!response.data || response.data.length === 0) {
        setError('No data available for this period');
        return;
      }

      // Extract station info from first record
      if (response.data[0]) {
        setStationInfo({
          name: response.data[0].name,
          latitude: response.data[0].latitude,
          longitude: response.data[0].longitude
        });
      }

      // Convert and sort the data
      const weatherData = response.data
        .map((record: WeatherRecord) => processWeatherData(record))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setSamples(weatherData.map((sample) => ({
        date: sample.date,
        PRCP: sample.rainfall,
        TMAX: sample.temperature.max,
        TMIN: sample.temperature.min,
        name: sample.station.name,
        latitude: sample.station.latitude,
        longitude: sample.station.longitude
      })));
    } catch (err: any) {
      console.error('Error fetching sample data:', err);
      setError(err.response?.data?.errorMessage || 'Failed to fetch sample data');
    } finally {
      setTesting(false);
    }
  };

  return (
    <>
      <button
        onClick={fetchSampleData}
        disabled={testing}
        className="w-full bg-rainfall-medium text-white px-4 py-2 rounded-lg shadow-lg hover:bg-rainfall-medium/80 transition-colors"
      >
        {testing ? 'Loading...' : 'View Sample Data'}
      </button>
      
      {(samples.length > 0 || error) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
            <div className="p-4 border-b border-gridlines flex justify-between items-center">
              <h2 className="text-lg font-medium">Weather Data - January 2023</h2>
              <button
                onClick={() => {
                  setSamples([]);
                  setError(null);
                  setStationInfo(null);
                }}
                className="text-text/50 hover:text-text transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4">
              {error ? (
                <div className="text-red-500">{error}</div>
              ) : (
                <>
                  {stationInfo && (
                    <div className="text-sm text-text/70 mb-4">
                      <div>Station: {stationInfo.name}</div>
                      {stationInfo.latitude && stationInfo.longitude && (
                        <div>Location: {stationInfo.latitude}°, {stationInfo.longitude}°</div>
                      )}
                    </div>
                  )}
                  <div className="space-y-2">
                    <div className="grid grid-cols-4 gap-4 font-medium border-b border-gridlines pb-2">
                      <div>Date</div>
                      <div>Rainfall</div>
                      <div>Max Temp</div>
                      <div>Min Temp</div>
                    </div>
                    {samples.map(sample => (
                      <div 
                        key={sample.date}
                        className="grid grid-cols-4 gap-4 border-b border-gridlines/30 py-2"
                      >
                        <div>{format(new Date(sample.date), 'MMM d')}</div>
                        <div>{sample.PRCP.toFixed(1)}mm</div>
                        <div>{sample.TMAX.toFixed(1)}°C</div>
                        <div>{sample.TMIN.toFixed(1)}°C</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DataSampleTester;
