import React from 'react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, Package, AlertTriangle, IndianRupee } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className={`p-8 bg-white border border-slate-100 rounded-[32px] flex items-center justify-between shadow-sm`}>
    <div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-4xl font-black text-slate-900 leading-none mt-2">{value}</h2>
    </div>
    <div className={`p-5 rounded-2xl ${color}`}>
      {icon}
    </div>
  </div>
);

const Dashboard = () => {
  const { products, orders, t, activeTheme } = useShop();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const remainingStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalProducts = products.length;

  const lowStockItems = products.filter(p => p.stock < 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 max-w-[1400px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-none mb-2">{t.dashboard}</h1>
          <p className={`font-bold uppercase tracking-widest text-[10px] text-${activeTheme.primary}`}>Apsara General Store - {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        <StatCard title={t.totalRevenue} value={`₹${totalRevenue}`} icon={<IndianRupee className={`text-${activeTheme.primary}`} size={28} />} color={`bg-${activeTheme.secondary}`} />
        <StatCard title={t.stockGela} value={`${totalSold} ${t.gela}`} icon={<TrendingUp className="text-purple-600" size={28} />} color="bg-purple-50" />
        <StatCard title={t.stockShilak} value={`${remainingStock} ${t.shilak}`} icon={<Package className="text-blue-600" size={28} />} color="bg-blue-50" />
        <StatCard title={t.varieties} value={totalProducts} icon={<ShoppingBag className="text-orange-600" size={28} />} color="bg-orange-50" />
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 flex items-center gap-6">
           <div className="p-4 bg-red-600 rounded-2xl shadow-xl shadow-red-200">
             <AlertTriangle className="text-white" size={32} />
           </div>
           <div>
             <h3 className="text-2xl font-black text-slate-900 mb-1 leading-none mt-2">{t.inventoryAlert}</h3>
             <p className="text-slate-500 font-bold">{lowStockItems.length} {t.lowStockDesc}</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm min-h-[400px]">
           <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
             <TrendingUp size={20} className="text-pink-600" /> {t.recentSales}
           </h3>
           <div className="space-y-4">
             {orders.slice(0, 5).map(order => (
               <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div>
                   <p className="font-bold text-slate-900 text-sm">{order.customerName}</p>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                 </div>
                 <div className="text-right">
                   <p className="font-black text-pink-600 text-lg leading-none mb-1">₹{order.total}</p>
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{order.id.slice(-6)}</p>
                 </div>
               </div>
             ))}
             {orders.length === 0 && <p className="text-slate-400 font-bold text-center py-20 italic text-sm">{t.noSales}</p>}
           </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm min-h-[400px]">
           <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
             <AlertTriangle size={20} className="text-orange-600" /> {t.criticalStock}
           </h3>
           <div className="space-y-4">
             {lowStockItems.map(p => (
               <div key={p.id} className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
                 <div>
                   <p className="font-bold text-slate-900 text-sm leading-tight mb-1">{p.name}</p>
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{p.category}</p>
                 </div>
                 <div className="text-right">
                   <p className="font-black text-red-600 leading-none mb-1">{p.stock} {t.unitsLeft}</p>
                   <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{t.inventoryAlert}</p>
                 </div>
               </div>
             ))}
             {lowStockItems.length === 0 && <p className="text-slate-400 font-bold text-center py-20 italic text-sm">{t.healthyStock}</p>}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
