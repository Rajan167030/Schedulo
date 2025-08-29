import React, { useState } from 'react';
import { Lock, X, Shield } from 'lucide-react';

const AdminLogin = ({ isOpen, onClose, onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials (updated as requested)
  const ADMIN_CREDENTIALS = {
    username: 'Rajan',
    password: '123456789'
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (
        credentials.username === ADMIN_CREDENTIALS.username &&
        credentials.password === ADMIN_CREDENTIALS.password
      ) {
        // Store admin session
        sessionStorage.setItem('adminAuthenticated', 'true');
        sessionStorage.setItem('adminLoginTime', new Date().getTime().toString());
        onLogin();
        onClose();
      } else {
        setErrors({
          general: 'Invalid username or password'
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleClose = () => {
    setCredentials({ username: '', password: '' });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative z-10 w-full max-w-md p-6 mx-4">
        <div className="card rounded-xl shadow-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                Admin Login
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: 'var(--text-color)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm font-medium flex items-center">
                  <span className="mr-2">⚠️</span>
                  {errors.general}
                </p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium"
                style={{ color: 'var(--text-color)' }}
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={credentials.username}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                    errors.username
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  style={{ 
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)'
                  }}
                  placeholder="Enter admin username"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.username && (
                <p className="text-red-600 text-sm">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium"
                style={{ color: 'var(--text-color)' }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pl-11 border rounded-lg transition-all focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500/20'
                  }`}
                  style={{ 
                    backgroundColor: 'var(--card-bg)',
                    color: 'var(--text-color)'
                  }}
                  placeholder="Enter admin password"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </div>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm font-medium mb-2">Demo Credentials:</p>
            <p className="text-amber-700 text-xs">
              Username: <code className="bg-amber-100 px-1 rounded">Rajan</code><br/>
              Password: <code className="bg-amber-100 px-1 rounded">123456789</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;