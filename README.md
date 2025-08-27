
# Schedulo - Tech Consultation Booking Platform

<img width="1024" height="1024" alt="ChatGPT Image Aug 28, 2025, 02_30_55 AM" src="https://github.com/user-attachments/assets/c96080fa-2c89-4487-a9a8-09c627cd7aaf" />


# ☕ Buy Me Coffee - Tech Consultation Booking Platform

A professional scheduling application for tech consultations with Google Calendar integration and automatic email notifications.

## ✨ Features

- **📅 Google Calendar Integration**: Automatic calendar event creation with Google Meet links
- **📧 Email Notifications**: Confirmation emails sent to both client and admin
- **🎥 Google Meet**: Auto-generated meeting links for each consultation
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **⏰ Time Management**: Smart scheduling with time zone support
- **📝 Custom Topics**: Support for custom consultation topics
- **📁 Calendar Export**: Download .ics files for any calendar app

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/pnpm
- Google Cloud Console account
- EmailJS account (for email notifications)

### Installation

1. **Clone and Install**
   ```bash
   git clone <your-repo>
   cd buy-me-coffee-consultant
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**
   Edit `.env` with your credentials:
   ```env
   # Google Calendar API
   VITE_GOOGLE_API_KEY=your_google_api_key
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   
   # EmailJS Configuration
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_CLIENT_TEMPLATE_ID=template_client
   VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_admin
   
   # Admin Email
   VITE_ADMIN_EMAIL=admin@yourdomain.com
   ```

4. **Start Development Server**
   ```bash
   pnpm run dev
   ```

## ⚙️ Setup Guide

### 🗓️ Google Calendar API Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one

2. **Enable APIs**
   - Enable "Google Calendar API"
   - Enable "Google Meet API" (if available)

3. **Create Credentials**
   - Go to "Credentials" → "Create Credentials" → "API Key"
   - Copy the API key to `VITE_GOOGLE_API_KEY`
   
4. **OAuth 2.0 Setup**
   - Create "OAuth 2.0 Client ID"
   - Add your domain to authorized origins
   - Copy Client ID to `VITE_GOOGLE_CLIENT_ID`

5. **Configure OAuth Consent Screen**
   - Add necessary scopes: `https://www.googleapis.com/auth/calendar.events`
   - Add test users if in development mode

### 📧 EmailJS Setup

1. **Create EmailJS Account**
   - Sign up at [EmailJS.com](https://www.emailjs.com/)
   - Create a new service (Gmail, Outlook, etc.)

2. **Create Email Templates**

   **Client Template (template_client):**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <meta charset="utf-8">
       <title>Coffee Chat Confirmation</title>
   </head>
   <body>
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
           <h1 style="color: #8B4513;">☕ Your Tech Consultation is Confirmed!</h1>
           
           <p>Hi {{to_name}},</p>
           
           <p>Great news! Your tech consultation has been confirmed.</p>
           
           <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
               <h3>📅 Meeting Details</h3>
               <p><strong>Date:</strong> {{meeting_date}}</p>
               <p><strong>Time:</strong> {{meeting_time}}</p>
               <p><strong>Topic:</strong> {{meeting_topic}}</p>
               <p><strong>Google Meet:</strong> <a href="{{meet_link}}">{{meet_link}}</a></p>
           </div>
           
           <h3>Before our session:</h3>
           <ul>
               <li>Test your microphone and camera</li>
               <li>Prepare any specific questions or code you'd like to discuss</li>
               <li>Have your development environment ready if doing code review</li>
           </ul>
           
           <p>Looking forward to our chat!</p>
           
           <p>Best regards,<br>{{from_name}}</p>
       </div>
   </body>
   </html>
   ```

   **Admin Template (template_admin):**
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <meta charset="utf-8">
       <title>New Booking Notification</title>
   </head>
   <body>
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
           <h1 style="color: #1E40AF;">🔔 New Consultation Booking</h1>
           
           <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
               <h3>👤 Client Information</h3>
               <p><strong>Name:</strong> {{client_name}}</p>
               <p><strong>Email:</strong> {{client_email}}</p>
               <p><strong>Company:</strong> {{client_company}}</p>
               <p><strong>Experience:</strong> {{client_experience}}</p>
           </div>
           
           <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
               <h3>📅 Meeting Details</h3>
               <p><strong>Date:</strong> {{meeting_date}}</p>
               <p><strong>Time:</strong> {{meeting_time}}</p>
               <p><strong>Topic:</strong> {{meeting_topic}}</p>
               <p><strong>Google Meet:</strong> <a href="{{meet_link}}">{{meet_link}}</a></p>
           </div>
           
           <p>Calendar event has been created automatically.</p>
       </div>
   </body>
   </html>
   ```

3. **Get Credentials**
   - Copy Service ID to `VITE_EMAILJS_SERVICE_ID`
   - Copy Public Key to `VITE_EMAILJS_PUBLIC_KEY`
   - Copy Template IDs to respective environment variables

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS
- **APIs**: Google Calendar API, Google Meet API
- **Email**: EmailJS
- **State Management**: React Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom coffee/tech theme

### Key Components
- `DateSelector`: Interactive calendar for date selection
- `TimeSlotPicker`: Available time slots display
- `ClientForm`: Client information with custom topic support
- `BookingConfirmation`: Calendar integration and email sending

### Services
- `googleServices.js`: Google Calendar API integration
- `emailService.js`: Email notification handling

## 🎨 Customization

### Styling
The app uses a custom color scheme:
- **Coffee theme**: Warm browns and creams
- **Tech theme**: Blues and modern grays
- **Accent colors**: Green for success, red for errors

### Time Zones
Currently configured for Pacific Time (PT). To change:
1. Update `timeZone` in `googleServices.js`
2. Modify time display in components

### Email Templates
Customize email templates in EmailJS dashboard to match your branding.

## 🚀 Deployment

### Build for Production
```bash
pnpm run build
```

### Deploy to Vercel/Netlify
1. Connect your repository
2. Add environment variables in deployment settings
3. Deploy

### Environment Variables in Production
Ensure all environment variables are set in your deployment platform:
- Google API credentials
- EmailJS configuration
- Admin email address

## 🔧 Troubleshooting

### Google Calendar Issues
- **401 Unauthorized**: Check API key and Client ID
- **403 Forbidden**: Verify OAuth consent screen setup
- **Calendar not creating**: Ensure user has granted calendar permissions

### Email Issues
- **Emails not sending**: Verify EmailJS service configuration
- **Template errors**: Check template variable names match code
- **Rate limiting**: EmailJS has sending limits on free tier

### Development Issues
- **CORS errors**: Add your localhost to authorized origins in Google Console
- **Environment variables not loading**: Restart development server after .env changes

## 📝 License

MIT License - feel free to use for personal and commercial projects.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Email: support@yourdomain.com

---

**Built with ☕ and 💻 for the developer community**
