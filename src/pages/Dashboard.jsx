import React from 'react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Package, AlertTriangle, IndianRupee, CheckCircle } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="p-6 bg-white border border-slate-100 rounded-[32px] flex flex-col justify-between shadow-sm hover:shadow-md transition-all group min-h-[160px] relative overflow-hidden">
    <div className="absolute -right-4 -top-4 w-24 h-24 theme-bg opacity-[0.03] rounded-full blur-2xl"></div>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3.5 rounded-2xl ${color} transform group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed mb-1 line-clamp-1">{title}</p>
      <h2 className="text-3xl font-black text-slate-900 leading-tight truncate">{value}</h2>
    </div>
  </div>
);

const Dashboard = () => {
  const { products, orders, t, activeTheme, loading } = useShop();

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Apsara Analysis...</p>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const remainingStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalProducts = products.length;
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  const lowStockItems = products.filter(p => p.stock < 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 md:space-y-12 max-w-[1400px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 theme-bg opacity-[0.03] blur-3xl -mr-32 -mt-32 rounded-full"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none mb-2">{t.dashboard}</h1>
          <p className="font-black uppercase tracking-[0.3em] text-[10px] theme-text">Apsara General Store • {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard title={t.totalRevenue} value={`₹${totalRevenue}`} icon={<IndianRupee style={{ color: activeTheme.hex }} size={28} />} color="theme-bg-secondary" />
        <StatCard title={t.stockValue} value={`₹${totalStockValue}`} icon={<Package className="text-emerald-600" size={28} />} color="bg-emerald-50" />
        <StatCard title={t.stockGela} value={`${totalSold}`} icon={<TrendingUp className="text-purple-600" size={28} />} color="bg-purple-50" />
        <StatCard title={t.stockShilak} value={`${remainingStock}`} icon={<Package className="text-blue-600" size={28} />} color="bg-blue-50" />
        <StatCard title={t.varieties} value={totalProducts} icon={<ShoppingBag className="text-orange-600" size={28} />} color="bg-orange-50" />
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 p-6 md:p-8 rounded-[32px] border border-red-100 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
           <div className="absolute inset-0 bg-red-100/20 translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
           <div className="p-4 bg-red-600 rounded-2xl shadow-xl shadow-red-200 relative z-10 animate-bounce">
             <AlertTriangle className="text-white" size={32} />
           </div>
           <div className="text-center sm:text-left relative z-10">
             <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-1 leading-none">{t.inventoryAlert}</h3>
             <p className="text-red-600/70 font-bold text-sm">{lowStockItems.length} {t.lowStockDesc}</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
           <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
             <div className="p-2 bg-pink-50 rounded-lg"><TrendingUp size={20} className="text-pink-600" /></div> {t.recentSales}
           </h3>
           <div className="space-y-4 flex-1">
             {orders.slice(0, 5).map(order => (
               <div key={order.id} className="flex items-center justify-between p-5 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 rounded-2xl group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-black text-slate-400 border border-slate-100 text-[10px] group-hover:theme-bg group-hover:text-white transition-colors uppercase">{order.customerName.charAt(0)}</div>
                    <div>
                      <p className="font-black text-slate-900 text-sm uppercase">{order.customerName}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="font-black text-slate-900 text-lg leading-none mb-1">₹{order.total}</p>
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">#{order.id.slice(-6)}</p>
                 </div>
               </div>
             ))}
             {orders.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
                 <ShoppingBag size={48} className="mb-4 text-slate-200" />
                 <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.noSales}</p>
               </div>
             )}
           </div>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col">
           <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
             <div className="p-2 bg-orange-50 rounded-lg"><AlertTriangle size={20} className="text-orange-600" /></div> {t.criticalStock}
           </h3>
           <div className="space-y-4 flex-1">
             {lowStockItems.map(p => (
               <div key={p.id} className="flex items-center justify-between p-5 bg-red-50/30 hover:bg-white hover:shadow-md transition-all border border-red-50 hover:border-red-100 rounded-2xl group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 font-black text-lg">⚠️</div>
                    <div>
                      <p className="font-black text-slate-900 text-sm leading-tight mb-1 uppercase truncate max-w-[120px] sm:max-w-none">{p.name}</p>
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{p.category}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="font-black text-red-600 leading-none mb-1">{p.stock} <span className="text-[10px] uppercase">{t.unitsLeft}</span></p>
                    <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden shadow-inner">
                       <div className="bg-red-500 h-full rounded-full" style={{ width: `${(p.stock / 5) * 100}%` }}></div>
                    </div>
                 </div>
               </div>
             ))}
             {lowStockItems.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center py-20 opacity-40">
                 <CheckCircle size={48} className="mb-4 text-green-200" />
                 <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">{t.healthyStock}</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
