import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, ShoppingBag, Receipt, TrendingUp, Sparkles } from 'lucide-react';
import { ShopProvider } from './context/ShopContext';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Reports from './pages/Reports';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const links = [
    { title: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { title: 'New Bill', path: '/billing', icon: <Receipt size={20} /> },
    { title: 'Product Inventory', path: '/inventory', icon: <ShoppingBag size={20} /> },
    { title: 'Sales Reports', path: '/reports', icon: <TrendingUp size={20} /> },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 p-8 flex flex-col z-50">
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-pink-600 p-3 rounded-2xl shadow-xl shadow-pink-100">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight">Apsara</h1>
          <span className="text-[10px] font-black text-pink-600 uppercase tracking-widest">Ladies Shop</span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {links.map(link => (
          <Link 
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${
              isActive(link.path) 
                ? 'bg-pink-600 text-white shadow-lg shadow-pink-200' 
                : 'text-slate-500 hover:bg-pink-50 hover:text-pink-600'
            }`}
          >
            {link.icon}
            {link.title}
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-8 border-t border-slate-50 opacity-60">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Version 1.0.0 Business</p>
      </div>
    </nav>
  );
};

function App() {
  return (
    <ShopProvider>
      <Router>
        <div className="min-h-screen flex bg-slate-50 font-inter">
          <Navbar />
          <main className="flex-1 ml-72 p-12 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ShopProvider>
  );
}

export default App;
