import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

const CustomDropdown = ({ value, onChange, options, placeholder = "Select option", icon: Icon = Filter }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px',outline:'none' }}>
      <Icon size={16} style={{ color: 'var(--gray-500)' }} />
      
      <div 
        ref={dropdownRef}
        style={{ 
          position: 'relative',
          minWidth: '160px'
        }}
      >
        {/* Dropdown Trigger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            backgroundColor: 'var(--white)',
            border: '1.5px solid var(--border)',
            borderRadius: '8px',
            fontSize: '14px',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            outline: 'none',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            ...(isOpen && {
              borderColor: 'var(--black)',
              boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
            })
          }}
          onMouseEnter={(e) => {
            if (!isOpen) {
              e.target.style.borderColor = 'var(--gray-300)';
              e.target.style.backgroundColor = 'var(--gray-50)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isOpen) {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.backgroundColor = 'var(--white)';
            }
          }}
        >
          <span>{selectedOption?.label || placeholder}</span>
          <ChevronDown 
            size={16} 
            style={{ 
              color: 'var(--gray-500)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} 
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '0',
              right: '0',
              marginTop: '4px',
              backgroundColor: 'var(--white)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              zIndex: 1000,
              overflow: 'hidden',
              animation: 'fadeIn 0.15s ease-out'
            }}
          >
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                style={{
                  width: '100%',
                  display: 'block',
                  padding: '10px 12px',
                  fontSize: '14px',
                  color: option.value === value ? 'var(--black)' : 'var(--text-secondary)',
                  backgroundColor: option.value === value ? 'var(--gray-50)' : 'var(--white)',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  borderBottom: index < options.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  fontWeight: option.value === value ? '600' : '400',
                  outline:"none"
                }}
                onMouseEnter={(e) => {
                  if (option.value !== value) {
                    e.target.style.backgroundColor = 'var(--gray-50)';
                    e.target.style.color = 'var(--black)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (option.value !== value) {
                    e.target.style.backgroundColor = 'var(--white)';
                    e.target.style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Add fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CustomDropdown;