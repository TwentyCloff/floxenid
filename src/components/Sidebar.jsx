import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();

  const menu = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Support', path: '/dashboard/support' },
    { name: 'Admin Support', path: '/dashboard/admin-support' },
    { name: 'Pricing', path: '/pricing' }
  ];

  return (
    <aside className="w-64 bg-white border-r shadow-md p-4 space-y-4">
      <h2 className="text-xl font-bold">🧩 My Dashboard</h2>
      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`p-2 rounded hover:bg-indigo-100 ${
              pathname === item.path ? 'bg-indigo-100 font-semibold' : ''
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
