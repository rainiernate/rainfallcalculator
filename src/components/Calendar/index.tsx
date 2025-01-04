import React from 'react';
import { ViewLevel } from '../../types';
import YearView from './YearView';
import MonthView from './MonthView';

interface CalendarProps {
  data: { [key: string]: number };
  viewLevel: ViewLevel;
  selectedDate: Date;
  unit: string;
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  data,
  viewLevel,
  selectedDate,
  unit,
  onDateSelect
}) => {
  return viewLevel === 'year' ? (
    <YearView
      data={data}
      selectedDate={selectedDate}
      unit={unit}
      onDateSelect={onDateSelect}
    />
  ) : (
    <MonthView
      data={data}
      selectedDate={selectedDate}
      unit={unit}
      onDateSelect={onDateSelect}
    />
  );
};

export default Calendar;
