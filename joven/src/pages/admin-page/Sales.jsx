import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Sector
} from 'recharts';

// Mock Sales Data
// In a real application, you would fetch this from an API or Firestore.
const mockMonthlySales = [
  { name: 'Jan', totalSales: 4000, newCustomers: 2400 },
  { name: 'Feb', totalSales: 3000, newCustomers: 1398 },
  { name: 'Mar', totalSales: 5000, newCustomers: 2800 },
  { name: 'Apr', totalSales: 4500, newCustomers: 3908 },
  { name: 'May', totalSales: 6000, newCustomers: 4800 },
  { name: 'Jun', totalSales: 5500, newCustomers: 3800 },
  { name: 'Jul', totalSales: 7000, newCustomers: 4300 },
];

const mockProductCategorySales = [
  { name: 'Passenger Car Tires', value: 400 },
  { name: 'SUV/Light Truck Tires', value: 300 },
  { name: 'Off-Road Tires', value: 200 },
  { name: 'Motorcycle Tires', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Main Sales component
const Sales = () => {
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [categorySalesData, setCategorySalesData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  useEffect(() => {
    // Simulate fetching data
    const fetchSalesData = () => {
      setMonthlySalesData(mockMonthlySales);
      setCategorySalesData(mockProductCategorySales);

      // Calculate total revenue and transactions from mock data
      const revenue = mockMonthlySales.reduce((acc, month) => acc + month.totalSales, 0);
      setTotalRevenue(revenue);
      setTotalTransactions(mockMonthlySales.length * 50); // Arbitrary number for transactions
    };

    fetchSalesData();
  }, []);

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

        .sales-overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

      <div className="sales-overview-grid">
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="metric-card">
          <h3>Total Transactions</h3>
          <p>{totalTransactions.toLocaleString()}</p>
        </div>
        {/* Add more metrics as needed */}
      </div>

      <div className="chart-section">
        <h3>Monthly Sales Trends</h3>
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
