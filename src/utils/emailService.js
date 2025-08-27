// Email service for sending notifications using EmailJS
class EmailService {
  constructor() {
    this.isInitialized = false;
    this.emailjs = null;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    // EmailJS will be loaded via CDN in index.html
    if (typeof window !== 'undefined' && typeof window.emailjs === 'undefined') {
      throw new Error('EmailJS not loaded. Please include EmailJS script in index.html');
    }
    
    this.emailjs = window.emailjs;
    
    // Initialize with your EmailJS credentials
    this.emailjs.init({
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
    });
    
    this.isInitialized = true;
  }

  async sendBookingConfirmation(bookingDetails) {
    await this.initialize();
    
    const { clientInfo, selectedDate, selectedTime, meetLink, calendarEvent } = bookingDetails;
    
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

    // Email template for client
    const clientEmailParams = {
      to_email: clientInfo.email,
      to_name: clientInfo.name,
      from_name: 'Coffee Chat Consultations',
      subject: '☕ Your Tech Consultation is Confirmed!',
      meeting_date: formatDate(selectedDate),
      meeting_time: selectedTime.display + ' PT',
      meeting_topic: getTopicDisplay(),
      meet_link: meetLink,
      client_name: clientInfo.name,
      client_company: clientInfo.company || 'Not specified',
      client_experience: clientInfo.experience || 'Not specified',
      calendar_link: calendarEvent?.htmlLink || '',
      message: `
Hi ${clientInfo.name},

Great news! Your tech consultation has been confirmed. Here are the details:

📅 Date: ${formatDate(selectedDate)}
⏰ Time: ${selectedTime.display} PT (Pacific Time)
💻 Topic: ${getTopicDisplay()}
🎥 Google Meet: ${meetLink}

Before our session:
• Test your microphone and camera
• Prepare any specific questions or code you'd like to discuss
• Have your development environment ready if doing code review

Looking forward to our chat!

Best regards,
The Coffee Chat Team
      `.trim()
    };

    // Email template for admin
    const adminEmailParams = {
      to_email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@coffechat.dev',
      to_name: 'Admin',
      from_name: 'Coffee Chat Booking System',
      subject: '🔔 New Consultation Booking',
      meeting_date: formatDate(selectedDate),
      meeting_time: selectedTime.display + ' PT',
      meeting_topic: getTopicDisplay(),
      meet_link: meetLink,
      client_name: clientInfo.name,
      client_email: clientInfo.email,
      client_company: clientInfo.company || 'Not specified',
      client_experience: clientInfo.experience || 'Not specified',
      calendar_link: calendarEvent?.htmlLink || '',
      message: `
New consultation booking received:

👤 Client: ${clientInfo.name}
📧 Email: ${clientInfo.email}
🏢 Company: ${clientInfo.company || 'Not specified'}
⭐ Experience: ${clientInfo.experience || 'Not specified'}

📅 Date: ${formatDate(selectedDate)}
⏰ Time: ${selectedTime.display} PT
💻 Topic: ${getTopicDisplay()}
🎥 Google Meet: ${meetLink}

Calendar Event: ${calendarEvent?.htmlLink || 'N/A'}
      `.trim()
    };

    try {
      // Send email to client
      const clientEmailResult = await this.emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_CLIENT_TEMPLATE_ID,
        clientEmailParams
      );

      // Send email to admin
      const adminEmailResult = await this.emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
        adminEmailParams
      );

      return {
        success: true,
        clientEmail: clientEmailResult,
        adminEmail: adminEmailResult
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  generateCalendarFile(bookingDetails) {
    const { clientInfo, selectedDate, selectedTime, meetLink } = bookingDetails;
    
    const startDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime.value}:00`);
    const endDateTime = new Date(startDateTime.getTime() + (30 * 60 * 1000)); // 30 minutes

    const formatDateForICS = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const getTopicDisplay = () => {
      if (clientInfo.topic === 'Other' && clientInfo.customTopic) {
        return clientInfo.customTopic;
      }
      return clientInfo.topic;
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Coffee Chat//Consultation Booking//EN
BEGIN:VEVENT
DTSTART:${formatDateForICS(startDateTime)}
DTEND:${formatDateForICS(endDateTime)}
SUMMARY:☕ Tech Consultation - ${clientInfo.name}
DESCRIPTION:Tech consultation session with ${clientInfo.name}\\n\\nTopic: ${getTopicDisplay()}\\nCompany: ${clientInfo.company || 'Not specified'}\\n\\nJoin Google Meet: ${meetLink}\\n\\nAbout the session:\\n- Duration: 30 minutes\\n- Focus: ${getTopicDisplay()}
LOCATION:${meetLink}
ORGANIZER:mailto:coffee@techconsult.dev
ATTENDEE:mailto:${clientInfo.email}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    return icsContent;
  }
}

export default new EmailService();