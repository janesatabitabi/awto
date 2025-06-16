import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Sector
} from 'recharts';

// Enhanced Mock Sales Data with year
const allMonthlySales = [
  { name: 'Jan', year: 2024, totalSales: 4000, newCustomers: 2400 },
  { name: 'Feb', year: 2024, totalSales: 3000, newCustomers: 1398 },
  { name: 'Mar', year: 2024, totalSales: 5000, newCustomers: 2800 },
  { name: 'Apr', year: 2024, totalSales: 4500, newCustomers: 3908 },
  { name: 'May', year: 2024, totalSales: 6000, newCustomers: 4800 },
  { name: 'Jun', year: 2024, totalSales: 5500, newCustomers: 3800 },
  { name: 'Jul', year: 2024, totalSales: 7000, newCustomers: 4300 },
  { name: 'Aug', year: 2024, totalSales: 6200, newCustomers: 4000 },
  { name: 'Sep', year: 2024, totalSales: 6800, newCustomers: 4500 },
  { name: 'Oct', year: 2024, totalSales: 7500, newCustomers: 5000 },
  { name: 'Nov', year: 2024, totalSales: 8000, newCustomers: 5200 },
  { name: 'Dec', year: 2024, totalSales: 9000, newCustomers: 5500 },
  { name: 'Jan', year: 2025, totalSales: 7500, newCustomers: 4800 },
  { name: 'Feb', year: 2025, totalSales: 6800, newCustomers: 4200 },
  { name: 'Mar', year: 2025, totalSales: 8500, newCustomers: 5100 },
];

