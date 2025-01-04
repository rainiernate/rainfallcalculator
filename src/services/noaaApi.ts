import axios from 'axios';
import { RainfallData } from '../types';

const API_BASE_URL = 'https://www.ncdc.noaa.gov/cdo-web/api/v2';
const API_TOKEN = import.meta.env.VITE_NOAA_API_TOKEN;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'token': API_TOKEN
  }
});

interface NOAAStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number;
}

// Cache implementation with expiration
interface CacheEntry {
  data: RainfallData[];
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000; // 24 hours

const isValidCache = (entry: CacheEntry) => {
  return Date.now() - entry.timestamp < CACHE_EXPIRATION;
};

export const findNearbyStations = async (
  latitude: number,
  longitude: number,
  radius: number = 25 // radius in kilometers
): Promise<NOAAStation[]> => {
  try {
    // Puyallup, WA coordinates
    const response = await api.get('/stations', {
      params: {
        extent: `${latitude - radius},${longitude - radius},${latitude + radius},${longitude + radius}`,
        datasetid: 'GHCND', // Global Historical Climatology Network Daily
        datatypeid: 'PRCP', // Precipitation
        limit: 25
      }
    });

    return response.data.results;
  } catch (error) {
    console.error('Error finding nearby stations:', error);
    throw error;
  }
};

// Puyallup coordinates
const PUYALLUP_COORDS = {
  latitude: 47.1854,
  longitude: -122.2929
};

export const fetchRainfallData = async (
  startDate: string,
  endDate: string,
  stationId: string = 'GHCND:USW00024207' // TACOMA NARROWS AIRPORT, WA US
): Promise<RainfallData[]> => {
  try {
    // Split request into smaller chunks if the date range is large
    const response = await api.get('/data', {
      params: {
        datasetid: 'GHCND',
        datatypeid: 'PRCP',
        stationid: stationId,
        startdate: startDate,
        enddate: endDate,
        units: 'metric',
        limit: 1000
      }
    });

    if (!response.data.results) {
      console.warn('No data returned from NOAA API');
      return [];
    }

    return response.data.results.map((result: any) => ({
      date: result.date,
      amount: result.value / 10, // Convert from tenths of mm to mm
      quality: result.attributes || 'standard'
    }));
  } catch (error: any) {
    console.error('Error fetching rainfall data:', error);
    if (error.response?.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.');
    }
    throw error;
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
