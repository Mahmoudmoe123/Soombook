import React, { useState } from 'react';

const SearchFilters = ({ onFilterChange, originCountries }) => {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  return (
    <div className="mb-6">
      {/* Mobile Search Bar and Filter Toggle */}
      <div className="lg:hidden flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Search orders..."
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md flex items-center"
        >
          <FilterIcon className="h-5 w-5" />
          <span className="ml-2">Filters</span>
        </button>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden lg:block mb-4">
        <input
          type="text"
          placeholder="Search orders..."
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters - Mobile Dropdown / Desktop Always Visible */}
      <div className={`${isFiltersVisible ? 'block' : 'hidden'} lg:block space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4`}>
        {/* Category Filter */}
        <div className="relative">
          <select 
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            <option value="clothing">Clothing</option>
            <option value="beauty">Beauty and personal care</option>
            <option value="electronics">Electronics</option>
            <option value="home">Home and garden</option>
            <option value="sports">Sports and outdoors</option>
            <option value="toys">Toys and games</option>
            <option value="health">Health and wellness</option>
            <option value="automotive">Automotive</option>
          </select>
        </div>

        {/* Origin Country Filter */}
        <div className="relative">
          <select 
            onChange={(e) => onFilterChange('origin', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Origins</option>
            {originCountries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="relative">
          <select
            onChange={(e) => onFilterChange('priceRange', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Any Price</option>
            <option value="0-50">0 - 50 SDG</option>
            <option value="51-100">51 - 100 SDG</option>
            <option value="101-200">101 - 200 SDG</option>
            <option value="201-500">201 - 500 SDG</option>
            <option value="501+">500+ SDG</option>
          </select>
        </div>
      </div>
    </div>
  );
};

// Filter Icon Component
const FilterIcon = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
    />
  </svg>
);

export default SearchFilters;