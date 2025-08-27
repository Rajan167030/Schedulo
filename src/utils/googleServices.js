// Google API Integration for Calendar and Meet
/* eslint-disable no-undef */
class GoogleServices {
  constructor() {
    this.isInitialized = false;
    this.gapi = null;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    return new Promise((resolve, reject) => {
      if (typeof gapi === 'undefined') {
        reject(new Error('Google API not loaded'));
        return;
      }

      gapi.load('client:auth2', async () => {
        try {
          await gapi.client.init({
            apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            discoveryDocs: [
              'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'
            ],
            scope: 'https://www.googleapis.com/auth/calendar.events'
          });
          
          this.isInitialized = true;
          this.gapi = gapi;
          resolve();
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  async signIn() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    const authInstance = this.gapi.auth2.getAuthInstance();
    return authInstance.signIn();
  }

  async createCalendarEvent(eventDetails) {
    try {
      const { selectedDate, selectedTime, clientInfo } = eventDetails;
      
      // Create start and end datetime
      const dateStr = selectedDate.toISOString().split('T')[0];
      const startDateTime = new Date(`${dateStr}T${selectedTime.value}:00`);
      const endDateTime = new Date(startDateTime.getTime() + (30 * 60 * 1000)); // 30 minutes

      const getTopicDisplay = () => {
        if (clientInfo.topic === 'Other' && clientInfo.customTopic) {
          return clientInfo.customTopic;
        }
        return clientInfo.topic;
      };

      const event = {
        summary: `☕ Tech Consultation - ${clientInfo.name}`,
        description: `
Tech consultation session with ${clientInfo.name}

Topic: ${getTopicDisplay()}
Company: ${clientInfo.company || 'Not specified'}
Experience: ${clientInfo.experience || 'Not specified'}

About the session:
- Duration: 30 minutes
- Focus: ${getTopicDisplay()}
- Platform: Google Meet (link will be generated automatically)

Please join 2-3 minutes early to test your connection.
        `.trim(),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: 'America/Los_Angeles'
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: 'America/Los_Angeles'
        },
        attendees: [
          { 
            email: clientInfo.email,
            displayName: clientInfo.name,
            responseStatus: 'needsAction'
          },
          { 
            email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@coffechat.dev',
            displayName: 'Coffee Chat Consultant',
            responseStatus: 'accepted',
            organizer: true
          }
        ],
        conferenceData: {
          createRequest: {
            requestId: `coffee-chat-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet'
            }
          }
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 hours before
            { method: 'email', minutes: 60 },      // 1 hour before
            { method: 'popup', minutes: 15 }       // 15 minutes before
          ]
        },
        guestsCanModify: false,
        guestsCanInviteOthers: false,
        guestsCanSeeOtherGuests: false
      };

      // Create event in primary calendar
      const response = await this.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1,
        sendUpdates: 'all' // Send email invitations to all attendees
      });

      return response.result;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  }

  extractMeetLinkFromEvent(calendarEvent) {
    // Extract Google Meet link from calendar event
    if (calendarEvent.conferenceData && calendarEvent.conferenceData.entryPoints) {
      const meetEntry = calendarEvent.conferenceData.entryPoints.find(
        entry => entry.entryPointType === 'video'
      );
      return meetEntry ? meetEntry.uri : null;
    }
    return null;
  }

  generateMeetLink() {
    // Fallback method - generates a demo Google Meet link
    const meetId = [
      Math.random().toString(36).substring(2, 5),
      Math.random().toString(36).substring(2, 5),
      Math.random().toString(36).substring(2, 5)
    ].join('-');
    return `https://meet.google.com/${meetId}`;
  }
}

export default new GoogleServices();