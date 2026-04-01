import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, ShoppingBag, Receipt, TrendingUp, Sparkles, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopProvider, useShop } from './context/ShopContext';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Reports from './pages/Reports';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, setLang, t, theme, setTheme, activeTheme, isOffline } = useShop();
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
        className={`fixed bottom-6 right-6 z-[60] p-5 ${themeColors[theme]} text-white rounded-2xl shadow-2xl lg:hidden active:scale-95 transition-all flex items-center justify-center hover:scale-105`}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <nav className={`fixed left-0 top-0 h-screen w-72 bg-white/95 backdrop-blur-md border-r border-slate-100 p-8 flex flex-col z-50 transition-all duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl lg:shadow-none`}>
        <div className="flex items-center gap-4 mb-12">
          <div className={`${themeColors[theme]} p-3.5 rounded-2xl shadow-xl shadow-slate-200 rotate-3`}>
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-black leading-none tracking-tight">Apsara</h1>
            <span className={`text-[10px] font-black uppercase tracking-[0.3em] text-black/40`}>General Store</span>
          </div>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 mb-6">
          <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] px-4 mb-4">{t.mainMenu}</p>
          {links.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black transition-all duration-300 ${
                isActive(link.path) 
                   ? `${themeColors[theme]} text-white shadow-xl shadow-slate-200 scale-[1.02]` 
                   : `text-black/60 hover:bg-slate-50 hover:text-black`
              }`}
            >
              {React.cloneElement(link.icon, { size: 22 })}
              <span className="text-sm tracking-wide">{link.title}</span>
            </Link>
          ))}
        </div>

        <div className="mt-auto space-y-8">
           <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
             <div className="mb-6">
               <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-4">{t.personalize}</p>
               <div className="flex justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                  {['pink', 'blue', 'purple', 'emerald'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setTheme(c)}
                      className={`w-8 h-8 rounded-xl transition-all ${themeColors[c]} ${theme === c ? 'scale-110 shadow-lg ring-4 ring-white' : 'opacity-30 hover:opacity-100 scale-90'}`}
                    />
                  ))}
               </div>
             </div>

             <div className="mb-6">
               <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-4">{t.language}</p>
               <div className="flex gap-2">
                  {[
                    { id: 'en', label: 'English' },
                    { id: 'hi', label: 'हिन्दी' },
                    { id: 'mr', label: 'मराठी' }
                  ].map(l => (
                    <button 
                      key={l.id}
                      onClick={() => setLang(l.id)}
                      className={`flex-1 py-3 rounded-xl font-black text-[10px] transition-all border ${lang === l.id ? `${themeColors[theme]} text-white border-transparent shadow-lg` : 'bg-white text-black/40 border-slate-100 hover:bg-slate-50'}`}
                    >
                      {l.label}
                    </button>
                  ))}
               </div>
             </div>

             <div className={`mt-6 flex items-center gap-2 p-3 rounded-xl border ${isOffline ? 'bg-orange-50 border-orange-100 text-orange-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${isOffline ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                <p className="text-[9px] font-black uppercase tracking-wider">{isOffline ? t.offlineMode : t.onlineMode}</p>
             </div>
           </div>

           <div className="text-center pb-4">
              <p className="text-[9px] font-black text-black/20 uppercase tracking-[0.3em]">Business Pro Edition</p>
              <p className="text-[8px] font-bold text-black/20 mt-1">V 1.2.0 • Build 2024</p>
           </div>
        </div>
      </nav>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-40 lg:hidden"
        />
      )}
    </>
  );
};

function App() {
  return (
    <ShopProvider>
      <Router>
        <ThemeContainer />
      </Router>
    </ShopProvider>
  );
}

const ThemeContainer = () => {
  const { activeTheme } = useShop();

  React.useEffect(() => {
    document.documentElement.style.setProperty('--primary', activeTheme.hex);
    document.documentElement.style.setProperty('--secondary', activeTheme.secondaryHex);
  }, [activeTheme]);
  
  return (
    <div className="min-h-screen flex bg-slate-50 transition-colors duration-500" style={{ backgroundColor: activeTheme.secondaryHex }}>
      <Navbar />
      <main className="flex-1 lg:ml-72 transition-all min-h-screen">
        <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </main>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            borderRadius: '20px',
            background: '#fff',
            color: '#000',
            fontWeight: 'bold',
            padding: '16px 24px',
            border: '1px solid #f1f5f9',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          },
        }}
      />
    </div>
  );
}

export default App;
