import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, ShoppingBag, Receipt, TrendingUp, Sparkles, Menu, X } from 'lucide-react';
import { ShopProvider, useShop } from './context/ShopContext';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Reports from './pages/Reports';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t, theme, setTheme, activeTheme } = useShop();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const links = [
    { title: t.dashboard, path: '/', icon: <LayoutDashboard size={20} /> },
    { title: t.billing, path: '/billing', icon: <Receipt size={20} /> },
    { title: t.inventory, path: '/inventory', icon: <ShoppingBag size={20} /> },
    { title: t.reports, path: '/reports', icon: <TrendingUp size={20} /> },
  ];

  const themeColors = {
    pink: 'bg-pink-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    emerald: 'bg-emerald-600'
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-6 right-6 z-[60] p-4 ${themeColors[theme]} text-white rounded-2xl shadow-xl lg:hidden active:scale-90 transition-all`}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-slate-100 p-8 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3 mb-10">
          <div className={`${themeColors[theme]} p-3 rounded-2xl shadow-xl shadow-slate-200`}>
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-none tracking-tight">Apsara</h1>
            <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400`}>General Store</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          {links.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${
                isActive(link.path) 
                  ? `${themeColors[theme]} text-white shadow-lg shadow-slate-200` 
                  : `text-slate-500 hover:bg-slate-50 hover:text-slate-900`
              }`}
            >
              {link.icon}
              {link.title}
            </Link>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-50 space-y-6">
           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-3">Themes</p>
             <div className="flex gap-3 px-4">
                {['pink', 'blue', 'purple', 'emerald'].map(c => (
                  <button 
                    key={c}
                    onClick={() => setTheme(c)}
                    className={`w-8 h-8 rounded-full transition-all border-4 ${themeColors[c]} ${theme === c ? 'border-indigo-100 scale-125' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  />
                ))}
             </div>
           </div>

           <div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-4 mb-3">Language</p>
             <div className="flex gap-2 px-4">
                {['en', 'hi', 'mr'].map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`flex-1 py-2 rounded-lg font-bold text-[10px] uppercase transition-all ${lang === l ? `${themeColors[theme]} text-white shadow-md` : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                  >
                    {l === 'en' ? 'EN' : l === 'hi' ? 'HI' : 'MR'}
                  </button>
                ))}
             </div>
           </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-50 opacity-40">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Version 1.2.0 Business Pro</p>
        </div>
      </nav>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}
    </>
  );
};

function App() {
  return (
    <ShopProvider>
      <Router>
        <div className="min-h-screen flex bg-slate-50 font-inter overflow-x-hidden">
          <Navbar />
          <main className="flex-1 lg:ml-72 p-6 md:p-12 transition-all">
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
