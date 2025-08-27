import React, { useState } from 'react';

const ClientForm = ({ onSubmit, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    topic: '',
    experience: '',
    customTopic: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.topic.trim()) {
      newErrors.topic = 'Please specify what you\'d like to discuss';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    // If "Other" is selected, require custom topic to be filled
    if (formData.topic === 'Other' && !formData.customTopic.trim()) {
      newErrors.customTopic = 'Please specify your consultation topic';
    }
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const experienceOptions = [
    'Student',
    'Junior Developer (0-2 years)',
    'Mid-level Developer (2-5 years)',
    'Senior Developer (5+ years)',
    'Engineering Manager',
    'CTO/Architect',
    'Non-technical'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-coffee-700 hover:text-coffee-900 transition-colors mb-4"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Time Selection
        </button>
        
        <div className="text-center mb-6">
          <span className="text-3xl mb-2 block">👋</span>
          <h2 className="text-2xl font-bold text-coffee-900 mb-2">
            Tell Me About Yourself
          </h2>
          <p className="text-coffee-600">
            Help me prepare for our coffee chat
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-coffee-900 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-500 transition-colors ${
              errors.name 
                ? 'border-red-300 bg-red-50' 
                : 'border-coffee-200 focus:border-tech-500'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-coffee-900 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-500 transition-colors ${
              errors.email 
                ? 'border-red-300 bg-red-50' 
                : 'border-coffee-200 focus:border-tech-500'
            }`}
            placeholder="your.email@company.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-coffee-900 mb-2">
            Company / Organization
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-coffee-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-500 focus:border-tech-500 transition-colors"
            placeholder="Your company or organization"
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-semibold text-coffee-900 mb-2">
            Experience Level
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-coffee-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-500 focus:border-tech-500 transition-colors"
          >
            <option value="">Select your experience level</option>
            {experienceOptions.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="topic" className="block text-sm font-semibold text-coffee-900 mb-2">
            What would you like to discuss? *
          </label>
          <select
            id="topic"
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-500 transition-colors ${
              errors.topic 
                ? 'border-red-300 bg-red-50' 
                : 'border-coffee-200 focus:border-tech-500'
            }`}
          >
            <option value="">Choose a topic</option>
            <option value="Code Review">Code Review</option>
            <option value="System Architecture">System Architecture</option>
            <option value="Career Advice">Career Advice</option>
            <option value="Technical Interview Prep">Technical Interview Prep</option>
            <option value="Project Planning">Project Planning</option>
            <option value="Technology Stack Decision">Technology Stack Decision</option>
            <option value="Performance Optimization">Performance Optimization</option>
            <option value="Best Practices">Best Practices</option>
            <option value="Other">Other</option>
          </select>
          {errors.topic && (
            <p className="mt-1 text-sm text-red-600">{errors.topic}</p>
          )}
        </div>

        {/* Custom Topic Input - Show when "Other" is selected */}
        {formData.topic === 'Other' && (
          <div>
            <label className="block text-sm font-semibold text-coffee-900 mb-2">
              Please specify your consultation topic: *
            </label>
            <textarea
              name="customTopic"
              value={formData.customTopic}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-tech-500 resize-none transition-colors ${
                errors.customTopic 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-coffee-200 focus:border-tech-500'
              }`}
              rows="3"
              placeholder="Describe what you'd like to discuss in our consultation..."
            />
            {errors.customTopic && (
              <p className="mt-1 text-sm text-red-600">{errors.customTopic}</p>
            )}
          </div>
        )}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-tech-600 hover:bg-tech-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-tech-500 focus:ring-offset-2"
          >
            Continue to Confirmation
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-coffee-600">
          * Required fields
        </p>
      </div>
    </div>
  );
};

export default ClientForm;