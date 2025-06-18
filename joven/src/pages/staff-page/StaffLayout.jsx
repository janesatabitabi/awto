import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const StaffLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/staff-dashboard' },
    { label: 'Inventory', path: '/staff-inventory' },
    { label: 'Tasks', path: '/staff-tasks' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col py-6 px-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Staff Panel</h2>
        <nav className="flex flex-col gap-4 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-md hover:bg-gray-700 ${
                location.pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 p-8">{children}</main>
    </div>
  );
};

export default StaffLayout;
