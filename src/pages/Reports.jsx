import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { Calendar, Search, TrendingUp, IndianRupee, Receipt } from 'lucide-react';

const Reports = () => {
  const { orders } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-pink-900/5 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none mb-3">Sales Reports</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Apsara Ladies Shop - Financial Performance</p>
        </div>
        <div className="flex flex-wrap gap-4 md:gap-6 justify-between lg:justify-end w-full lg:w-auto">
           <div className="text-center px-4 md:px-8 border-r border-slate-100 flex-1 lg:flex-none">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Total Sales</p>
              <h2 className="text-3xl md:text-4xl font-black text-pink-600 leading-none mt-2">₹{totalRevenue}</h2>
           </div>
           <div className="text-center px-4 md:px-8 flex-1 lg:flex-none">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Total Bills</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-none mt-2">{filteredOrders.length}</h2>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:items-center md:flex-row gap-4 md:gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-600 transition-colors" size={20} />
          <input className="w-full pl-16 py-5 md:py-6 rounded-2xl bg-white border border-slate-100 outline-none text-base md:text-lg font-bold text-slate-900 focus:ring-4 focus:ring-pink-100 transition-all font-inter" placeholder="Search by customer name or bill ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative">
          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="date" className="w-full md:w-auto pl-16 pr-8 py-5 md:py-6 rounded-2xl bg-white border border-slate-100 outline-none font-bold text-slate-900/50 cursor-pointer hover:bg-slate-50 transition-all uppercase tracking-widest text-xs" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] md:rounded-[44px] border border-slate-100 shadow-sm overflow-x-auto custom-scrollbar">
        <table className="w-full text-left font-inter min-w-[800px]">
          <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center">
            <tr>
              <th className="px-6 md:px-12 py-8 md:py-10 text-left">Bill Info</th>
              <th className="px-6 md:px-12 py-8 md:py-10">Customer Name</th>
              <th className="px-6 md:px-12 py-8 md:py-10 text-center">Items</th>
              <th className="px-6 md:px-12 py-8 md:py-10 text-right">Paid Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-24 text-slate-400 font-bold italic">No sales matching your criteria.</td></tr>
            ) : filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 md:px-12 py-6 md:py-8">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-pink-100 rounded-xl text-pink-600 font-black"><Receipt size={20} /></div>
                      <div>
                         <p className="font-black text-slate-900 uppercase leading-none mb-1 text-base">{order.id}</p>
                         <p className="text-[10px] text-slate-400 font-black tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                   </div>
                </td>
                <td className="px-6 md:px-12 py-6 md:py-8 text-center font-black text-slate-900 text-base md:text-lg uppercase">{order.customerName}</td>
                <td className="px-6 md:px-12 py-6 md:py-8 text-center font-bold text-slate-400 italic">
                   {order.items.length} items
                </td>
                <td className="px-6 md:px-12 py-6 md:py-8 text-right">
                   <div className="flex flex-col items-end">
                      <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none mb-1">₹{order.total}</span>
                      <span className="text-[10px] bg-green-100 text-green-700 font-black px-2 py-0.5 rounded-md uppercase tracking-tight">Paid ✓</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </motion.div>
  );
};

export default Reports;
