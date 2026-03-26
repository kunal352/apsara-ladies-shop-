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
  const { products, orders } = useShop();

  const totalProducts = products.length;
  const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
  const remainingStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const lowStockItems = products.filter(p => p.stock < 5);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-none mb-3">Shop Dashboard</h1>
          <p className="text-slate-500 font-bold capitalize">Apsara Ladies Shop Performance Overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Revenue" value={`₹${totalRevenue}`} icon={<IndianRupee className="text-pink-600" size={28} />} color="bg-pink-50" />
        <StatCard title="Stock Gela (Sold)" value={`${totalSold} pcs`} icon={<TrendingUp className="text-purple-600" size={28} />} color="bg-purple-50" />
        <StatCard title="Stock Shilak (Left)" value={`${remainingStock} pcs`} icon={<Package className="text-blue-600" size={28} />} color="bg-blue-50" />
        <StatCard title="Total Varieties" value={totalProducts} icon={<ShoppingBag className="text-orange-600" size={28} />} color="bg-orange-50" />
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 p-8 rounded-[32px] border border-red-100 flex items-center gap-6">
           <div className="p-4 bg-red-600 rounded-2xl shadow-xl shadow-red-200">
             <AlertTriangle className="text-white" size={32} />
           </div>
           <div>
             <h3 className="text-2xl font-black text-slate-900 mb-1 leading-none mt-2">Inventory Alert!</h3>
             <p className="text-slate-500 font-bold">{lowStockItems.length} products are running low on stock. Please restock soon.</p>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm min-h-[400px]">
           <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
             <TrendingUp size={20} className="text-pink-600" /> Recent Sales Activity
           </h3>
           <div className="space-y-4">
             {orders.slice(0, 5).map(order => (
               <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div>
                   <p className="font-bold text-slate-900">{order.customerName}</p>
                   <p className="text-xs text-slate-400 font-bold">{order.items.length} items</p>
                 </div>
                 <div className="text-right">
                   <p className="font-black text-pink-600">₹{order.total}</p>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{order.id}</p>
                 </div>
               </div>
             ))}
             {orders.length === 0 && <p className="text-slate-400 font-bold text-center py-20 italic">No sales activity yet.</p>}
           </div>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm min-h-[400px]">
           <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
             <AlertTriangle size={20} className="text-orange-600" /> Critical Stock Items
           </h3>
           <div className="space-y-4">
             {lowStockItems.map(p => (
               <div key={p.id} className="flex items-center justify-between p-4 bg-red-50/50 rounded-2xl border border-red-100/50">
                 <div>
                   <p className="font-bold text-slate-900">{p.name}</p>
                   <p className="text-xs text-slate-400 font-bold uppercase">{p.category}</p>
                 </div>
                 <div className="text-right">
                   <p className="font-black text-red-600">{p.stock} Units Left</p>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Low Stock</p>
                 </div>
               </div>
             ))}
             {lowStockItems.length === 0 && <p className="text-slate-400 font-bold text-center py-20 italic">Stock levels are healthy! ✓</p>}
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
