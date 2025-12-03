import React from 'react'
import Select from 'react-select';

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    background: '#1f2937', // Màu xám gray-800
    borderColor: state.isFocused ? '#f43f5e' : '#4b5563',
    color: 'white',
    padding: '4px',
    borderRadius: '0.75rem',
  }),
  menu: (base) => ({
    ...base,
    background: '#1f2937',
    zIndex: 100 
  }),
  option: (base, state) => ({
    ...base,
    background: state.isFocused ? '#374151' : '#1f2937',
    color: 'white',
    cursor: 'pointer'
  }),
  multiValue: (base) => ({
    ...base,
    background: '#f43f5e',
    borderRadius: '0.25rem',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: 'white',
    fontWeight: 'bold',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: 'white',
    ':hover': {
      background: '#be123c',
      color: 'white',
    },
  }),
  input: (base) => ({
    ...base,
    color: 'white',
  }),
  singleValue: (base) => ({ 
    ...base,
    color: 'white',
  })
};

export default function CustomMultiSelect({ label, options, value, onChange, placeholder }) {
  return (
    <div className="mb-6">
        <label className="block text-gray-300 font-medium mb-2">
            {label}
        </label>
        <Select
            isMulti
            options={options}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            styles={customSelectStyles}
            className="text-base"
        />
        <p className="text-gray-500 text-sm mt-1">
            Selected: {value.length} items
        </p>
    </div>
  )
}
