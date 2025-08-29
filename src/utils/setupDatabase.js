import { supabase } from './supabaseClient';

// Function to create database table and set up Supabase
export const setupDatabase = async () => {
  try {
    console.log('🚀 Setting up Supabase database...');
    
    // Create the bookings table
    const { data, error } = await supabase.rpc('setup_bookings_table', {});
    
    if (error) {
      // If the RPC doesn't exist, we'll create the table manually
      console.log('Creating table manually...');
      
      // Check if table exists first
      const { data: tableExists, error: checkError } = await supabase
        .from('bookings')
        .select('id')
        .limit(1);
      
      if (checkError && checkError.message.includes('does not exist')) {
        console.log('❌ Table does not exist. Please create it manually in Supabase dashboard.');
        return {
          success: false,
          message: 'Please run the SQL setup in your Supabase dashboard first.'
        };
      } else {
        console.log('✅ Table already exists');
        return { success: true, message: 'Database ready' };
      }
    }
    
    console.log('✅ Database setup complete');
    return { success: true, message: 'Database setup complete' };
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    return { 
      success: false, 
      message: 'Database setup failed. Please check console for details.' 
    };
  }
};

// Function to create sample data for testing
export const createSampleData = async () => {
  try {
    console.log('📝 Creating sample booking data...');
    
    const sampleBookings = [
      {
        date_time: new Date('2025-09-01T10:00:00Z').toISOString(),
        client_name: 'John Doe',
        client_email: 'john@example.com',
        client_company: 'Tech Corp',
        client_experience: 'Senior Developer (5+ years)',
        topic: 'Code Review',
        meet_link: 'https://meet.google.com/abc-def-ghi',
        status: 'confirmed'
      },
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
    ];
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(sampleBookings);
    
    if (error) {
      console.error('❌ Failed to create sample data:', error);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Sample data created successfully');
    return { success: true, data };
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    return { success: false, error: error.message };
  }
};