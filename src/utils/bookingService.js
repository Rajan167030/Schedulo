// Service for managing bookings in localStorage
class BookingService {
  constructor() {
    this.storageKey = 'coffeeBookings';
  }

  // Save a new booking
  saveBooking(bookingData) {
    try {
      const { selectedDate, selectedTime, clientInfo, meetLink } = bookingData;
      
      // Create booking object
      const booking = {
        id: this.generateBookingId(),
        dateTime: new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime.value}:00`).toISOString(),
        clientInfo: {
          name: clientInfo.name,
          email: clientInfo.email,
          company: clientInfo.company,
          experience: clientInfo.experience
        },
        topic: clientInfo.topic === 'Other' && clientInfo.customTopic 
          ? clientInfo.customTopic 
          : clientInfo.topic,
        meetLink: meetLink,
        bookedAt: new Date().toISOString(),
        status: 'confirmed'
      };

      // Get existing bookings
      const existingBookings = this.getAllBookings();
      
      // Add new booking
      existingBookings.push(booking);
      
      // Save back to localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(existingBookings));
      
      console.log('Booking saved successfully:', booking);
      return { success: true, booking };
    } catch (error) {
      console.error('Error saving booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all bookings
  getAllBookings() {
    try {
      const bookingsData = localStorage.getItem(this.storageKey);
      return bookingsData ? JSON.parse(bookingsData) : [];
    } catch (error) {
      console.error('Error retrieving bookings:', error);
      return [];
    }
  }

  // Get bookings for a specific date
  getBookingsForDate(date) {
    const allBookings = this.getAllBookings();
    const targetDate = date.toISOString().split('T')[0];
    
    return allBookings.filter(booking => {
      const bookingDate = new Date(booking.dateTime).toISOString().split('T')[0];
      return bookingDate === targetDate;
    });
  }

  // Get upcoming bookings
  getUpcomingBookings() {
    const allBookings = this.getAllBookings();
    const now = new Date();
    
    return allBookings
      .filter(booking => new Date(booking.dateTime) > now)
      .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  }

  // Get past bookings
  getPastBookings() {
    const allBookings = this.getAllBookings();
    const now = new Date();
    
    return allBookings
      .filter(booking => new Date(booking.dateTime) <= now)
      .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
  }

  // Delete a booking
  deleteBooking(bookingId) {
    try {
      const allBookings = this.getAllBookings();
      const updatedBookings = allBookings.filter(booking => booking.id !== bookingId);
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedBookings));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Update a booking
  updateBooking(bookingId, updates) {
    try {
      const allBookings = this.getAllBookings();
      const bookingIndex = allBookings.findIndex(booking => booking.id === bookingId);
      
      if (bookingIndex === -1) {
        return { success: false, error: 'Booking not found' };
      }
      
      allBookings[bookingIndex] = { ...allBookings[bookingIndex], ...updates };
      localStorage.setItem(this.storageKey, JSON.stringify(allBookings));
      
      return { success: true, booking: allBookings[bookingIndex] };
    } catch (error) {
      console.error('Error updating booking:', error);
      return { success: false, error: error.message };
    }
  }

  // Generate unique booking ID
  generateBookingId() {
    return `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  // Get booking statistics
  getBookingStats() {
    const allBookings = this.getAllBookings();
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    return {
      total: allBookings.length,
      upcoming: allBookings.filter(booking => new Date(booking.dateTime) > now).length,
      past: allBookings.filter(booking => new Date(booking.dateTime) <= now).length,
      thisWeek: allBookings.filter(booking => new Date(booking.dateTime) >= startOfWeek).length,
      thisMonth: allBookings.filter(booking => new Date(booking.dateTime) >= startOfMonth).length,
      thisYear: allBookings.filter(booking => new Date(booking.dateTime) >= startOfYear).length,
      today: allBookings.filter(booking => {
        const bookingDate = new Date(booking.dateTime);
        return bookingDate.toDateString() === now.toDateString();
      }).length
    };
  }

  // Check if a time slot is available
  isTimeSlotAvailable(date, timeValue) {
    const bookingsForDate = this.getBookingsForDate(date);
    return !bookingsForDate.some(booking => {
      const bookingTime = new Date(booking.dateTime).toTimeString().substring(0, 5);
      return bookingTime === timeValue;
    });
  }

  // Get available time slots for a date
  getAvailableTimeSlots(date) {
    const allSlots = this.generateTimeSlots();
    const bookingsForDate = this.getBookingsForDate(date);
    
    return allSlots.filter(slot => {
      return !bookingsForDate.some(booking => {
        const bookingTime = new Date(booking.dateTime).toTimeString().substring(0, 5);
        return bookingTime === slot.value;
      });
    });
  }

  // Generate time slots (same logic as TimeSlotPicker component)
  generateTimeSlots() {
    const slots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        slots.push({ value: time, display: displayTime });
      }
    }
    
    return slots;
  }

  // Export bookings as JSON
  exportBookingsAsJson() {
    const allBookings = this.getAllBookings();
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
  }

  // Clear all bookings (admin function)
  clearAllBookings() {
    try {
      localStorage.removeItem(this.storageKey);
      return { success: true };
    } catch (error) {
      console.error('Error clearing bookings:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new BookingService();