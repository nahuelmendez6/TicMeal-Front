// src/components/DateRangePicker.tsx
import React, { useState, useEffect } from 'react';

interface DateRangePickerProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeChange,
  initialStartDate = '',
  initialEndDate = '',
}) => {
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  useEffect(() => {
    // Trigger initial change if dates are provided
    if (initialStartDate && initialEndDate) {
      onDateRangeChange(initialStartDate, initialEndDate);
    }
  }, [initialStartDate, initialEndDate, onDateRangeChange]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    onDateRangeChange(e.target.value, endDate);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    onDateRangeChange(startDate, e.target.value);
  };

  return (
    <div className="row g-3 align-items-center">
      <div className="col-auto">
        <label htmlFor="startDate" className="col-form-label">Desde:</label>
      </div>
      <div className="col-auto">
        <input
          type="date"
          id="startDate"
          className="form-control"
          value={startDate}
          onChange={handleStartDateChange}
        />
      </div>
      <div className="col-auto">
        <label htmlFor="endDate" className="col-form-label">Hasta:</label>
      </div>
      <div className="col-auto">
        <input
          type="date"
          id="endDate"
          className="form-control"
          value={endDate}
          onChange={handleEndDateChange}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
