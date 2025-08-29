import React, { useState } from 'react';
import { Database, AlertTriangle, CheckCircle, Copy } from 'lucide-react';
import supabaseBookingService from '../utils/supabaseBookingService';

const DatabaseSetup = () => {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [setupStatus, setSetupStatus] = useState('');

  const sqlQuery = `-- Coffee Chat Booking Database Setup for Supabase
-- Copy and paste this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS bookings (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  date_time timestamp with time zone NOT NULL,
  client_name varchar NOT NULL,
  client_email varchar NOT NULL,
  client_company varchar,
  client_experience varchar,
  topic varchar NOT NULL,
  meet_link varchar NOT NULL,
  status varchar DEFAULT 'confirmed' NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings (date_time);
CREATE INDEX IF NOT EXISTS idx_bookings_client_email ON bookings (client_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);

-- Insert sample data for testing
INSERT INTO bookings (date_time, client_name, client_email, client_company, client_experience, topic, meet_link, status) 
VALUES 
  (
    '2025-09-01 10:00:00+00', 
    'John Doe', 
    'john@example.com', 
    'Tech Corp', 
    'Senior Developer (5+ years)', 
    'Code Review', 
    'https://meet.google.com/abc-def-ghi', 
    'confirmed'
  ),
  (
    '2025-09-02 14:30:00+00', 
    'Jane Smith', 
    'jane@startup.com', 
    'Startup Inc', 
    'Junior Developer (0-2 years)', 
    'Career Advice', 
    'https://meet.google.com/xyz-123-456', 
    'confirmed'
  ),
  (
    '2025-08-30 09:00:00+00', 
    'Mike Johnson', 
    'mike@freelancer.com', 
    'Freelancer', 
    'Mid-level Developer (2-5 years)', 
    'System Architecture', 
    'https://meet.google.com/mno-789-xyz', 
    'confirmed'
  );`;

  const testConnection = async () => {
    setIsTestingConnection(true);
    setSetupStatus('Testing connection...');
    
    try {
      const result = await supabaseBookingService.initializeDatabase();
      
      if (result.success) {
        // Try to fetch some data to confirm table exists
        const bookings = await supabaseBookingService.getAllBookings();
        setSetupStatus(`✅ Connection successful! Found ${bookings.length} bookings.`);
        setIsSetupComplete(true);
      } else {
        setSetupStatus('❌ Table not found. Please run the SQL setup first.');
        setIsSetupComplete(false);
      }
    } catch (error) {
      setSetupStatus(`❌ Connection failed: ${error.message}`);
      setIsSetupComplete(false);
    }
    
    setIsTestingConnection(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlQuery);
    alert('SQL copied to clipboard!');
  };

  return (
    <div className="p-6 border rounded-lg" style={{ borderColor: 'var(--card-border)', backgroundColor: 'var(--card-bg)' }}>
      <div className="flex items-center mb-4">
        <Database className="w-6 h-6 mr-3 text-blue-600" />
        <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
          Supabase Database Setup
        </h3>
      </div>

      <div className="mb-6">
        <div className="flex items-start mb-3">
          <AlertTriangle className="w-5 h-5 mr-2 text-amber-500 mt-0.5" />
          <div>
            <p className="font-medium text-amber-700">Database Setup Required</p>
            <p className="text-sm text-amber-600">
              To use real-time features, please create the database table first.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium mb-2" style={{ color: 'var(--text-color)' }}>
            Step 1: Open Supabase Dashboard
          </h4>
          <p className="text-sm mb-2" style={{ color: 'var(--body-text)' }}>
            Go to: <a 
              href="https://lglwdxykjrupemzwlnad.supabase.co" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              https://lglwdxykjrupemzwlnad.supabase.co
            </a>
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium mb-2" style={{ color: 'var(--text-color)' }}>
            Step 2: Run SQL Query
          </h4>
          <p className="text-sm mb-3" style={{ color: 'var(--body-text)' }}>
            Click "SQL Editor" → Create new query → Copy and paste the SQL below:
          </p>
          
          <div className="relative">
            <pre className="bg-gray-900 text-green-400 text-xs p-3 rounded overflow-x-auto max-h-40">
              <code>{sqlQuery}</code>
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
              title="Copy to clipboard"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h4 className="font-medium mb-2" style={{ color: 'var(--text-color)' }}>
            Step 3: Test Connection
          </h4>
          <p className="text-sm mb-3" style={{ color: 'var(--body-text)' }}>
            After running the SQL, click the button below to test the connection:
          </p>
          
          <button
            onClick={testConnection}
            disabled={isTestingConnection}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
          >
            {isTestingConnection ? 'Testing...' : 'Test Database Connection'}
          </button>
          
          {setupStatus && (
            <div className="mt-3 p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
              <p className="text-sm" style={{ color: 'var(--text-color)' }}>
                {setupStatus}
              </p>
            </div>
          )}
        </div>

        {isSetupComplete && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              <div>
                <p className="font-medium text-green-700 dark:text-green-400">
                  Setup Complete!
                </p>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Your admin dashboard is now ready with real-time Supabase integration.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseSetup;