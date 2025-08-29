import React, { useEffect, useState } from 'react';
import googleServices from '../utils/googleServices';
import emailService from '../utils/emailService';
import supabaseBookingService from '../utils/supabaseBookingService';

const BookingConfirmation = ({ 
  selectedDate, 
  selectedTime, 
  clientInfo, 
  onNewBooking 
}) => {
  const [meetLink, setMeetLink] = useState('');
  const [calendarEvent, setCalendarEvent] = useState(null);
  const [emailStatus, setEmailStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(true);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTopicDisplay = () => {
    if (clientInfo.topic === 'Other' && clientInfo.customTopic) {
      return clientInfo.customTopic;
    }
    return clientInfo.topic;
  };

  // Initialize calendar event and send emails
  useEffect(() => {
    const setupBooking = async () => {
      try {
        setEmailStatus('Creating calendar event...');
        
        // Create calendar event with Google Calendar API
        let event = null;
        let generatedMeetLink = '';
        
        try {
          await googleServices.initialize();
          event = await googleServices.createCalendarEvent({
            selectedDate,
            selectedTime,
            clientInfo
          });
          
          // Extract Meet link from calendar event
          generatedMeetLink = googleServices.extractMeetLinkFromEvent(event) || googleServices.generateMeetLink();
          setCalendarEvent(event);
        } catch (error) {
          console.log('Google Calendar integration not available, using fallback');
          generatedMeetLink = googleServices.generateMeetLink();
        }
        
        setMeetLink(generatedMeetLink);
        setEmailStatus('Saving booking to database...');
        
        // Save booking to Supabase database
        const bookingResult = await supabaseBookingService.saveBooking({
          selectedDate,
          selectedTime,
          clientInfo,
          meetLink: generatedMeetLink
        });
        
        if (bookingResult.success) {
          console.log('Booking saved to Supabase:', bookingResult.booking);
          setEmailStatus('Sending confirmation emails...');
        } else {
          console.error('Failed to save booking to Supabase:', bookingResult.error);
          setEmailStatus('Proceeding with email notifications...');
        }
        
        // Send email notifications
        const emailResult = await emailService.sendBookingConfirmation({
          clientInfo,
          selectedDate,
          selectedTime,
          meetLink: generatedMeetLink,
          calendarEvent: event
        });
        
        if (emailResult.success) {
          setEmailStatus('✅ Confirmation emails sent successfully!');
        } else {
          setEmailStatus('⚠️ Calendar created, but email sending failed');
        }
        
      } catch (error) {
        console.error('Booking setup error:', error);
        setEmailStatus('⚠️ Booking confirmed, but some features unavailable');
        setMeetLink(googleServices.generateMeetLink());
      } finally {
        setIsProcessing(false);
      }
    };

    setupBooking();
  }, [selectedDate, selectedTime, clientInfo]);

  const downloadCalendarFile = () => {
    const icsContent = emailService.generateCalendarFile({
      clientInfo,
      selectedDate,
      selectedTime,
      meetLink
    });
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coffee-chat-${clientInfo.name.replace(/\s+/g, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const createGoogleCalendarLink = () => {
    const startDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime.value}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (30 * 60 * 1000));
    
    const formatDateForUrl = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `☕ Tech Consultation - ${clientInfo.name}`,
      dates: `${formatDateForUrl(startDateTime)}/${formatDateForUrl(endDateTime)}`,
      details: `Tech consultation session about ${getTopicDisplay()}.\n\nClient: ${clientInfo.name}\nCompany: ${clientInfo.company || 'Not specified'}\n\nThis is a 30-minute session via Google Meet.`,
      location: 'Google Meet (link will be provided)',
      sf: 'true',
      output: 'xml'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="card rounded-xl shadow-lg p-6 md:p-8 text-center">
      {/* Success Icon */}
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="text-center mb-6">
        <span className="text-4xl mb-3 block">🎉</span>
        <h2 className="text-2xl md:text-3xl font-bold text-coffee-900 mb-2">
          Coffee Chat Booked!
        </h2>
        <p className="text-coffee-600 mb-4">
          Your consultation has been successfully booked!
        </p>
        
        {/* Processing Status */}
        {isProcessing ? (
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-blue-700">{emailStatus}</span>
            </div>
          </div>
        ) : (
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <p className="text-green-700 font-medium">{emailStatus}</p>
          </div>
        )}
      </div>

      {/* Booking Details */}
  <div className="rounded-lg p-6 mb-8 text-left" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <h3 className="text-lg font-semibold text-coffee-900 mb-4 text-center">
          ☕ Consultation Details
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between py-3 border-b border-coffee-100">
            <span className="font-semibold text-coffee-800">Date:</span>
            <span className="text-coffee-700">{formatDate(selectedDate)}</span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-coffee-100">
            <span className="font-semibold text-coffee-800">Time:</span>
            <span className="text-coffee-700">{selectedTime.display} PT</span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-coffee-100">
            <span className="font-semibold text-coffee-800">Client:</span>
            <span className="text-coffee-700">{clientInfo.name}</span>
          </div>
          
          <div className="flex justify-between py-3 border-b border-coffee-100">
            <span className="font-semibold text-coffee-800">Email:</span>
            <span className="text-coffee-700">{clientInfo.email}</span>
          </div>

          {clientInfo.company && (
            <div className="flex justify-between py-3 border-b border-coffee-100">
              <span className="font-semibold text-coffee-800">Company:</span>
              <span className="text-coffee-700">{clientInfo.company}</span>
            </div>
          )}

          {clientInfo.experience && (
            <div className="flex justify-between py-3 border-b border-coffee-100">
              <span className="font-semibold text-coffee-800">Experience:</span>
              <span className="text-coffee-700">{clientInfo.experience}</span>
            </div>
          )}
          
          <div className="flex justify-between py-3 border-b border-coffee-100">
            <span className="font-semibold text-coffee-800">Topic:</span>
            <span className="text-coffee-700">{getTopicDisplay()}</span>
          </div>
          
          <div className="flex justify-between py-3">
            <span className="font-semibold text-coffee-800">Service:</span>
            <span className="text-coffee-700">Free Tech Consultation</span>
          </div>
        </div>
      </div>

      {/* Meeting Info */}
  <div className="rounded-lg p-6 mb-8 text-left" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <h4 className="font-semibold text-tech-900 mb-4 text-center flex items-center justify-center">
          <span className="mr-2">🎥</span>
          Meeting Information
        </h4>
        <div className="space-y-3">
          <div className="flex items-start">
            <span className="font-semibold text-tech-800 mr-2">Google Meet:</span>
            {meetLink ? (
              <a 
                href={meetLink} 
                target="_blank"
                rel="noopener noreferrer"
                className="text-tech-600 hover:text-tech-800 underline break-all"
              >
                {meetLink}
              </a>
            ) : (
              <span className="text-tech-600">Generating meeting link...</span>
            )}
          </div>
          <div className="text-sm text-tech-700">
            • Duration: 30 minutes<br/>
            • Calendar invitation sent to your email<br/>
            • Please join 2-3 minutes early to test your connection<br/>
            • Meeting link is also available in your calendar event
          </div>
        </div>
      </div>

      {/* Calendar Actions */}
      <div className="rounded-lg p-6 mb-8" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <h4 className="font-semibold text-coffee-900 mb-4 text-center flex items-center justify-center">
          <span className="mr-2">📅</span>
          Add to Your Calendar
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button
            onClick={downloadCalendarFile}
            className="btn-accent font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--card-border)' }}
          >
            📥 Download .ics File
          </button>
          
          <a
            href={createGoogleCalendarLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 text-center"
            style={{ borderColor: 'var(--card-border)' }}
          >
            📅 Add to Google Calendar
          </a>
        </div>
        <p className="text-xs text-coffee-600 mt-3 text-center">
          Choose your preferred method to add this meeting to your calendar
        </p>
      </div>

      {/* Important Information */}
      <div className="bg-blue-50 rounded-lg p-4 mb-8 text-left">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Before Our Session:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Prepare any specific questions or code you'd like to discuss</li>
          <li>• Test your microphone and camera beforehand</li>
          <li>• Have your development environment ready if doing code review</li>
          <li>• If you need to reschedule, please email at least 24 hours in advance</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onNewBooking}
          className="bg-tech-600 hover:bg-tech-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tech-500 focus:ring-offset-2"
        >
          Book Another Session
        </button>
        
        <button 
          onClick={() => window.print()}
          className="border-2 border-coffee-600 text-coffee-600 hover:bg-coffee-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:ring-offset-2"
        >
          Print Confirmation
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-coffee-600">
          Questions? Reach out at <span className="font-semibold">coffee@techconsult.dev</span>
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;