import React, { useState } from "react";
import "../styles/UserDashboard.css";
import "../styles/Filter.css"; // Update path based on your folder structure


const Filter = () => {
  const [expanded, setExpanded] = useState([]);
  const [activeFilters, setActiveFilters] = useState({ Brand: "Example" });

  const filters = [
    "Brand", "New", "Finish", "Diameter", "Width",
    "Bolt Pattern", "Offset", "Size", "Lug Count", "Material", "Price"
  ];

  const toggle = (index) => {
    setExpanded(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const handleSelectOption = (filterName, optionValue) => {
    setActiveFilters(prev => ({ ...prev, [filterName]: optionValue }));
  };

  return (
    <div className="filters">
      <div className="filters-header">
        <h3>Active Filters ({Object.keys(activeFilters).length})</h3>
        {Object.keys(activeFilters).length > 0 && (
          <button onClick={clearFilters} className="clear-btn">Clear All</button>
        )}
      </div>

      {filters.map((filter, idx) => (
        <div key={idx}>
          <div className="filter-header" onClick={() => toggle(idx)}>
            {filter} <span>{expanded.includes(idx) ? "-" : "+"}</span>
          </div>

          {expanded.includes(idx) && (
            <div className="filter-content">
              <div
                className="filter-option"
                onClick={() => handleSelectOption(filter, `${filter} Option 1`)}
              >
                {filter} Option 1
              </div>
              <div
                className="filter-option"
                onClick={() => handleSelectOption(filter, `${filter} Option 2`)}
              >
                {filter} Option 2
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Filter;
