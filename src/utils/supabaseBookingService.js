import { supabase } from './supabaseClient';

// Service for managing bookings with Supabase real-time database
class SupabaseBookingService {
  constructor() {
    this.tableName = 'bookings';
  }

  // Initialize database table (for development purposes)
  async initializeDatabase() {
    try {
      // Check if table exists by trying to select from it
      const { data, error } = await supabase
        .from(this.tableName)
        .select('id')
        .limit(1);
      
      if (error && error.message.includes('does not exist')) {
        console.log('Bookings table does not exist. Please create it in Supabase dashboard.');
        console.log(`
          To create the bookings table, run this SQL in your Supabase SQL editor:
          
          CREATE TABLE bookings (
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
        `);
        return { success: false, error: 'Table does not exist' };
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error initializing database:', error);
      return { success: false, error: error.message };
    }
  }

  // Save a new booking to Supabase
  async saveBooking(bookingData) {
    try {
      const { selectedDate, selectedTime, clientInfo, meetLink } = bookingData;
      
      // Create booking object for Supabase
      const booking = {
        date_time: new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime.value}:00`).toISOString(),
        client_name: clientInfo.name,
        client_email: clientInfo.email,
        client_company: clientInfo.company || null,
        client_experience: clientInfo.experience || null,
        topic: clientInfo.topic === 'Other' && clientInfo.customTopic 
          ? clientInfo.customTopic 
          : clientInfo.topic,
        meet_link: meetLink,
        status: 'confirmed'
      };

      const { data, error } = await supabase
        .from(this.tableName)
        .insert([booking])
        .select();

      if (error) {
        console.error('Supabase error saving booking:', error);
        return { success: false, error: error.message };
      }

      console.log('Booking saved successfully to Supabase:', data[0]);
      return { success: true, booking: data[0] };
    } catch (error) {
      console.error('Error saving booking to Supabase:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all bookings from Supabase
  async getAllBookings() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error retrieving bookings:', error);
      return [];
    }
  }

  // Get bookings for a specific date
  async getBookingsForDate(date) {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .gte('date_time', startOfDay.toISOString())
        .lte('date_time', endOfDay.toISOString())
        .order('date_time', { ascending: true });

      if (error) {
        console.error('Error fetching bookings for date:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error retrieving bookings for date:', error);
      return [];
    }
  }

  // Get upcoming bookings
  async getUpcomingBookings() {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .gt('date_time', now)
        .order('date_time', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming bookings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error retrieving upcoming bookings:', error);
      return [];
    }
  }

  // Get past bookings
  async getPastBookings() {
    try {
      const now = new Date().toISOString();
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .lt('date_time', now)
        .order('date_time', { ascending: false });

      if (error) {
        console.error('Error fetching past bookings:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error retrieving past bookings:', error);
      return [];
    }
  }

  // Delete a booking
  async deleteBooking(bookingId) {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', bookingId);

      if (error) {
        console.error('Error deleting booking:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Update a booking
  async updateBooking(bookingId, updates) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', bookingId)
        .select();

      if (error) {
        console.error('Error updating booking:', error);
        return { success: false, error: error.message };
      }

      return { success: true, booking: data[0] };
    } catch (error) {
      console.error('Error updating booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Get booking statistics
  async getBookingStats() {
    try {
      const allBookings = await this.getAllBookings();
      const now = new Date();
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);

      return {
        total: allBookings.length,
        upcoming: allBookings.filter(booking => new Date(booking.date_time) > now).length,
        past: allBookings.filter(booking => new Date(booking.date_time) <= now).length,
        thisWeek: allBookings.filter(booking => new Date(booking.date_time) >= startOfWeek).length,
        thisMonth: allBookings.filter(booking => new Date(booking.date_time) >= startOfMonth).length,
        thisYear: allBookings.filter(booking => new Date(booking.date_time) >= startOfYear).length,
        today: allBookings.filter(booking => {
          const bookingDate = new Date(booking.date_time);
          return bookingDate.toDateString() === now.toDateString();
        }).length
      };
    } catch (error) {
      console.error('Error calculating booking stats:', error);
      return {
        total: 0,
        upcoming: 0,
        past: 0,
        thisWeek: 0,
        thisMonth: 0,
        thisYear: 0,
        today: 0
      };
    }
  }

  // Check if a time slot is available
  async isTimeSlotAvailable(date, timeValue) {
    try {
      const bookingsForDate = await this.getBookingsForDate(date);
      return !bookingsForDate.some(booking => {
        const bookingTime = new Date(booking.date_time).toTimeString().substring(0, 5);
        return bookingTime === timeValue;
      });
    } catch (error) {
      console.error('Error checking time slot availability:', error);
      return true; // Default to available if error
    }
  }

  // Subscribe to real-time changes
  subscribeToBookings(callback) {
    const subscription = supabase
      .channel('bookings-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: this.tableName
        },
        (payload) => {
          console.log('Real-time booking change:', payload);
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  }

  // Unsubscribe from real-time changes
  unsubscribeFromBookings(subscription) {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
  }

  // Export bookings as JSON
  async exportBookingsAsJson() {
    try {
      const allBookings = await this.getAllBookings();
      const dataStr = JSON.stringify(allBookings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `coffee-bookings-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting bookings:', error);
    }
  }

  // Clear all bookings (admin function)
  async clearAllBookings() {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        console.error('Error clearing all bookings:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error clearing all bookings:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new SupabaseBookingService();