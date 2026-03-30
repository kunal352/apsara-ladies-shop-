import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';
import { Calendar, Search, TrendingUp, IndianRupee, Receipt } from 'lucide-react';

const Reports = () => {
  const { orders, loading } = useShop();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Apsara Reports Fetching...</p>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 md:space-y-12 max-w-[1400px]">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm transition-all hover:shadow-xl gap-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 theme-bg opacity-[0.03] blur-3xl -mr-32 -mt-32 rounded-full"></div>
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none mb-3">Sales Reports</h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Financial Performance Overview</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center lg:justify-end w-full lg:w-auto relative z-10">
           <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex-1 lg:flex-none text-center sm:text-left min-w-[200px]">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Total Revenue</p>
              <h2 className="text-3xl md:text-4xl font-black theme-text leading-none">₹{totalRevenue}</h2>
           </div>
           <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex-1 lg:flex-none text-center sm:text-left min-w-[150px]">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Total Invoices</p>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-none">{filteredOrders.length}</h2>
           </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:theme-text transition-colors" size={20} />
          <input className="w-full pl-16 py-5 rounded-2xl bg-white border border-slate-100 outline-none text-base md:text-lg font-bold text-slate-900 focus:ring-4 focus:ring-slate-50 transition-all" placeholder="Search customer or bill ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative">
          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="date" className="w-full md:w-auto pl-16 pr-8 py-5 rounded-2xl bg-white border border-slate-100 outline-none font-bold text-slate-900/50 cursor-pointer hover:bg-slate-50 transition-all uppercase tracking-widest text-xs" />
        </div>
      </div>

      <div className="bg-white rounded-[32px] md:rounded-[44px] border border-slate-100 shadow-sm overflow-hidden shadow-xl shadow-slate-200/50">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-inter">
            <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="px-12 py-10 text-left">Invoice Detail</th>
                <th className="px-12 py-10">Customer Information</th>
                <th className="px-12 py-10 text-center">Items</th>
                <th className="px-12 py-10 text-right">Settled Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-32 text-slate-300 font-bold italic h-[400px]">No sales recorded for this selection.</td></tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-12 py-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 theme-bg-secondary rounded-2xl flex items-center justify-center theme-text font-black shadow-inner"><Receipt size={22} /></div>
                        <div>
                           <p className="font-black text-slate-900 uppercase leading-none mb-1 text-sm tracking-tight">{order.id}</p>
                           <p className="text-[10px] text-slate-400 font-black tracking-widest uppercase">{new Date(order.date).toLocaleDateString('en-GB')}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-12 py-8">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-base uppercase tracking-tight">{order.customerName}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Reg. Business Customer</span>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-center">
                    <span className="px-4 py-2 bg-slate-100 rounded-full font-black text-[10px] text-slate-500 uppercase tracking-widest">{order.items.length} Product{order.items.length !== 1 ? 's' : ''}</span>
                  </td>
                  <td className="px-12 py-8 text-right">
                     <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-slate-900 leading-none mb-2">₹{order.total}</span>
                        <div className="flex items-center gap-1.5 bg-green-50 text-green-600 font-black px-3 py-1 rounded-full text-[9px] uppercase tracking-wider border border-green-100 shadow-sm shadow-green-900/5">
                           <span className="w-1 h-1 bg-green-500 rounded-full"></span> Fully Paid
                        </div>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-20 opacity-30 italic font-bold text-slate-400 uppercase tracking-widest text-xs">No Records Found</div>
          ) : filteredOrders.map(order => (
            <div key={order.id} className="p-6 space-y-6 bg-white active:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 theme-bg-secondary rounded-xl flex items-center justify-center theme-text"><Receipt size={18} /></div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-xs">#{order.id.slice(-6)}</h4>
                    <p className="text-[9px] text-slate-400 font-black tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-900 leading-none mb-1">₹{order.total}</p>
                  <span className="text-[8px] bg-green-50 text-green-600 font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-green-100">Paid ✓</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-y border-slate-50 border-dashed">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                  <p className="font-black text-slate-900 text-sm uppercase">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Units</p>
                  <p className="font-black text-slate-900 text-sm">{order.items.length} Pcs</p>
                </div>
              </div>
              
              <button className="w-full py-4 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-100 active:scale-95 transition-all">View Details</button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Reports;
