// Run this script to create the database table in Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lglwdxykjrupemzwlnad.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnbHdkeHlranJ1cGVtendsbmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY0NzkzNzMsImV4cCI6MjA3MjA1NTM3M30.9liPAFugY3Y7MZkLqhBveEnUmxLVbgZ9mQnGisvs_zk'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function createDatabaseTable() {
  try {
    console.log('🚀 Creating bookings table in Supabase...')
    
    // Try to create sample data first (this will help us test if table exists)
    const sampleBooking = {
      date_time: new Date('2025-09-01T10:00:00Z').toISOString(),
      client_name: 'Test User',
      client_email: 'test@example.com',
      client_company: 'Test Company',
      client_experience: 'Senior Developer (5+ years)',
      topic: 'Code Review',
      meet_link: 'https://meet.google.com/abc-def-ghi',
      status: 'confirmed'
    }
    
    const { data, error } = await supabase
      .from('bookings')
      .insert([sampleBooking])
      .select()
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('❌ Table does not exist. You need to create it manually.')
        console.log(`
🔧 Please follow these steps:

1. Go to: https://lglwdxykjrupemzwlnad.supabase.co
2. Login to your Supabase account
3. Click "SQL Editor" in the left sidebar
4. Copy and paste this SQL:

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

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

5. Click "Run" to execute
        `)
      } else {
        console.error('❌ Other error:', error)
      }
      return false
    }
    
    console.log('✅ Sample booking created successfully:', data)
    
    // Create more sample data
    const moreSampleData = [
      {
        date_time: new Date('2025-09-02T14:30:00Z').toISOString(),
        client_name: 'Jane Smith',
        client_email: 'jane@startup.com',
        client_company: 'Startup Inc',
        client_experience: 'Junior Developer (0-2 years)',
        topic: 'Career Advice',
        meet_link: 'https://meet.google.com/xyz-123-456',
        status: 'confirmed'
      },
      {
        date_time: new Date('2025-08-30T09:00:00Z').toISOString(),
        client_name: 'Mike Johnson',
        client_email: 'mike@freelancer.com',
        client_company: 'Freelancer',
        client_experience: 'Mid-level Developer (2-5 years)',
        topic: 'System Architecture',
        meet_link: 'https://meet.google.com/mno-789-xyz',
        status: 'confirmed'
      }
    ]
    
    const { data: moreData, error: moreError } = await supabase
      .from('bookings')
      .insert(moreSampleData)
      .select()
    
    if (moreError) {
      console.error('❌ Error creating additional sample data:', moreError)
    } else {
      console.log('✅ Additional sample data created:', moreData)
    }
    
    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return false
  }
}

createDatabaseTable()