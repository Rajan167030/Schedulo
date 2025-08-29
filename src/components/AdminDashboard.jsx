import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Users, 
  Clock, 
  Mail, 
  X, 
  LogOut, 
  Trash2, 
  Edit, 
  Eye,
  ChevronDown,
  ChevronUp,
  Download,
  Search,
  Filter,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import supabaseBookingService from '../utils/supabaseBookingService';
import { setupDatabase, createSampleData } from '../utils/setupDatabase';

const AdminDashboard = ({ isOpen, onClose }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [expandedBookings, setExpandedBookings] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0,
    pending: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [dbSetupStatus, setDbSetupStatus] = useState('checking'); // checking, ready, error

  // Load bookings from Supabase on component mount
  useEffect(() => {
    if (isOpen) {
      loadBookings();
      setupRealtimeSubscription();
    }

    return () => {
      if (subscription) {
        supabaseBookingService.unsubscribeFromBookings(subscription);
      }
    };
  }, [isOpen]);

  // Load bookings from Supabase
  const loadBookings = async () => {
    setIsLoading(true);
    try {
      // Initialize database first (in case table doesn't exist)
      await supabaseBookingService.initializeDatabase();
      
      const bookingsData = await supabaseBookingService.getAllBookings();
      const statsData = await supabaseBookingService.getBookingStats();
      
      setBookings(bookingsData);
      setFilteredBookings(bookingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Setup real-time subscription
  const setupRealtimeSubscription = () => {
    const newSubscription = supabaseBookingService.subscribeToBookings((payload) => {
      console.log('Real-time update received:', payload);
      // Reload bookings when data changes
      loadBookings();
    });
    
    setSubscription(newSubscription);
  };

  // Filter bookings based on search and status
  useEffect(() => {
    let filtered = bookings;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.client_company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.topic.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter(booking => {
        const bookingDate = new Date(booking.date_time);
        switch (filterStatus) {
          case 'upcoming':
            return bookingDate > now;
          case 'past':
            return bookingDate <= now;
          case 'today':
            return bookingDate.toDateString() === now.toDateString();
          default:
            return true;
        }
      });
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, filterStatus]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    sessionStorage.removeItem('adminLoginTime');
    onClose();
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const getStatusBadge = (dateTime) => {
    const now = new Date();
    const bookingDate = new Date(dateTime);
    
    if (bookingDate.toDateString() === now.toDateString()) {
      return <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">Today</span>;
    } else if (bookingDate > now) {
      return <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-800 rounded-full">Upcoming</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Past</span>;
    }
  };

  const toggleBookingExpand = (bookingId) => {
    setExpandedBookings(prev => ({
      ...prev,
      [bookingId]: !prev[bookingId]
    }));
  };

  const deleteBooking = async (bookingId) => {
    const result = await supabaseBookingService.deleteBooking(bookingId);
    if (result.success) {
      // Data will be automatically updated via real-time subscription
      console.log('Booking deleted successfully');
    } else {
      console.error('Failed to delete booking:', result.error);
      alert('Failed to delete booking. Please try again.');
    }
  };

  const exportBookings = () => {
    const csvContent = [
      ['Date', 'Time', 'Client Name', 'Email', 'Company', 'Topic', 'Experience', 'Status'].join(','),
      ...filteredBookings.map(booking => {
        const { date, time } = formatDateTime(booking.date_time);
        const status = new Date(booking.date_time) > new Date() ? 'Upcoming' : 'Past';
        return [
          date,
          time,
          booking.client_name,
          booking.client_email,
          booking.client_company || '',
          booking.topic,
          booking.client_experience || '',
          status
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `coffee-bookings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dashboard Panel */}
      <div className="relative z-10 w-full max-w-6xl mx-auto my-4 mx-4">
        <div className="card rounded-xl shadow-2xl h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                  Admin Dashboard
                </h1>
                <p className="text-sm" style={{ color: 'var(--body-text)' }}>
                  Coffee Chat Booking Management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                style={{ color: 'var(--text-color)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="card rounded-lg p-4 border" style={{ borderColor: 'var(--card-border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--body-text)' }}>Total Bookings</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.total}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              
              <div className="card rounded-lg p-4 border" style={{ borderColor: 'var(--card-border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--body-text)' }}>This Week</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.thisWeek}</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <div className="card rounded-lg p-4 border" style={{ borderColor: 'var(--card-border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--body-text)' }}>This Month</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.thisMonth}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              
              <div className="card rounded-lg p-4 border" style={{ borderColor: 'var(--card-border)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--body-text)' }}>Pending</p>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.pending}</p>
                  </div>
                  <Mail className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ 
                    backgroundColor: 'var(--card-bg)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--text-color)'
                  }}
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: 'var(--card-bg)',
                  borderColor: 'var(--card-border)',
                  color: 'var(--text-color)'
                }}
              >
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
                <option value="today">Today</option>
              </select>
              
              <button
                onClick={loadBookings}
                disabled={isLoading}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
              </button>
              
              <button
                onClick={exportBookings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Bookings Table */}
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: 'var(--card-border)' }}>
              {filteredBookings.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium" style={{ color: 'var(--text-color)' }}>
                    No bookings found
                  </p>
                  <p className="text-sm" style={{ color: 'var(--body-text)' }}>
                    {searchTerm || filterStatus !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Bookings will appear here once clients start booking consultations'
                    }
                  </p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto">
                  {filteredBookings.map((booking) => {
                    const { date, time } = formatDateTime(booking.date_time);
                    const isExpanded = expandedBookings[booking.id];
                    
                    return (
                      <div key={booking.id} className="border-b last:border-b-0" style={{ borderColor: 'var(--card-border)' }}>
                        <div className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <p className="font-medium" style={{ color: 'var(--text-color)' }}>
                                  {booking.client_name}
                                </p>
                                <p className="text-sm" style={{ color: 'var(--body-text)' }}>
                                  {booking.client_email}
                                </p>
                              </div>
                              
                              <div>
                                <p className="font-medium" style={{ color: 'var(--text-color)' }}>{date}</p>
                                <p className="text-sm" style={{ color: 'var(--body-text)' }}>{time}</p>
                              </div>
                              
                              <div>
                                <p className="text-sm font-medium" style={{ color: 'var(--text-color)' }}>
                                  {booking.topic}
                                </p>
                                <p className="text-sm" style={{ color: 'var(--body-text)' }}>
                                  {booking.client_company || 'No company'}
                                </p>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                {getStatusBadge(booking.date_time)}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => toggleBookingExpand(booking.id)}
                                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => deleteBooking(booking.id)}
                                className="p-1 hover:bg-red-100 hover:text-red-600 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderColor: 'var(--card-border)' }}>
                              <div className="space-y-2">
                                <h4 className="font-medium" style={{ color: 'var(--text-color)' }}>Client Details</h4>
                                <div className="text-sm space-y-1" style={{ color: 'var(--body-text)' }}>
                                  <p><strong>Experience:</strong> {booking.client_experience || 'Not specified'}</p>
                                  <p><strong>Company:</strong> {booking.client_company || 'Not specified'}</p>
                                  <p><strong>Topic:</strong> {booking.topic}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <h4 className="font-medium" style={{ color: 'var(--text-color)' }}>Meeting Details</h4>
                                <div className="text-sm space-y-1" style={{ color: 'var(--body-text)' }}>
                                  <p><strong>Meeting Link:</strong></p>
                                  <a 
                                    href={booking.meet_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline break-all"
                                  >
                                    {booking.meet_link}
                                  </a>
                                  <p><strong>Booked:</strong> {new Date(booking.created_at).toLocaleString()}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;