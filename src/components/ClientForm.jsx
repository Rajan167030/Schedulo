import React, { useState } from 'react';

const InputField = ({ 
  label, 
  icon, 
  error, 
  value, 
  type = 'text',
  required = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value?.length > 0;
  
  return (
    <div className="relative">
      <div className="relative">
        <input
          type={type}
          {...props}
          className={`
            peer w-full px-4 py-3 pt-6 text-base
            border-2 rounded-lg transition-all duration-200
            bg-transparent
            ${error 
              ? 'border-red-300 focus:border-red-500' 
              : hasValue 
                ? 'border-green-300 focus:border-green-500' 
                : 'border-coffee-200 focus:border-tech-500'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${error ? 'focus:ring-red-500/20' : 'focus:ring-tech-500/20'}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <label
          className={`
            absolute left-4 transition-all duration-200
            ${(isFocused || hasValue) 
              ? 'transform -translate-y-3 scale-75 text-xs top-2' 
              : 'top-4 text-gray-500'
            }
            ${error ? 'text-red-500' : hasValue ? 'text-green-600' : 'text-coffee-700'}
          `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="absolute right-3 top-4 text-xl theme-transition" style={{ color: 'var(--subtle-text)' }}>
          {icon}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span> {error}
        </p>
      )}
      {!error && hasValue && (
        <p className="mt-1 text-sm text-green-600 flex items-center">
          <span className="mr-1">✓</span> Looks good!
        </p>
      )}
    </div>
  );
};

const SelectField = ({ 
  label, 
  icon, 
  error, 
  value, 
  options,
  required = false,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value?.length > 0;
  
  return (
    <div className="relative">
      <div className="relative">
        <select
          {...props}
          className={`
            peer w-full px-4 py-3 pt-6 text-base appearance-none
            border-2 rounded-lg transition-all duration-200
            bg-transparent text-[color:var(--text-color)]
            ${error 
              ? 'border-red-300 focus:border-red-500' 
              : hasValue 
                ? 'border-green-300 focus:border-green-500' 
                : 'border-coffee-200 focus:border-tech-500'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${error ? 'focus:ring-red-500/20' : 'focus:ring-tech-500/20'}
            [&>option]:bg-[color:var(--card-bg)] [&>option]:text-[color:var(--text-color)]
            dark:[&>option]:bg-[color:var(--card-bg)] dark:[&>option]:text-[color:var(--text-color)]
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <option value="">{label}</option>
          {options.map((option, index) => (
            <option key={index} value={typeof option === 'string' ? option : option.value}>
              {typeof option === 'string' ? option : option.label}
            </option>
          ))}
        </select>
        <label
          className={`
            absolute left-4 transition-all duration-200
            ${(isFocused || hasValue) 
              ? 'transform -translate-y-3 scale-75 text-xs top-2' 
              : 'top-4 text-gray-500'
            }
            ${error ? 'text-red-500' : hasValue ? 'text-green-600' : 'text-coffee-700'}
          `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="absolute right-3 top-4 text-xl theme-transition" style={{ color: 'var(--subtle-text)' }}>
          {icon}
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <span className="mr-1">⚠️</span> {error}
        </p>
      )}
      {!error && hasValue && (
        <p className="mt-1 text-sm text-green-600 flex items-center">
          <span className="mr-1">✓</span> Great choice!
        </p>
      )}
    </div>
  );
};

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
    <div className="card rounded-xl shadow-lg p-6 md:p-8">
      <div className="mb-8">
        <button
          onClick={onBack}
          className="group flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-opacity-90"
          style={{ 
            backgroundColor: 'var(--card-bg)', 
            color: 'var(--accent)',
            border: '1px solid var(--card-border)'
          }}
        >
          <svg 
            className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Time Selection
        </button>
        
        <div className="text-center mt-6">
          <span className="text-4xl mb-3 block animate-wave">👋</span>
          <h2 className="text-2xl md:text-3xl font-bold mb-2 theme-transition" style={{ color: 'var(--text-color)' }}>
            Tell Me About Yourself
          </h2>
          <p className="text-base theme-transition" style={{ color: 'var(--body-text)' }}>
            Help me prepare for our coffee chat
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-coffee-200 to-transparent dark:via-coffee-700"></div>
            <h3 className="px-4 text-sm font-semibold uppercase tracking-wider theme-transition" style={{ color: 'var(--body-text)' }}>
              Personal Information
            </h3>
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-coffee-200 to-transparent dark:via-coffee-700"></div>
          </div>

          <InputField
            id="name"
            name="name"
            label="Full Name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon="👤"
            required
          />

          <InputField
            id="email"
            name="email"
            type="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon="📧"
            required
          />

          <InputField
            id="company"
            name="company"
            label="Company / Organization"
            value={formData.company}
            onChange={handleChange}
            icon="🏢"
          />
        </div>

        {/* Consultation Details Section */}
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-coffee-200 to-transparent dark:via-coffee-700"></div>
            <h3 className="px-4 text-sm font-semibold uppercase tracking-wider theme-transition" style={{ color: 'var(--body-text)' }}>
              Consultation Details
            </h3>
            <div className="h-px flex-grow bg-gradient-to-r from-transparent via-coffee-200 to-transparent dark:via-coffee-700"></div>
          </div>

          <SelectField
            id="experience"
            name="experience"
            label="Experience Level"
            value={formData.experience}
            onChange={handleChange}
            options={experienceOptions}
            icon="⭐"
          />

          <SelectField
            id="topic"
            name="topic"
            label="What would you like to discuss?"
            value={formData.topic}
            onChange={handleChange}
            error={errors.topic}
            options={[
              { value: "Code Review", label: "Code Review" },
              { value: "System Architecture", label: "System Architecture" },
              { value: "Career Advice", label: "Career Advice" },
              { value: "Technical Interview Prep", label: "Technical Interview Prep" },
              { value: "Project Planning", label: "Project Planning" },
              { value: "Technology Stack Decision", label: "Technology Stack Decision" },
              { value: "Performance Optimization", label: "Performance Optimization" },
              { value: "Best Practices", label: "Best Practices" },
              { value: "Other", label: "Other Topic" }
            ]}
            icon="💭"
            required
          />

          {/* Custom Topic Input - Show when "Other" is selected */}
          <div 
            className={`relative transition-all duration-300 overflow-hidden ${
              formData.topic === 'Other' ? 'max-h-[200px] opacity-100 mt-6' : 'max-h-0 opacity-0 mt-0'
            }`}
          >
            <textarea
              id='customTopic'
              name="customTopic"
              value={formData.customTopic}
              onChange={handleChange}
              autoFocus={formData.topic === 'Other'}
              className={`
                w-full px-4 py-4 pt-6 text-base
                border-2 rounded-lg transition-all duration-200
                bg-transparent resize-none
                ${errors.customTopic 
                  ? 'border-red-300 focus:border-red-500' 
                  : formData.customTopic 
                    ? 'border-green-300 focus:border-green-500' 
                    : 'border-coffee-200 focus:border-tech-500'
                }
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${errors.customTopic ? 'focus:ring-red-500/20' : 'focus:ring-tech-500/20'}
              `}
                rows="3"
              placeholder="Describe what you'd like to discuss..."
            />
            <label
              className={`
                absolute left-4 top-2 text-xs
                ${errors.customTopic ? 'text-red-500' : formData.customTopic ? 'text-green-600' : 'text-coffee-700'}
              `}
            >
              Your Custom Topic <span className="text-red-500">*</span>
            </label>
            {errors.customTopic && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠️</span> {errors.customTopic}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full btn-accent font-semibold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50"
            style={{ 
              borderColor: 'var(--card-border)',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            Continue to Confirmation
          </button>
        </div>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm theme-transition" style={{ color: 'var(--subtle-text)' }}>
          Fields marked with <span className="text-red-500">*</span> are required
        </p>
      </div>
    </div>
  );
};

export default ClientForm;