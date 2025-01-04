import axios from 'axios';
import { RainfallData } from '../types';
import { subYears, format } from 'date-fns';

const API_BASE_URL = 'https://www.ncei.noaa.gov/access/services/data/v1';
const BOSTON_STATION = 'USW00014739'; // Boston Logan Airport

const api = axios.create({
  baseURL: API_BASE_URL
});

interface NOAAStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
  mindate?: string;
  maxdate?: string;
  datacoverage?: number;
}

interface CacheEntry {
  data: RainfallData[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

const isValidCache = (entry: CacheEntry) => {
  return Date.now() - entry.timestamp < CACHE_EXPIRATION;
};

const PUYALLUP_COORDS = {
  latitude: 47.1854,
  longitude: -122.2929
};

const PREFERRED_STATIONS = [
  'GHCND:USW00024207', // TACOMA NARROWS AIRPORT, WA US
  'GHCND:USW00094274', // MCCHORD AFB, WA US
  'GHCND:USW00094248', // SEATAC AIRPORT, WA US
];

interface WeatherData {
  DATE: string;
  STATION: string;
  LONGITUDE: string;
  LATITUDE: string;
  NAME: string;
  ELEVATION: string;
  PRCP: string;
  TMAX?: string;
  TMIN?: string;
}

const processWeatherData = (data: WeatherData[]) => {
  return data.map(record => ({
    date: record.DATE,
    amount: parseFloat(record.PRCP.trim()) / 10, // Convert from tenths of mm to mm
    station: record.STATION,
    name: record.NAME,
    location: {
      longitude: parseFloat(record.LONGITUDE),
      latitude: parseFloat(record.LATITUDE),
      elevation: parseFloat(record.ELEVATION)
    },
    temperature: record.TMAX && record.TMIN ? {
      max: parseFloat(record.TMAX.trim()) / 10, // Convert from tenths of °C to °C
      min: parseFloat(record.TMIN.trim()) / 10
    } : undefined
  }));
};

export const findNearbyStations = async (
  latitude: number = PUYALLUP_COORDS.latitude,
  longitude: number = PUYALLUP_COORDS.longitude,
  radius: number = 50 // increased radius to 50km
): Promise<NOAAStation[]> => {
  try {
    // Get stations within 50km of Puyallup
    const response = await api.get('', {
      params: {
        dataset: 'daily-summaries',
        bbox: `${latitude + 0.5},${longitude - 0.5},${latitude - 0.5},${longitude + 0.5}`,
        startDate: '2022-01-01',
        endDate: '2022-12-31',
        dataTypes: 'PRCP',
        format: 'json'
      }
    });

    // Extract unique stations from the response
    const stations = [...new Set(response.data.map((record: any) => record.station))];
    
    return stations.map(station => ({
      id: station,
      name: station,
      latitude: 0, // We'll need to get these from station metadata if needed
      longitude: 0,
      elevation: 0,
      datacoverage: 1
    }));
  } catch (error) {
    console.error('Error finding nearby stations:', error);
    return [];
  }
};

export const testStationData = async (stationId: string, startDate: string, endDate: string): Promise<{
  hasData: boolean;
  totalRecords: number;
  firstDate?: string;
  lastDate?: string;
  coverage?: number;
  sampleData?: Array<{ date: string; value: number }>;
}> => {
  try {
    const response = await api.get('', {
      params: {
        dataset: 'daily-summaries',
        stations: stationId,
        startDate,
        endDate,
        dataTypes: 'PRCP',
        format: 'json',
        units: 'metric'
      }
    });

    const records = response.data || [];
    if (records.length === 0) {
      return { hasData: false, totalRecords: 0 };
    }

    // Sort records by date
    records.sort((a: any, b: any) => a.date.localeCompare(b.date));

    // Calculate coverage
    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();
    const daysDiff = Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24));
    const coverage = records.length / daysDiff;

    // Get 5 sample records (first record of each month for 5 months)
    const sampleData = records
      .filter((record: any, index: number, array: any[]) => {
        if (index === 0) return true;
        const prevMonth = new Date(array[index - 1].date).getMonth();
        const currentMonth = new Date(record.date).getMonth();
        return currentMonth !== prevMonth;
      })
      .slice(0, 5)
      .map((record: any) => ({
        date: record.date,
        value: record.value / 10 // Convert from tenths of mm to mm
      }));

    return {
      hasData: true,
      totalRecords: records.length,
      firstDate: records[0].date,
      lastDate: records[records.length - 1].date,
      coverage,
      sampleData
    };
  } catch (error) {
    console.error('Error testing station data:', error);
    return { hasData: false, totalRecords: 0 };
  }
};

