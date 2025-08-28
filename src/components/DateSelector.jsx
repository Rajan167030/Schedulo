import React, { useState } from 'react';

const DateSelector = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState('');

  // Generate next 30 available days (excluding weekends for this example)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    
    while (dates.length < 30) {
      currentDate.setDate(currentDate.getDate() + 1);
      // Skip weekends (Saturday = 6, Sunday = 0)
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        dates.push(new Date(currentDate));
      }
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateValue = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleDateClick = (date) => {
    const dateValue = formatDateValue(date);
    setSelectedDate(dateValue);
    onDateSelect(date);
  };

  return (
    <div className="card rounded-xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-6">
        <span className="text-3xl mb-3 block">📅</span>
        <h2 className="text-2xl font-bold text-coffee-900 mb-2">
          Choose Your Coffee Date
        </h2>
        <p className="text-coffee-600">
          Select a day for your tech consultation
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {availableDates.map((date, index) => {
          const dateValue = formatDateValue(date);
          const isSelected = selectedDate === dateValue;
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isSelected
                  ? 'border-tech-600 bg-tech-50 text-tech-800'
                  : 'border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50 text-coffee-800'
              }`}
            >
              <div className="font-semibold">
                {date.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
              <div className="text-sm opacity-75">
                {date.getFullYear()}
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: 'var(--subtle-text, #6b7280)' }}>
          ☕ Available weekdays only • 30-minute sessions • Online via Google Meet
        </p>
      </div>
    </div>
  );
};

export default DateSelector;