import React, { useState } from 'react';

const TimeSlotPicker = ({ selectedDate, onTimeSelect, onBack }) => {
  const [selectedTime, setSelectedTime] = useState('');

  // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        slots.push({ value: time, display: displayTime });
      }
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Simulate some slots being unavailable
  const unavailableSlots = ['10:00', '11:30', '14:00', '15:30'];

  const handleTimeClick = (timeValue, displayTime) => {
    setSelectedTime(timeValue);
    onTimeSelect({ value: timeValue, display: displayTime });
  };

  const formatSelectedDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-amber-700 hover:text-amber-900 transition-colors mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Date Selection
        </button>
        
        <h2 className="text-2xl font-bold text-amber-900 mb-2">
          Select a Time
        </h2>
        <p className="text-amber-700">
          {formatSelectedDate(selectedDate)}
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {timeSlots.map((slot, index) => {
          const isUnavailable = unavailableSlots.includes(slot.value);
          const isSelected = selectedTime === slot.value;
          
          return (
            <button
              key={index}
              onClick={() => !isUnavailable && handleTimeClick(slot.value, slot.display)}
              disabled={isUnavailable}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                isUnavailable
                  ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isSelected
                  ? 'border-tech-600 bg-tech-50 text-tech-800'
                  : 'border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50 text-coffee-800'
              }`}
            >
              <div className="font-semibold text-center">
                {slot.display}
              </div>
              {isUnavailable && (
                <div className="text-xs text-center mt-1">
                  Unavailable
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 flex items-center justify-center">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-tech-50 border-2 border-tech-600 rounded mr-2"></div>
            <span className="text-coffee-700">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-100 border-2 border-gray-200 rounded mr-2"></div>
            <span className="text-coffee-700">Unavailable</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;