export const testDataAvailability = async () => {
  try {
    console.log('🔍 Finding weather stations near Puyallup (98374)...');
    const stations = await findNearbyStations();
    
    // Sort stations by distance to Puyallup
    const sortedStations = stations
      .map(station => ({
        ...station,
        distance: Math.sqrt(
          Math.pow((station.latitude - PUYALLUP_COORDS.latitude) * 111, 2) +
          Math.pow((station.longitude - PUYALLUP_COORDS.longitude) * 111 * Math.cos(PUYALLUP_COORDS.latitude * Math.PI / 180), 2)
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); // Limit to 5 closest stations

    // Test for 2018-2023 (recent historical data)
    const startDate = new Date('2018-01-01');
    const endDate = new Date('2023-12-31');
    
    console.log(`\n📊 Testing ${sortedStations.length} closest stations:`);
    console.log(`Historical Data Range: ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}\n`);
    
    for (const station of sortedStations) {
      console.log(`\n📍 Station: ${station.name} (${station.id})`);
      console.log(`   Distance: ${station.distance.toFixed(1)}km from Puyallup`);
      console.log(`   Location: ${station.latitude}, ${station.longitude}`);
      console.log(`   Elevation: ${station.elevation}m`);
      console.log(`   Historical Data Coverage: ${((station.datacoverage || 0) * 100).toFixed(1)}%`);
      
      const result = await testStationData(
        station.id,
        format(startDate, 'yyyy-MM-dd'),
        format(endDate, 'yyyy-MM-dd')
      );
      
      if (result.hasData) {
        console.log('   ✅ Data available:');
        console.log(`      Total Records: ${result.totalRecords} days`);
        console.log(`      Date Range: ${result.firstDate} to ${result.lastDate}`);
        console.log(`      Coverage: ${Math.round(result.coverage! * 100)}% of days have data`);
        
        // Calculate any gaps
        const firstDate = new Date(result.firstDate!);
        const lastDate = new Date(result.lastDate!);
        const expectedDays = Math.floor((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        const missingDays = expectedDays - result.totalRecords;
        
        if (missingDays > 0) {
          console.log(`      ⚠️  Missing data for ${missingDays} days`);
        }

        // Show sample data
        if (result.sampleData && result.sampleData.length > 0) {
          console.log('\n      📊 Sample Rainfall Data (first day of 5 months):');
          result.sampleData.forEach(sample => {
            console.log(`         ${sample.date}: ${sample.value.toFixed(1)}mm`);
          });
        }
      } else {
        console.log('   ❌ No data available for this period');
      }
      
      console.log('   ' + '─'.repeat(50));
    }
    
    console.log('\n💡 Recommendation:');
    console.log('Use the station with the highest coverage and closest distance to Puyallup.');
  } catch (error) {
    console.error('Error testing data availability:', error);
  }
};

export const fetchRainfallData = async (
  startDate: string,
  endDate: string
): Promise<RainfallData[]> => {
  try {
    const response = await api.get('', {
      params: {
        dataset: 'daily-summaries',
        stations: BOSTON_STATION,
        startDate,
        endDate,
        dataTypes: 'TMAX,TMIN,PRCP',
        format: 'json',
        includeStationName: true,
        includeStationLocation: true
      }
    });

    if (!response.data || !Array.isArray(response.data)) {
      console.warn('No data or invalid data returned from NOAA API');
      return [];
    }

    return response.data.map(record => ({
      date: record.DATE,
      amount: record.PRCP ? parseFloat(record.PRCP) / 10 : 0, // Convert from tenths of mm to mm
      temperature: {
        max: record.TMAX ? parseFloat(record.TMAX) / 10 : undefined, // Convert from tenths of °C to °C
        min: record.TMIN ? parseFloat(record.TMIN) / 10 : undefined
      },
      quality: 'standard'
    }));
  } catch (error) {
    console.error('Error fetching rainfall data:', error);
    return [];
  }
};

export const getCachedRainfallData = async (
  startDate: string,
  endDate: string,
  stationId?: string
): Promise<RainfallData[]> => {
  const cacheKey = `${stationId}-${startDate}-${endDate}`;
  
  const cachedEntry = cache.get(cacheKey);
  if (cachedEntry && isValidCache(cachedEntry)) {
    return cachedEntry.data;
  }

  const data = await fetchRainfallData(startDate, endDate, stationId);
  cache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
};
