import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ShoppingBag, Package, 
  IndianRupee, AlertTriangle, CheckCircle,
  ArrowUpRight, Users, Calendar, Sparkles
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const StatCard = ({ title, value, icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="p-8 glass-card rounded-[38px] flex flex-col justify-between premium-shadow group hover:bg-white transition-all duration-500 min-h-[180px] relative overflow-hidden active:scale-95 cursor-pointer"
  >
    {/* Decorative blur */}
    <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-[40px] opacity-10 transition-all duration-700 group-hover:scale-150 group-hover:opacity-20 ${color.replace('text', 'bg')}`}></div>
    
    <div className="flex justify-between items-start relative z-10">
      <div className={`p-4 rounded-[22px] ${color} bg-white shadow-xl shadow-slate-200/50 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div className="p-2 rounded-full hover:bg-slate-50 transition-colors">
        <ArrowUpRight size={18} className="text-slate-300" />
      </div>
    </div>

    <div className="relative z-10 mt-6">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-relaxed">{title}</p>
      <div className="flex items-baseline gap-1">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none truncate">{value}</h2>
      </div>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { products, orders, loading, t } = useShop();

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-[5px] border-slate-100 border-t-pink-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-pink-600/30" size={20} />
        </div>
        <p className="font-black text-slate-400 uppercase tracking-[0.5em] text-[10px] animate-pulse">Apsara Loading</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
  const remainingStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const lowStockProducts = products.filter(p => p.stock < 5);
  const totalStockValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

  const stats = [
    { title: t.totalRevenue, value: `₹${totalRevenue.toLocaleString()}`, icon: <IndianRupee />, color: 'text-indigo-600', delay: 0.1 },
    { title: t.stockValue, value: `₹${totalStockValue.toLocaleString()}`, icon: <Package />, color: 'text-emerald-600', delay: 0.2 },
    { title: t.stockGela, value: totalSold, icon: <TrendingUp />, color: 'text-purple-600', delay: 0.3 },
    { title: t.stockShilak, value: remainingStock, icon: <ShoppingBag />, color: 'text-pink-600', delay: 0.4 },
    { title: t.varieties, value: products.length, icon: <Sparkles />, color: 'text-amber-600', delay: 0.5 },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row justify-between items-end lg:items-center gap-8 bg-white/40 backdrop-blur-xl p-10 md:p-14 rounded-[48px] border border-white/60 premium-shadow relative overflow-hidden group">
         <div className="absolute top-[-10%] right-[-5%] w-64 h-64 theme-bg opacity-[0.05] blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
         
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 rounded-[32px] theme-bg flex items-center justify-center p-1 shadow-2xl shadow-pink-500/30 group-hover:rotate-12 transition-all duration-700">
              <div className="w-full h-full bg-white/20 rounded-[24px] backdrop-blur-md flex items-center justify-center">
                 <Sparkles className="text-white" size={36} />
              </div>
            </div>
            <div className="text-center md:text-left">
               <h1 className="text-4xl md:text-6xl font-black text-slate-800 leading-none mb-4 tracking-tighter">{t.dashboard}</h1>
               <div className="flex items-center justify-center md:justify-start gap-4 text-slate-400">
                  <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <Calendar size={12} className="text-pink-500" />
                    {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-white text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <Users size={12} className="text-blue-500" />
                    Admin Pro
                  </div>
               </div>
            </div>
         </div>

         <div className="hidden lg:flex items-center gap-6 bg-white/80 p-6 rounded-[32px] border border-white shadow-xl shadow-slate-200/50 relative z-10">
            <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-2xl shadow-inner group/icon">
               <TrendingUp size={30} className="text-purple-600 group-hover/icon:scale-125 transition-transform" />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.totalRevenue} Today</p>
               <div className="flex items-center gap-2">
                 <p className="text-3xl font-black text-slate-800">₹{totalRevenue.toLocaleString()}</p>
                 <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-lg">+12%</span>
               </div>
            </div>
         </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      <AnimatePresence>
        {lowStockProducts.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="group cursor-pointer"
          >
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 p-10 rounded-[48px] flex flex-col md:flex-row items-center gap-10 premium-shadow group-hover:scale-[1.01] transition-all duration-500 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-red-400/5 blur-[80px] -mr-32 -mt-32 rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
               
               <div className="w-20 h-20 bg-red-500 text-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-red-500/40 shrink-0 group-hover:rotate-12 transition-transform duration-500">
                  <AlertTriangle size={36} />
               </div>
               <div className="text-center md:text-left flex-1">
                  <h3 className="text-3xl font-black text-red-900 leading-tight mb-2 tracking-tight">{t.inventoryAlert}</h3>
                  <p className="text-red-700/70 font-bold text-base tracking-tight">{lowStockProducts.length} {t.lowStockDesc}</p>
               </div>
               <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/10 hover:bg-red-600 hover:text-white transition-all">
                 Fix Inventory
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Recent Sales Section */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
           <div className="flex items-center justify-between px-6">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-4 uppercase text-[20px]">
                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600"><TrendingUp size={24}/></div>
                {t.recentSales}
              </h3>
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-pink-600 transition-colors">See Detailed Report</button>
           </div>
           
           <div className="glass-card p-10 rounded-[48px] premium-shadow space-y-4">
              {orders.slice(0, 5).map((order, idx) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + (idx * 0.1) }}
                  key={order.id} 
                  className="flex items-center justify-between p-6 hover:bg-slate-50 rounded-[32px] transition-all border border-transparent hover:border-slate-100 group"
                >
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-white flex items-center justify-center rounded-[24px] shadow-sm group-hover:bg-slate-50 transition-colors">
                        <span className="text-2xl">🛍️</span>
                     </div>
                     <div>
                        <p className="font-black text-slate-800 text-lg tracking-tight mb-1 group-hover:text-pink-600 transition-colors">{order.customerName}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black bg-slate-100 text-slate-400 px-2 py-1 rounded-lg uppercase tracking-widest group-hover:bg-white group-hover:text-slate-500 transition-all">#{order.id.slice(-6)}</span>
                          <span className="text-[11px] font-bold text-slate-300">{new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-2xl font-black text-slate-800 tracking-tight leading-none mb-1">₹{order.total.toLocaleString()}</p>
                     <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-50 px-2 py-1 rounded-md">Paid Successful</p>
                  </div>
                </motion.div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-32 space-y-6">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag size={32} className="text-slate-200" />
                  </div>
                  <p className="text-slate-300 font-extrabold uppercase tracking-[0.4em] text-[10px]">{t.noSales}</p>
                </div>
              )}
           </div>
        </div>

        {/* Critical Stock Section */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
           <div className="flex items-center justify-between px-6">
              <h3 className="text-3xl font-black text-slate-800 tracking-tighter flex items-center gap-4 uppercase text-[20px]">
                <div className="p-3 bg-amber-50 rounded-2xl text-amber-600"><AlertTriangle size={24}/></div>
                {t.criticalStock}
              </h3>
           </div>

           <div className="bg-slate-900 p-10 rounded-[48px] shadow-2xl shadow-slate-950/20 space-y-4">
              {lowStockProducts.map((p, idx) => (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  key={p.id} 
                  className="flex items-center justify-between p-6 bg-slate-800/50 hover:bg-slate-800 rounded-[32px] border border-slate-700/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                     <div className="w-14 h-14 bg-red-500/10 text-red-500 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">
                        <AlertTriangle size={20}/>
                     </div>
                     <div>
                        <p className="font-black text-white text-base tracking-tight mb-1">{p.name}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{p.category}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <div className="bg-red-500/10 text-red-500 px-4 py-2 rounded-2xl border border-red-500/20">
                        <p className="text-xl font-black leading-none mb-1">{p.stock}</p>
                        <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Shilak</p>
                     </div>
                  </div>
                </motion.div>
              ))}
              {lowStockProducts.length === 0 && (
                 <div className="text-center py-32 space-y-6">
                    <div className="w-20 h-20 bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto shadow-inner">
                       <CheckCircle size={36} className="text-emerald-500/30" />
                    </div>
                    <p className="text-slate-500 font-extrabold uppercase tracking-[0.4em] text-[10px]">{t.healthyStock}</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
