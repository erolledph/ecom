'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { isOnTrial, hasTrialExpired, getTrialDaysRemaining } from '@/lib/auth';

interface CustomToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  title?: string;
  isPremiumFeature?: boolean;
}

export default function CustomToggle({
  id,
  label,
  description,
  checked,
  onChange,
  disabled = false,
  title,
  isPremiumFeature = false
}: CustomToggleProps) {
  const { userProfile } = useAuth();
  
  const handleToggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  // Generate dynamic title for premium features
  const getDynamicTitle = () => {
    if (!isPremiumFeature || !userProfile) return title;

    return title || 'Premium Access Required';
  };
  return (
    <div className="flex items-start justify-between py-3 sm:py-4">
      <div className="flex-1 min-w-0 mr-3 sm:mr-4">
        <label htmlFor={id} className="block text-xs sm:text-sm font-medium text-gray-900 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="mt-1 text-xs sm:text-sm text-gray-500">{description}</p>
        )}
      </div>
      
      <div className="flex-shrink-0 relative group">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-labelledby={id}
          onClick={handleToggle}
          disabled={disabled}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
            ${checked ? 'bg-primary-600' : 'bg-gray-200'}
            ${disabled ? 'opacity-30 cursor-not-allowed' : ''}
          `}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>

        {disabled && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs sm:text-sm rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {getDynamicTitle()}
          </div>
        )}
        
        {/* Hidden checkbox for form compatibility */}
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
