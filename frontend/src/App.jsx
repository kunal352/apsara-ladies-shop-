import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, ShoppingBag, Receipt, TrendingUp, Sparkles } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Reports from './pages/Reports';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const links = [
    { title: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { title: 'Billing', path: '/billing', icon: <Receipt size={20} /> },
    { title: 'Inventory', path: '/inventory', icon: <ShoppingBag size={20} /> },
    { title: 'Reports', path: '/reports', icon: <TrendingUp size={20} /> },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200 p-8 flex flex-col z-50">
      <div className="flex items-center gap-3 mb-12">
        <div className="bg-apsara-pink p-3 rounded-2xl shadow-xl shadow-pink-100">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-none">Apsara</h1>
          <span className="text-xs font-semibold text-apsara-pink uppercase tracking-widest">Ladies Shop</span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {links.map(link => (
          <Link 
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all group ${
              isActive(link.path) 
                ? 'bg-apsara-pink text-white shadow-lg shadow-pink-200' 
                : 'text-slate-500 hover:bg-apsara-light hover:text-apsara-pink'
            }`}
          >
            <span className={isActive(link.path) ? 'text-white' : 'text-slate-400 group-hover:text-apsara-pink transition-colors'}>
              {link.icon}
            </span>
            {link.title}
          </Link>
        ))}
      </div>

      <div className="mt-auto pt-8 border-t border-slate-100">
         <div className="flex items-center gap-3 p-4 bg-apsara-light rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white overflow-hidden flex items-center justify-center text-slate-500 font-bold">
              AS
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Admin Staff</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-tighter">Boutique Manager</p>
            </div>
         </div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex bg-apsara-light">
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
  );
}

export default App;
