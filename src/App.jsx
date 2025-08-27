import React, { useState } from 'react';
import DateSelector from './components/DateSelector';
import TimeSlotPicker from './components/TimeSlotPicker';
import ClientForm from './components/ClientForm';
import BookingConfirmation from './components/BookingConfirmation';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientInfo, setClientInfo] = useState({
    name: '',
    email: '',
    company: '',
    topic: '',
    experience: '',
    customTopic: ''
  });

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setCurrentStep(2);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setCurrentStep(3);
  };

  const handleClientInfoSubmit = (info) => {
    setClientInfo(info);
    setCurrentStep(4);
  };

  const handleNewBooking = () => {
    setCurrentStep(1);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientInfo({ name: '', email: '', company: '', topic: '', experience: '', customTopic: '' });
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-tech-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">☕</span>
            <h1 className="text-3xl md:text-4xl font-bold text-coffee-900">
              Buy Me Coffee
            </h1>
            <span className="text-4xl ml-3">💻</span>
          </div>
          <p className="text-coffee-700 text-lg font-medium">
            Schedule a tech consultation with a software engineer
          </p>
          <p className="text-coffee-600 text-sm mt-2">
            Code reviews • Architecture discussions • Career advice • Technical mentoring
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step <= currentStep
                    ? 'bg-tech-600 text-white'
                    : 'bg-coffee-200 text-coffee-700'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-coffee-700">
            <span>Date</span>
            <span>Time</span>
            <span>Details</span>
            <span>Confirm</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <DateSelector onDateSelect={handleDateSelect} />
          )}
          
          {currentStep === 2 && (
            <TimeSlotPicker
              selectedDate={selectedDate}
              onTimeSelect={handleTimeSelect}
              onBack={goToPreviousStep}
            />
          )}
          
          {currentStep === 3 && (
            <ClientForm
              onSubmit={handleClientInfoSubmit}
              onBack={goToPreviousStep}
            />
          )}
          
          {currentStep === 4 && (
            <BookingConfirmation
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              clientInfo={clientInfo}
              onNewBooking={handleNewBooking}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;