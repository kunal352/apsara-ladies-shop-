import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Search, TrendingUp, IndianRupee, Receipt, X, Printer, CheckCircle } from 'lucide-react';

const Reports = () => {
  const { orders, loading, t, lang, activeTheme, shopDetails } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
          {lang === 'mr' ? 'अहवाल गोळा करत आहे...' : 'Apsara Reports Fetching...'}
        </p>
      </div>
    );
  }

  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    String(o.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 max-w-[1400px]">
      {/* Header Cards with localized counts */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm transition-all hover:shadow-xl gap-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 theme-bg opacity-[0.03] blur-3xl -mr-32 -mt-32 rounded-full"></div>
        <div className="relative z-10 text-center lg:text-left">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-none mb-1.5">
            {lang === 'mr' ? 'विक्री अहवाल (Sales Reports)' : 'Sales Reports'}
          </h1>
          <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px]">
            {lang === 'mr' ? 'आर्थिक कामगिरीचा एकूण आढावा' : 'Financial Performance Overview'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-end w-full lg:w-auto relative z-10">
           <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex-1 lg:flex-none text-center sm:text-left min-w-[160px]">
              <p className="text-[8px] uppercase font-black tracking-widest text-slate-400 mb-1">
                {lang === 'mr' ? 'एकूण कमाई (Revenue)' : 'Total Revenue'}
              </p>
              <h2 className="text-xl md:text-2xl font-black theme-text leading-none">₹{totalRevenue.toLocaleString()}</h2>
           </div>
           <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-100 flex-1 lg:flex-none text-center sm:text-left min-w-[150px]">
              <p className="text-[8px] uppercase font-black tracking-widest text-slate-400 mb-1">
                {lang === 'mr' ? 'एकूण बनवलेली बिले (Bills)' : 'Total Bills Generated'}
              </p>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-none">{filteredOrders.length}</h2>
           </div>
        </div>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:theme-text transition-colors" size={16} />
          <input 
            className="w-full pl-12 py-3 rounded-xl bg-white border border-slate-100 outline-none text-sm font-bold text-slate-900 focus:ring-4 focus:ring-slate-50 transition-all" 
            placeholder={lang === 'mr' ? 'ग्राहक नाव किंवा बिल आयडी शोधा...' : 'Search customer or bill ID...'} 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="date" className="w-full md:w-auto pl-12 pr-6 py-3 rounded-xl bg-white border border-slate-100 outline-none font-bold text-slate-900/50 cursor-pointer hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px]" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden shadow-xl shadow-slate-200/50">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left font-inter">
            <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-400 text-[9px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">{lang === 'mr' ? 'बिलाचा तपशील' : 'Invoice Detail'}</th>
                <th className="px-6 py-3">{lang === 'mr' ? 'ग्राहकाची माहिती' : 'Customer Information'}</th>
                <th className="px-6 py-3 text-center">{lang === 'mr' ? 'एकूण वस्तू' : 'Items'}</th>
                <th className="px-6 py-3 text-right">{lang === 'mr' ? 'एकूण रक्कम' : 'Settled Amount'}</th>
                <th className="px-6 py-3 text-right">{lang === 'mr' ? 'कृती' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-slate-300 font-bold italic h-[250px]">
                    {lang === 'mr' ? 'या निवडीसाठी कोणतेही बिल आढळले नाही.' : 'No sales recorded for this selection.'}
                  </td>
                </tr>
              ) : filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-3">
                     <div className="flex items-center gap-3">
                        <div className="w-9 h-9 theme-bg-secondary rounded-xl flex items-center justify-center theme-text font-black shadow-inner">
                          <Receipt size={16} />
                        </div>
                        <div>
                           <p className="font-black text-slate-900 uppercase leading-none mb-1 text-xs tracking-tight">#{String(order.id).slice(-8)}</p>
                           <p className="text-[9px] text-slate-400 font-black tracking-wider uppercase">{new Date(order.date).toLocaleDateString('en-GB')}</p>
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm uppercase tracking-tight">{order.customerName}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {lang === 'mr' ? 'नोंदणीकृत ग्राहक' : 'Reg. Customer'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className="px-3 py-1 bg-slate-100 rounded-full font-black text-[9px] text-slate-500 uppercase tracking-wider">
                      {order.items.length} {lang === 'mr' ? 'प्रकार' : `Product${order.items.length !== 1 ? 's' : ''}`}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                     <div className="flex flex-col items-end">
                        <span className="text-lg font-black text-slate-900 leading-none mb-1">₹{order.total.toLocaleString()}</span>
                        <div className="flex items-center gap-1 bg-green-50 text-green-600 font-black px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider border border-green-100 shadow-sm shadow-green-900/5">
                           <span className="w-1 h-1 bg-green-500 rounded-full"></span> {lang === 'mr' ? 'पूर्ण भरले' : 'Fully Paid'}
                        </div>
                     </div>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)} 
                      className="px-3 py-1.5 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all border border-pink-100"
                    >
                      {lang === 'mr' ? 'बिल पहा' : 'View Bill'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 opacity-30 italic font-bold text-slate-400 uppercase tracking-widest text-xs">
              {lang === 'mr' ? 'कोणतीही नोंद आढळली नाही' : 'No Records Found'}
            </div>
          ) : filteredOrders.map(order => (
            <div key={order.id} className="p-4 space-y-4 bg-white active:bg-slate-50 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 theme-bg-secondary rounded-lg flex items-center justify-center theme-text"><Receipt size={14} /></div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-xs">#{String(order.id).slice(-6)}</h4>
                    <p className="text-[9px] text-slate-400 font-black tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-slate-900 leading-none mb-1">₹{order.total.toLocaleString()}</p>
                  <span className="text-[8px] bg-green-50 text-green-600 font-black px-2 py-0.5 rounded-md uppercase tracking-widest border border-green-100">
                    {lang === 'mr' ? 'पूर्ण भरले ✓' : 'Paid ✓'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-y border-slate-50 border-dashed text-xs">
                <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{lang === 'mr' ? 'ग्राहक' : 'Customer'}</p>
                  <p className="font-black text-slate-900 uppercase">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{lang === 'mr' ? 'वस्तू' : 'Units'}</p>
                  <p className="font-black text-slate-900">{order.items.length} Pcs</p>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedOrder(order)}
                className="w-full py-2 bg-slate-50 text-slate-600 rounded-lg font-black text-[9px] uppercase tracking-widest border border-slate-100 active:scale-95 transition-all"
              >
                {lang === 'mr' ? 'बिल पहा' : 'View Details'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bill View Popup Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[200] flex items-center justify-center p-4"
          >
             {/* Invisible Print Section */}
             <div id="printable-bill" className="hidden print:block text-black font-serif w-full p-4 bg-white">
                <div className="text-center mb-10 pt-4 border-b-2 border-black pb-8">
                   <h1 className="text-3xl font-black uppercase mb-1 tracking-widest">{shopDetails.name}</h1>
                   <p className="text-xs italic opacity-70 mb-4">{shopDetails.tagline}</p>
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-bold uppercase opacity-40 text-left">EST: 2024</p>
                      <p className="text-[10px] font-bold uppercase text-right">INV: #{String(selectedOrder.id).slice(-6).toUpperCase()}<br/>{new Date(selectedOrder.date).toLocaleDateString()}</p>
                   </div>
                </div>
                
                <div className="flex justify-between text-sm mb-8">
                   <div>
                      <p className="text-[10px] uppercase opacity-40 font-bold mb-1">To Customer:</p>
                      <p className="font-bold text-lg uppercase leading-none">{selectedOrder.customerName}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase opacity-40 font-bold mb-1">Contact No:</p>
                      <p className="font-bold text-lg leading-none">{selectedOrder.customerMobile || "9876543210"}</p>
                   </div>
                </div>

                <table className="w-full text-left text-sm mb-8 border-collapse">
                   <thead>
                      <tr className="border-y-2 border-black">
                        <th className="py-4 font-black uppercase tracking-widest">Selected Item Details</th>
                        <th className="py-4 text-center font-black uppercase tracking-widest">Qty</th>
                        <th className="py-4 text-right font-black uppercase tracking-widest">Amount</th>
                      </tr>
                   </thead>
                   <tbody>
                      {selectedOrder.items.map((i, idx) => (
                        <tr key={idx} className="border-b border-black/10">
                           <td className="py-4 font-bold uppercase text-xs">{i.name}</td>
                           <td className="py-4 text-center font-bold text-xs">{i.qty}</td>
                           <td className="py-4 text-right font-bold text-xs">₹{i.price * i.qty}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>

                <div className="bg-black text-white p-6 rounded-lg flex justify-between items-center mb-10">
                   <span className="font-black text-sm uppercase tracking-[0.4em]">Grand Total</span>
                   <span className="text-2xl font-black">₹{selectedOrder.total}</span>
                </div>
                
                <div className="text-center pt-8 border-t border-black/10">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2">{t.thankYou || "Thank you! Visit again."}</p>
                   <p className="text-[8px] opacity-40">Please keep this invoice for your future records</p>
                </div>
             </div>

             <motion.div 
               initial={{ scale: 0.95, y: 20 }} 
               animate={{ scale: 1, y: 0 }} 
               exit={{ scale: 0.95, y: 20 }} 
               className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl relative border border-slate-100"
             >
                {/* Modal Header */}
                <div className="theme-bg p-5 text-white relative">
                   <button 
                     onClick={() => setSelectedOrder(null)} 
                     className="absolute top-5 right-5 p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
                   >
                     <X size={14} />
                   </button>
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                       <Receipt size={20} />
                     </div>
                     <div>
                       <h2 className="text-lg font-black tracking-tight leading-none mb-1">
                         {lang === 'mr' ? 'बिलाचा तपशील' : 'Invoice Details'}
                       </h2>
                       <p className="text-[9px] font-black uppercase tracking-wider opacity-60">#{selectedOrder.id}</p>
                     </div>
                   </div>
                </div>

                {/* Modal Body */}
                <div className="p-5 space-y-4">
                   <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <div>
                         <p className="text-[8px] uppercase font-black text-slate-400 mb-0.5 tracking-wider">{lang === 'mr' ? 'ग्राहक' : 'Customer'}</p>
                         <p className="font-black text-slate-800 text-sm uppercase leading-none">{selectedOrder.customerName}</p>
                         <p className="text-[8px] font-bold text-slate-400 mt-1">{selectedOrder.customerMobile || "9876543210"}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[8px] uppercase font-black text-slate-400 mb-0.5 tracking-wider">{lang === 'mr' ? 'तारीख' : 'Date'}</p>
                         <p className="font-black text-slate-800 text-sm leading-none">{new Date(selectedOrder.date).toLocaleDateString('en-GB')}</p>
                         <span className="inline-block mt-1 bg-green-100 text-green-700 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                           {lang === 'mr' ? 'पूर्ण भरले' : 'Fully Paid'}
                         </span>
                      </div>
                   </div>

                   {/* Items List */}
                   <div className="space-y-2">
                      <p className="text-[9px] uppercase font-black tracking-wider text-slate-400">{lang === 'mr' ? 'खरेदी केलेल्या वस्तू' : 'Purchased Items'}</p>
                      <div className="divide-y divide-slate-100 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
                         {selectedOrder.items.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center py-2 text-xs">
                              <div>
                                 <p className="font-black text-slate-800 uppercase">{item.name}</p>
                                 <p className="text-[9px] font-bold text-slate-400">₹{item.price} × {item.qty}</p>
                              </div>
                              <span className="font-black text-slate-800">₹{item.price * item.qty}</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   {/* Grand Total */}
                   <div className="bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center">
                      <span className="font-black text-xs uppercase tracking-wider">{lang === 'mr' ? 'एकूण रक्कम' : 'Grand Total'}</span>
                      <span className="text-lg font-black theme-text">₹{selectedOrder.total.toLocaleString()}</span>
                   </div>

                   {/* Actions */}
                   <div className="flex gap-2">
                      <button 
                        onClick={() => { window.print(); }} 
                        className="flex-1 theme-bg text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/10 hover:scale-[1.02] active:scale-95 transition-all group"
                      >
                         <Printer size={14} className="group-hover:rotate-12 transition-all" /> {lang === 'mr' ? 'बिल प्रिंट करा' : 'Print Invoice'}
                      </button>
                      <button 
                        onClick={() => setSelectedOrder(null)} 
                        className="flex-1 bg-slate-100 text-slate-800 py-3 rounded-xl font-black text-sm hover:scale-[1.02] active:scale-95 transition-all"
                      >
                         {lang === 'mr' ? 'बंद करा' : 'Close'}
                      </button>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Reports;
