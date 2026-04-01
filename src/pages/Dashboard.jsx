import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, ShoppingBag, Package, 
  IndianRupee, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

const StatCard = ({ title, value, icon, color }) => (
  <div className="p-6 bg-white border border-slate-100 rounded-[32px] flex flex-col justify-between shadow-sm hover:shadow-md transition-all group min-h-[160px] relative overflow-hidden">
    <div className="absolute -right-4 -top-4 w-24 h-24 theme-bg opacity-[0.03] rounded-full blur-2xl"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3.5 rounded-2xl ${color} transform group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-black uppercase tracking-widest leading-relaxed mb-1 line-clamp-1 opacity-60">{title}</p>
      <h2 className="text-3xl font-black text-black leading-tight truncate">{value}</h2>
    </div>
  </div>
);

const Dashboard = () => {
  const { products, orders, loading, t, activeTheme } = useShop();

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="font-black text-black uppercase tracking-widest text-xs">Apsara Loading...</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
  const remainingStock = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockProducts = products.filter(p => p.stock < 5);
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const stats = [
    { title: t.totalRevenue, value: `₹${totalRevenue}`, icon: <IndianRupee size={22} className="text-blue-600" />, color: 'bg-blue-50' },
    { title: t.stockValue, value: `₹${totalStockValue}`, icon: <Package size={22} className="text-emerald-600" />, color: 'bg-emerald-50' },
    { title: t.stockGela, value: totalSold, icon: <TrendingUp size={22} className="text-purple-600" />, color: 'bg-purple-50' },
    { title: t.stockShilak, value: remainingStock, icon: <ShoppingBag size={22} className="text-pink-600" />, color: 'bg-pink-50' },
    { title: t.varieties, value: products.length, icon: <Package size={22} className="text-orange-600" />, color: 'bg-orange-50' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-white p-8 md:p-12 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-80 h-80 theme-bg opacity-[0.03] blur-3xl -mr-40 -mt-40 rounded-full"></div>
         <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-black leading-none mb-3">{t.dashboard}</h1>
            <p className="text-black/40 font-black uppercase tracking-[0.4em] text-[10px]">Apsara General Store . {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
         </div>
         <div className="hidden lg:flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 relative z-10 mt-6 lg:mt-0">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-sm">
               <TrendingUp size={24} className="text-purple-600" />
            </div>
            <div>
               <p className="text-[10px] font-black text-black/40 uppercase tracking-widest">{t.totalRevenue}</p>
               <p className="text-xl font-black text-black">₹{totalRevenue}</p>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      <AnimatePresence>
        {lowStockProducts.length > 0 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="relative">
            <div className="bg-red-50 border border-red-100 p-8 rounded-[40px] flex items-center gap-8 shadow-sm shadow-red-900/5 overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 opacity-20 blur-2xl -mr-16 -mt-16 rounded-full"></div>
               <div className="w-16 h-16 bg-red-500 text-white rounded-3xl flex items-center justify-center shadow-lg shadow-red-500/30 flex-shrink-0">
                  <AlertTriangle size={32} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-red-900 leading-none mb-2">{t.inventoryAlert}</h3>
                  <p className="text-red-700/80 font-bold text-sm tracking-tight">{lowStockProducts.length} {t.lowStockDesc}</p>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-black flex items-center gap-4 mb-10 leading-none">
            <TrendingUp className="text-purple-600" /> {t.recentSales}
          </h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-5 hover:bg-slate-50 rounded-3xl transition-all border border-transparent hover:border-slate-100 group">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-2xl group-hover:bg-white border border-slate-100 text-black">🛍️</div>
                   <div>
                      <p className="font-black text-black text-sm uppercase tracking-tight">{order.customerName}</p>
                      <p className="text-[10px] font-bold text-black/30 mt-1">{new Date(order.date).toLocaleDateString()}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-lg font-black text-black leading-none mb-1">₹{order.total}</p>
                   <p className="text-[10px] font-black text-black/20 uppercase tracking-widest">#{order.id.slice(-6)}</p>
                </div>
              </div>
            ))}
            {orders.length === 0 && <p className="text-center py-20 text-black/20 font-black uppercase tracking-widest text-xs">{t.noSales}</p>}
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
          <h3 className="text-2xl font-black text-black flex items-center gap-4 mb-10 leading-none">
            <AlertTriangle className="text-orange-500" /> {t.criticalStock}
          </h3>
          <div className="space-y-4">
            {lowStockProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-5 bg-orange-50/50 border border-orange-100 rounded-3xl">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 bg-white flex items-center justify-center rounded-2xl shadow-sm"><AlertTriangle className="text-orange-500" size={18}/></div>
                   <div>
                      <p className="font-black text-black text-sm uppercase tracking-tight">{p.name}</p>
                      <p className="text-[10px] font-bold text-orange-600/60 mt-1 uppercase tracking-widest">{p.category}</p>
                   </div>
                </div>
                <div className="text-right">
                   <p className="text-lg font-black text-red-600 leading-none mb-1">{p.stock}</p>
                   <p className="text-[10px] font-black text-red-600/40 uppercase tracking-widest">{t.unitsLeft}</p>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
               <div className="text-center py-24 space-y-4">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-green-900/10"><CheckCircle size={32} /></div>
                  <p className="text-black/30 font-black uppercase tracking-widest text-[10px]">{t.healthyStock}</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
