import React, { useState, useEffect } from 'react';
import DateSelector from './components/DateSelector';
import TimeSlotPicker from './components/TimeSlotPicker';
import ClientForm from './components/ClientForm';
import BookingConfirmation from './components/BookingConfirmation';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { Settings } from 'lucide-react';

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

  // Admin state
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

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

  // Admin functions
  const handleAdminClick = () => {
    // Check if already authenticated
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (isAuthenticated) {
      setIsAdminAuthenticated(true);
      setShowAdminDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLogin = () => {
    setIsAdminAuthenticated(true);
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
  };

  const handleCloseAdminLogin = () => {
    setShowAdminLogin(false);
  };

  const handleCloseAdminDashboard = () => {
    setShowAdminDashboard(false);
  };

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add('dark');
    else root.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="min-h-screen theme-transition page-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button
            aria-label="Toggle theme"
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center gap-2 py-2 px-4 rounded-full border-2 focus:outline-none theme-transition"
            style={{ 
              borderColor: 'var(--card-border)',
              backgroundColor: darkMode ? 'var(--card-bg)' : 'var(--accent-highlight)'
            }}
          >
            <span className="text-lg">{darkMode ? '🌙' : '☀️'}</span>
            <div className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
              {darkMode ? 'Dark' : 'Light'}
            </div>
          </button>
        </div>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-4xl mr-3">☕</span>
            <h1 className="text-3xl md:text-4xl font-bold text-coffee-900">
              Buy Me Coffee
            </h1>
            <span className="text-4xl ml-3">💻</span>
          </div>
          <p className="text-lg font-medium theme-transition" style={{ color: 'var(--body-text)' }}>
            Schedule a tech consultation with a software engineer
          </p>
          <p className="text-sm mt-2 theme-transition" style={{ color: 'var(--subtle-text)' }}>
            Code reviews • Architecture discussions • Career advice • Technical mentoring
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold theme-transition"
                style={{
                  backgroundColor: step <= currentStep ? 'var(--accent)' : 'var(--card-bg)',
                  color: step <= currentStep ? 'var(--btn-text)' : 'var(--subtle-text)',
                  border: `2px solid ${step <= currentStep ? 'var(--accent)' : 'var(--card-border)'}`
                }}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs theme-transition" style={{ color: 'var(--body-text)' }}>
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