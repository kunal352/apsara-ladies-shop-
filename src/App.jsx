import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LayoutDashboard, ShoppingBag, Receipt, TrendingUp, Sparkles, Menu, X, ArrowRight } from 'lucide-react';
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
        className={`fixed bottom-6 right-6 z-[60] p-5 ${themeColors[theme]} text-white rounded-2xl shadow-2xl lg:hidden active:scale-95 transition-all flex items-center justify-center hover:scale-110 active:opacity-90`}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <nav className={`fixed left-0 top-0 h-screen w-72 bg-white/70 backdrop-blur-2xl border-r border-white/20 p-8 flex flex-col z-50 transition-all duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:shadow-none shadow-[0_0_50px_rgba(0,0,0,0.1)]`}>
        {/* Logo Section */}
        <div className="flex items-center gap-4 mb-20 animate-fade-in">
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
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-4 mb-8">{t.mainMenu}</p>
          {links.map((link, idx) => (
            <Link 
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`group flex items-center justify-between px-6 py-6 rounded-[28px] font-bold transition-all duration-500 animate-slide-in relative overflow-hidden border-2 ${
                isActive(link.path) 
                ? 'bg-white border-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] scale-[1.02]' 
                : 'bg-white/40 border-transparent hover:bg-pink hover:border-pink hover:shadow-xl hover:-translate-y-1'
              }`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`flex items-center gap-5 ${isActive(link.path) ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-800'}`}>
                <div className={`p-4 rounded-[22px] transition-all duration-500 ${
                  isActive(link.path) 
                    ? `${themeColors[theme]} text-white shadow-2xl shadow-pink-500/20 rotate-12` 
                    : 'bg-white shadow-sm group-hover:bg-slate-50 group-hover:rotate-6'
                }`}>
                  {React.cloneElement(link.icon, { size: 24 })}
                </div>
                <span className={`text-[17px] tracking-tight ${isActive(link.path) ? 'font-black' : 'font-bold'}`}>{link.title}</span>
              </div>
              {isActive(link.path) ? (
                <div className={`w-2 h-2 rounded-full ${themeColors[theme]} shadow-lg animate-pulse`} />
              ) : (
                <ArrowRight size={16} className="text-slate-200 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
              )}
            </Link>
          ))}
        </div>

        {/* Config Section */}
        <div className="pt-8 mt-4 border-t border-slate-100 space-y-4 animate-fade-in">
           <div className="bg-slate-50/50 p-6 rounded-[28px] border border-white/50 premium-shadow space-y-6">
             <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t.language}</p>
               <div className="flex gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
                  {[
                    { id: 'en', label: 'EN' },
                    { id: 'hi', label: 'हिन्दी' },
                    { id: 'mr', label: 'मराठी' }
                  ].map(l => (
                    <button 
                      key={l.id}
                      onClick={() => setLang(l.id)}
                      className={`flex-1 py-2.5 rounded-xl font-bold text-[10px] transition-all ${lang === l.id ? `${themeColors[theme]} text-white shadow-xl` : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                    >
                      {l.label}
                    </button>
                  ))}
               </div>
             </div>

             <div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t.personalize}</p>
               <div className="flex justify-between items-center bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm">
                  {['pink', 'blue', 'purple', 'emerald'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setTheme(c)}
                      className={`w-7 h-7 rounded-[12px] transition-all ${themeColors[c]} ${theme === c ? 'scale-125 ring-4 ring-white shadow-xl rotate-12' : 'opacity-40 hover:opacity-100 hover:scale-110'}`}
                    />
                  ))}
               </div>
             </div>

             <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${isOffline ? 'bg-orange-50/50 border-orange-100 text-orange-600' : 'bg-emerald-50/50 border-emerald-100 text-emerald-600'}`}>
                <div className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-sm ${isOffline ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
                <p className="text-[9px] font-black uppercase tracking-wider">{isOffline ? t.offlineMode : t.onlineMode}</p>
             </div>
           </div>

           <div className="text-center opacity-30 py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-800">Business Pro • V1.3.0</p>
           </div>
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
        <div className="p-4 md:p-8 lg:p-14 max-w-[1600px] mx-auto min-h-screen animate-fade-in">
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
