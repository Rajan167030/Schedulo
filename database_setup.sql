-- Coffee Chat Booking Database Setup for Supabase
-- Run this SQL in your Supabase SQL editor to create the bookings table

-- Create bookings table
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
-- In production, you should create more restrictive policies
CREATE POLICY "Allow all operations on bookings" ON bookings FOR ALL USING (true);

-- Enable real-time subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_date_time ON bookings (date_time);
CREATE INDEX IF NOT EXISTS idx_bookings_client_email ON bookings (client_email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at);

-- Optional: Insert some sample data for testing
-- INSERT INTO bookings (date_time, client_name, client_email, client_company, client_experience, topic, meet_link, status) 
-- VALUES 
--   (
--     '2025-09-01 10:00:00+00', 
--     'John Doe', 
--     'john@example.com', 
--     'Tech Corp', 
--     'Senior Developer (5+ years)', 
--     'Code Review', 
--     'https://meet.google.com/abc-def-ghi', 
--     'confirmed'
--   ),
--   (
--     '2025-09-02 14:30:00+00', 
--     'Jane Smith', 
--     'jane@startup.com', 
--     'Startup Inc', 
--     'Junior Developer (0-2 years)', 
--     'Career Advice', 
--     'https://meet.google.com/xyz-123-456', 
--     'confirmed'
--   );

-- Display success message
SELECT 'Bookings table created successfully! You can now use the Coffee Chat app with Supabase.' as message;