const mockProductCategorySales = [
  { name: 'Passenger Car Tires', value: 400 },
  { name: 'SUV/Light Truck Tires', value: 300 },
  { name: 'Off-Road Tires', value: 200 },
  { name: 'Motorcycle Tires', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Sales = () => {
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [categorySalesData, setCategorySalesData] = useState(mockProductCategorySales); // Fixed category sales for simplicity
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [todaysSales, setTodaysSales] = useState(1250); // Mock for today's sales

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState('All'); // 'All' or month name

  // Extract unique years from mock data
  const availableYears = Array.from(new Set(allMonthlySales.map(d => d.year.toString()))).sort((a, b) => b - a);
  const availableMonths = ['All', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Effect to filter monthly sales data based on selected year/month
  useEffect(() => {
    let filteredData = allMonthlySales;

    if (selectedYear !== 'All') {
      filteredData = filteredData.filter(d => d.year.toString() === selectedYear);
    }
    if (selectedMonth !== 'All') {
      filteredData = filteredData.filter(d => d.name === selectedMonth);
    }

    setMonthlySalesData(filteredData);

    // Recalculate total revenue and transactions for the filtered data
    const revenue = filteredData.reduce((acc, month) => acc + month.totalSales, 0);
    setTotalRevenue(revenue);
    setTotalTransactions(filteredData.length * 50); // Simple arbitrary transaction count for filtered data
  }, [selectedYear, selectedMonth]);


  return (
    <div className="sales-page-container">
      {/* Embedded CSS for this component */}
      <style>
        {`
        /* Keyframe animations for sections */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .sales-page-container {
          padding: 2rem;
          background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%); /* Light blue to white gradient */
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
          color: #333;
        }

        .sales-page-title {
          font-size: 2.8rem; /* Larger title */
          font-weight: 800;
          color: #0d47a1; /* Darker blue */
          margin-bottom: 2rem;
          padding-bottom: 0.5rem;
          border-bottom: 5px solid #64b5f6; /* Thicker, brighter blue border */
          display: inline-block;
          border-radius: 0.5rem; /* Slightly more rounded */
          padding-left: 0.75rem;
          padding-right: 0.75rem;
          animation: fadeIn 0.5s ease-out;
        }

        .sales-filter-controls {
            background-color: #ffffff;
            padding: 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
            border: 1px solid #e3f2fd;
            margin-bottom: 2rem;
            display: flex;
            flex-wrap: wrap; /* Allow wrapping on smaller screens */
            gap: 1rem;
            align-items: center;
            animation: fadeIn 0.7s ease-out 0.1s forwards;
            opacity: 0;
        }

        .sales-filter-controls label {
            font-weight: 600;
            color: #424242;
            margin-right: 0.5rem;
        }

        .sales-filter-controls select {
            padding: 0.6rem 1rem;
            border: 1px solid #bbdefb; /* Light blue border */
            border-radius: 0.5rem;
            background-color: #e3f2fd; /* Very light blue background */
            font-size: 1rem;
            color: #0d47a1; /* Darker blue text */
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            appearance: none; /* Remove default select arrow */
            background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>');
            background-repeat: no-repeat;
            background-position: right 0.7rem center;
            background-size: 1em;
        }

        .sales-filter-controls select:hover {
            border-color: #64b5f6;
            background-color: #cde2f8; /* Slightly darker light blue */
        }

        .sales-filter-controls select:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.4); /* Blue focus ring */
        }

        .sales-overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Min width reduced slightly */
          gap: 1.5rem;
          margin-bottom: 2rem;
          animation: fadeIn 0.7s ease-out 0.2s forwards;
          opacity: 0; /* Start hidden for animation */
        }

        .metric-card {
          background-color: #ffffff;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          border: 1px solid #e3f2fd; /* Light blue border */
          text-align: center;
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }

        .metric-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
        }

        .metric-card h3 {
          font-size: 1.2rem;
          color: #424242;
          margin-bottom: 0.5rem;
        }

        .metric-card p {
          font-size: 2.2rem; /* Larger metric value */
          font-weight: 700;
          color: #1976d2; /* Vibrant blue */
        }

        .chart-section {
          background-color: #ffffff;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
          border: 1px solid #e3f2fd;
          margin-bottom: 1.5rem;
          animation: fadeIn 0.7s ease-out 0.4s forwards;
          opacity: 0; /* Start hidden for animation */
        }

        .chart-section h3 {
          font-size: 1.6rem;
          color: #3f51b5; /* Indigo */
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .charts-container {
          display: grid;
          grid-template-columns: 1fr; /* Single column for small screens */
          gap: 2rem;
        }

        @media (min-width: 768px) {
          .charts-container {
            grid-template-columns: 1fr 1fr; /* Two columns for larger screens */
          }
        }
        
        .responsive-chart {
            width: 100%; /* Ensure responsive container works */
            height: 300px; /* Set a fixed height for charts */
        }
        `}
      </style>

      <h1 className="sales-page-title">Sales Overview</h1>

      <div className="sales-filter-controls">
        <label htmlFor="year-select">Filter by Year:</label>
        <select id="year-select" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
          <option value="All">All Years</option>
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <label htmlFor="month-select">Filter by Month:</label>
        <select id="month-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {availableMonths.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      <div className="sales-overview-grid">
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="metric-card">
          <h3>Total Transactions</h3>
          <p>{totalTransactions.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <h3>Today's Sales</h3>
          <p>${todaysSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="chart-section">
        <h3>Monthly Sales Trends {selectedYear !== 'All' && `for ${selectedYear}`}</h3>
        <div className="responsive-chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlySalesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#616161" />
              <YAxis stroke="#616161" />
              <Tooltip
                contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                labelStyle={{ color: '#424242' }}
              />
              <Legend wrapperStyle={{ paddingTop: '10px' }} />
              <Line type="monotone" dataKey="totalSales" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
              <Line type="monotone" dataKey="newCustomers" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-section">
        <h3>Sales by Product Category</h3>
        <div className="charts-container">
          <div className="responsive-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categorySalesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} stroke="#616161" />
                <YAxis stroke="#616161" />
                <Tooltip
                  contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  labelStyle={{ color: '#424242' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="value" fill="#82ca9d" radius={[10, 10, 0, 0]}>
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="responsive-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={categorySalesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: '0.5rem', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  labelStyle={{ color: '#424242' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
