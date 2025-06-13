import React, { useState, useEffect } from "react";
import "../styles/UserDashboard.css";
import "../styles/Filter.css";

const WHEEL_TIRE_FILTERS = [
  {
    name: "Brand",
    options: ["American Racing", "BBS", "Enkei", "Konig", "Rays", "Volk"],
    multiSelect: true,
  },
  {
    name: "Diameter",
    options: ['14"', '15"', '16"', '17"', '18"', '19"', '20"', '22"'],
    multiSelect: true,
  },
  {
    name: "Width",
    options: ['6"', '7"', '8"', '9"', '10"', '12"'],
    multiSelect: true,
  },
  {
    name: "Bolt Pattern",
    options: ["4x100", "5x114.3", "5x120", "6x139.7"],
    multiSelect: true,
  },
  {
    name: "Offset",
    options: ["+20", "+25", "+30", "+35", "+40"],
    multiSelect: true,
  },
  {
    name: "Lug Count",
    options: ["4", "5", "6"],
    multiSelect: true,
  },
  {
    name: "Material",
    options: [
      "Cast Aluminum",
      "Flow Formed Aluminum",
      "Forged Aluminum",
      "Steel",
    ],
    multiSelect: true,
  },
  {
    name: "Finish",
    options: ["Gloss Black", "Matte Black", "Chrome", "Silver", "Gunmetal"],
    multiSelect: true,
  },
  {
    name: "New",
    options: ["Yes"],
    multiSelect: false,
  },
  {
    name: "Price Range",
    options: ["$0 - $100", "$100 - $200", "$200 - $300", "$300+"],
    multiSelect: false,
  },
];

const Filter = ({ onChange }) => {
  const [expanded, setExpanded] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    const filtersToSend = Object.fromEntries(
      Object.entries(selectedFilters).map(([key, set]) => [
        key,
        Array.from(set),
      ])
    );
    onChange && onChange(filtersToSend);
  }, [selectedFilters, onChange]);

  const toggleExpand = (filterName) => {
    setExpanded((prev) =>
      prev.includes(filterName)
        ? prev.filter((name) => name !== filterName)
        : [...prev, filterName]
    );
  };

  const toggleOption = (filterName, option, multiSelect) => {
    setSelectedFilters((prev) => {
      const currentSet = new Set(prev[filterName] || []);
      if (currentSet.has(option)) {
        currentSet.delete(option);
      } else {
        if (!multiSelect) {
          return { ...prev, [filterName]: new Set([option]) };
        }
        currentSet.add(option);
      }
      return { ...prev, [filterName]: currentSet };
    });
  };

  const clearFilter = (filterName) => {
    setSelectedFilters((prev) => {
      const copy = { ...prev };
      delete copy[filterName];
      return copy;
    });
  };

  const clearAll = () => {
    setSelectedFilters({});
  };

  return (
    <div className="filters">
      <div className="filters-header">
        <h3>Active Filters ({Object.keys(selectedFilters).length})</h3>
        {Object.keys(selectedFilters).length > 0 && (
          <button onClick={clearAll} className="clear-btn">
            Clear All
          </button>
        )}
      </div>

      {WHEEL_TIRE_FILTERS.map(({ name, options, multiSelect }) => {
        const isExpanded = expanded.includes(name);
        const selectedSet = selectedFilters[name] || new Set();

        return (
          <div key={name}>
            <div
              className="filter-header"
              onClick={() => toggleExpand(name)}
              tabIndex={0}
              role="button"
              aria-expanded={isExpanded}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleExpand(name);
              }}
            >
              <span>{name}</span>
              <button
                className="clear-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter(name);
                }}
                aria-label={`Clear filter ${name}`}
                disabled={selectedSet.size === 0}
                type="button"
              >
                &times;
              </button>
              <span>{isExpanded ? "-" : "+"}</span>
            </div>

            {isExpanded && (
              <div className="filter-content" role="group" aria-label={`${name} filter options`}>
                {options.map((option) => {
                  const selected = selectedSet.has(option);
                  return (
                    <div
                      key={option}
                      className={`filter-option ${selected ? "selected" : ""}`}
                      onClick={() => toggleOption(name, option, multiSelect)}
                      tabIndex={0}
                      role="checkbox"
                      aria-checked={selected}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          toggleOption(name, option, multiSelect);
                        }
                      }}
                    >
                      {option}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Filter;
