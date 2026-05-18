import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, ShoppingBag, Receipt, TrendingUp, Sparkles, Menu, X, ArrowRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopProvider, useShop } from './context/ShopContext';

import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Billing from './pages/Billing';
import Reports from './pages/Reports';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
        className={`fixed bottom-6 right-6 z-[60] p-5 ${themeColors[theme]} text-white rounded-2xl shadow-2xl lg:hidden active:scale-95 transition-all flex items-center justify-center hover:scale-110 active:opacity-90`}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <nav className={`fixed left-0 top-0 h-screen w-72 bg-white/70 backdrop-blur-2xl border-r border-white/20 p-6 flex flex-col z-50 transition-all duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:shadow-none shadow-[0_0_50px_rgba(0,0,0,0.1)]`}>
        {/* Logo Section */}
        <div className="flex items-center gap-4 mb-8 animate-fade-in">
          <div className={`${themeColors[theme]} p-3.5 rounded-2xl shadow-xl shadow-pink-500/20 rotate-6 hover:rotate-0 transition-all duration-500 cursor-pointer`}>
            <Sparkles className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 leading-none tracking-tight">Apsara</h1>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">General Store</span>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 min-h-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 mb-4">{t.mainMenu}</p>
          {links.map((link, idx) => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center justify-between px-5 py-4 rounded-[22px] font-bold transition-all duration-500 animate-slide-in relative overflow-hidden border-2 ${
                isActive(link.path) 
                ? 'bg-white border-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] scale-[1.02]' 
                : 'bg-white/40 border-transparent hover:bg-pink hover:border-pink hover:shadow-xl hover:-translate-y-1'
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`flex items-center gap-4 ${isActive(link.path) ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-800'}`}>
                <div className={`p-3 rounded-[16px] transition-all duration-500 ${
                  isActive(link.path) 
                    ? `${themeColors[theme]} text-white shadow-2xl shadow-pink-500/20 rotate-12` 
                    : 'bg-white shadow-sm group-hover:bg-slate-50 group-hover:rotate-6'
                }`}>
                  {React.cloneElement(link.icon, { size: 20 })}
                </div>
                <span className={`text-[15px] tracking-tight ${isActive(link.path) ? 'font-black' : 'font-bold'}`}>{link.title}</span>
              </div>
              {isActive(link.path) ? (
                <div className={`w-1.5 h-1.5 rounded-full ${themeColors[theme]} shadow-lg animate-pulse`} />
              ) : (
                <ArrowRight size={14} className="text-slate-200 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
              )}
            </Link>
          ))}
        </div>

        {/* Settings Button */}
        <div className="pt-6 mt-auto border-t border-slate-100 animate-fade-in">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="group flex items-center justify-between w-full px-5 py-4 rounded-[22px] font-bold transition-all duration-500 bg-white/40 border-2 border-transparent hover:bg-white hover:border-white hover:shadow-lg active:scale-95 text-slate-500 hover:text-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white shadow-sm rounded-[16px] group-hover:bg-slate-50 transition-all duration-500 flex items-center justify-center">
                <Settings size={20} className="text-slate-500 group-hover:text-slate-800 transition-transform duration-700 group-hover:rotate-90" />
              </div>
              <span className="text-[15px] tracking-tight">{t.settings || "सेटिंग्ज"}</span>
            </div>
            <ArrowRight size={14} className="text-slate-200 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        </div>
      </nav>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Settings Drawer */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-screen w-[400px] max-w-[90vw] bg-white/90 backdrop-blur-3xl border-l border-white/20 p-8 flex flex-col z-[101] shadow-[-20px_0_50px_rgba(0,0,0,0.15)]"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`${themeColors[theme]} p-3.5 rounded-2xl text-white shadow-lg shadow-pink-500/10`}>
                    <Settings size={20} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">{t.settings || "सेटिंग्ज"}</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.personalize || "थीम आणि भाषा"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-3 hover:bg-slate-100 rounded-xl transition-all active:scale-95 text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar min-h-0">
                {/* Language Select */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">{t.language}</h3>
                  <div className="grid grid-cols-3 gap-2 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                    {[
                      { id: 'en', label: 'EN' },
                      { id: 'hi', label: 'हिन्दी' },
                      { id: 'mr', label: 'मराठी' }
                    ].map(l => (
                      <button 
                        key={l.id}
                        onClick={() => setLang(l.id)}
                        className={`py-3 px-2 rounded-xl font-bold text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                          lang === l.id 
                            ? `${themeColors[theme]} text-white shadow-lg shadow-pink-500/10` 
                            : 'bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-100'
                        }`}
                      >
                        <span className="font-extrabold">{l.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selector */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">{t.personalize}</h3>
                  <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-4">
                    <div className="grid grid-cols-5 gap-3">
                      {['pink', 'blue', 'purple', 'emerald', 'dark'].map(c => (
                        <button 
                          key={c}
                          onClick={() => setTheme(c)}
                          className={`w-full aspect-square rounded-2xl transition-all relative flex items-center justify-center ${
                            c === 'dark' ? 'bg-slate-900' : themeColors[c]
                          } ${
                            theme === c 
                              ? 'scale-110 ring-4 ring-white shadow-xl rotate-12' 
                              : 'opacity-60 hover:opacity-100 hover:scale-105'
                          }`}
                        >
                          {theme === c && (
                            <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium text-center italic capitalize">
                      Active Theme: <span className="font-bold text-slate-600">{theme}</span>
                    </p>
                  </div>
                </div>

                {/* Connection Status */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Status</h3>
                  <div className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${
                    isOffline 
                      ? 'bg-orange-50/50 border-orange-100 text-orange-700' 
                      : 'bg-emerald-50/50 border-emerald-100 text-emerald-700'
                  }`}>
                    <div className={`w-3 h-3 rounded-full animate-pulse shadow-sm ${
                      isOffline ? 'bg-orange-500' : 'bg-emerald-500'
                    }`} />
                    <div>
                      <p className="text-xs font-black uppercase tracking-wider">{isOffline ? 'Offline Mode' : 'Online Mode'}</p>
                      <p className="text-[10px] opacity-75 font-bold mt-0.5">
                        {isOffline ? t.offlineMode : t.onlineMode}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-100 text-center space-y-2 mt-auto">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Business Pro • V1.3.0</p>
                <p className="text-[8px] text-slate-300 font-medium">All rights reserved &copy; {new Date().getFullYear()}</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
    <div className="min-h-screen flex bg-slate-50 transition-all duration-700 font-sans selection:bg-pink-100" style={{ backgroundColor: activeTheme.secondaryHex }}>
      <Navbar />
      <main className="flex-1 lg:ml-72 transition-all min-h-screen relative">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto min-h-screen animate-fade-in">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
        
        {/* Subtle Decorative Background Elements */}
        <div className="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="fixed bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      </main>
      
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            color: '#1e293b',
            fontWeight: '600',
            fontSize: '14px',
            padding: '18px 28px',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </div>
  );
}

export default App;
