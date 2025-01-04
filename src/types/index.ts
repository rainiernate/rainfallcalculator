export interface RainfallData {
  date: string;          // YYYY-MM-DD
  amount: number;        // rainfall in mm
  quality: string;       // data quality indicator
}

export interface DayCell {
  date: Date;
  rainfall: number;
  color: string;         // calculated color based on rainfall
  row: number;          // position in grid
  column: number;       // position in grid
}

export type ViewLevel = 'year' | 'month' | 'week' | 'day';

export interface CalendarState {
  viewLevel: ViewLevel;
  selectedDate: Date;
  unit: 'mm' | 'inches';
  year: number;
}

export interface CalendarViewProps {
  data: RainfallData[];
  viewLevel: ViewLevel;
  selectedDate: Date;
  unit: 'mm' | 'inches';
  onDateSelect: (date: Date) => void;
}
