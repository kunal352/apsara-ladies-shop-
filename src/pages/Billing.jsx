import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, User, Phone, ShoppingCart, Trash2, CreditCard, Sparkles, X, CheckCircle, Printer, Search, ArrowRight, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

const Billing = () => {
  const { products, completeBill, shopDetails, t, activeTheme } = useShop();
  const [customer, setCustomer] = useState({ name: '', mobile: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [showInvoice, setShowInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (product) => {
    if (product.stock <= 0) return toast.error('Out of stock! 🚫');
    setSelectedItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty + 1 > product.stock) {
           toast.error('Not enough stock! 🚫');
           return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const removeItem = (id) => setSelectedItems(prev => prev.filter(item => item.id !== id));
  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    if (!customer.name || customer.mobile.length !== 10 || selectedItems.length === 0) {
      if (customer.mobile.length !== 10) return toast.error('Check Mobile Number! 📱');
      return toast.error('Missing details! 📝');
    }
    try {
      const bill = await completeBill({ 
        customerName: customer.name, 
        customerMobile: customer.mobile, 
        items: selectedItems, 
        total: Number(totalAmount) 
      });
      if (bill) {
        setShowInvoice(bill);
        setSelectedItems([]);
        setCustomer({ name: '', mobile: '' });
        toast.success('Bill Generated! 🧾✨');
      }
    } catch (err) {
      toast.error('Checkout failed! ❌');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 pb-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/40 backdrop-blur-xl p-5 rounded-[24px] border border-white/60 premium-shadow gap-4 print:hidden group">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 theme-bg rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/10 rotate-6 group-hover:rotate-0 transition-all duration-500 text-white">
              <Receipt size={20} />
           </div>
           <div>
              <h1 className="text-2xl font-black text-slate-800 leading-none mb-1 tracking-tighter">{t.billing}</h1>
              <p className="font-black uppercase tracking-[0.3em] text-[9px] text-slate-400">Smart POS System • {new Date().toLocaleDateString()}</p>
           </div>
        </div>
        <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-xl border border-white/50 premium-shadow">
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
           <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">System Ready</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 print:hidden">
        {/* Left Side: Product Selection */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-4">
           <div className="glass-card p-2 rounded-2xl premium-shadow flex items-center gap-4 border border-white/40">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder={t.searchProducts}
                  className="w-full pl-12 pr-6 py-3 rounded-xl bg-slate-50/50 border-none outline-none font-bold text-base text-slate-800 focus:bg-white focus:ring-[6px] focus:ring-slate-100 transition-all placeholder:text-slate-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
           </div>
           
           <div className="glass-card p-4 rounded-3xl premium-shadow border border-white/40 min-h-[380px] relative">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-black text-slate-800 tracking-tighter flex items-center gap-2">
                    <Sparkles className="text-pink-500" size={16} /> {t.collection}
                 </h3>
                 <div className="flex gap-1.5">
                    {['All', 'Saree', 'Kurti'].map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSearchTerm(cat === 'All' ? '' : cat)}
                        className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                          searchTerm === cat ? 'theme-bg text-white shadow-md' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                 {filteredProducts.map((p, idx) => (
                   <motion.button 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: idx * 0.03 }}
                     key={p.id} 
                     onClick={() => addItem(p)}
                     disabled={p.stock <= 0}
                     className={`p-3 rounded-2xl border text-left transition-all relative group flex flex-col justify-between min-h-[110px] ${
                      p.stock <= 0 
                        ? 'bg-slate-50 border-slate-100 opacity-40 cursor-not-allowed' 
                        : 'bg-white border-transparent hover:border-pink-200 hover:shadow-lg hover:shadow-pink-500/5 hover:-translate-y-0.5'
                     }`}
                   >
                     {p.stock < 5 && p.stock > 0 && <span className="absolute top-2 right-2 bg-orange-500 text-white text-[6px] font-black px-1.5 py-0.5 rounded animate-pulse z-10">ALERT</span>}
                     
                     <div className="space-y-2">
                        <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-base group-hover:scale-110 transition-all duration-500">🛍️</div>
                        <div>
                          <h4 className="font-black text-slate-800 text-xs leading-tight uppercase truncate">{p.name}</h4>
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-0.5">{p.category}</p>
                        </div>
                     </div>

                     <div className="mt-3 flex justify-between items-end">
                        <p className="text-lg font-black text-slate-800 tracking-tight">₹{p.price}</p>
                        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${p.stock < 5 ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                          {p.stock} SHILAK
                        </span>
                     </div>
                   </motion.button>
                 ))}
              </div>
           </div>
        </div>

        {/* Right Side: Bill Summary */}
        <div className="lg:col-span-12 xl:col-span-5 relative">
           <div className="bg-white p-5 rounded-3xl border-b-[8px] premium-shadow lg:sticky lg:top-4 transition-all duration-700" style={{ borderBottomColor: activeTheme.hex }}>
              <div className="flex items-center justify-between mb-5">
                 <h3 className="text-lg font-black text-slate-800 tracking-tighter flex items-center gap-2">
                    <ShoppingCart className="text-pink-600" size={16} /> New Bill
                 </h3>
                 <button onClick={() => setSelectedItems([])} className="text-[9px] font-black text-slate-300 uppercase tracking-wider hover:text-red-500 transition-colors">Clear All</button>
              </div>

              <div className="space-y-4">
                 <div className="grid grid-cols-1 gap-2">
                    <div className="relative group">
                       <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-all" />
                       <input 
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-pink-100 outline-none font-bold text-sm text-slate-800 focus:ring-4 focus:ring-pink-500/5 uppercase placeholder:text-slate-300 transition-all shadow-inner"
                        placeholder="Customer Full Name" 
                        value={customer.name} 
                        onChange={e => setCustomer({...customer, name: e.target.value})} 
                       />
                    </div>
                    <div className="relative group">
                       <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-all" />
                       <input 
                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-pink-100 outline-none font-black text-sm text-slate-800 focus:ring-4 focus:ring-pink-500/5 placeholder:text-slate-300 transition-all shadow-inner font-mono"
                        placeholder="10-Digit Mobile" 
                        maxLength="10"
                        value={customer.mobile} 
                        onChange={e => setCustomer({...customer, mobile: e.target.value.replace(/\D/g, '')})} 
                       />
                    </div>
                 </div>

                 <div className="space-y-2 min-h-[120px] max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                    <AnimatePresence>
                      {selectedItems.map((item, idx) => (
                        <motion.div 
                          initial={{ x: 10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: -10, opacity: 0, scale: 0.95 }}
                          key={item.id} 
                          className="flex items-center gap-3 bg-slate-50/50 p-2.5 rounded-2xl border border-white hover:bg-white hover:shadow-md transition-all group"
                        >
                           <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center text-sm shadow-sm">🛍️</div>
                           <div className="flex-1">
                              <p className="font-black text-slate-800 text-xs uppercase truncate leading-none mb-1">{item.name}</p>
                              <div className="flex items-center gap-1.5">
                                <span className="bg-slate-100 text-slate-400 text-[7px] px-1 py-0.5 rounded font-black italic">#{String(item.id).slice(-4)}</span>
                                <span className="font-bold text-slate-400 text-[9px]">₹{item.price} × {item.qty}</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="font-black text-slate-800 text-sm tracking-tight">₹{item.price * item.qty}</span>
                              <button onClick={() => removeItem(item.id)} className="p-1.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={12} /></button>
                           </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {selectedItems.length === 0 && (
                      <div className="text-center py-10 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                           <ShoppingCart className="text-slate-200" size={18} />
                        </div>
                        <p className="text-[8px] font-black uppercase tracking-wider text-slate-300">Waitng for Items...</p>
                      </div>
                    )}
                 </div>

                 <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 theme-bg opacity-10 blur-[40px] group-hover:scale-150 transition-transform duration-1000"></div>
                    <div className="flex justify-between items-end mb-4 relative z-10">
                       <p className="text-[8px] font-black uppercase text-slate-500 tracking-wider">Settlement Amount</p>
                       <span className="text-3xl font-black theme-text leading-none tracking-tighter">₹{totalAmount.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      disabled={selectedItems.length === 0}
                      className="w-full theme-bg text-white py-3 rounded-2xl font-black text-base hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-[0_10px_30px_rgba(190,24,93,0.2)] flex items-center justify-center gap-2 group/btn"
                    >
                      <CreditCard size={18} className="group-hover/btn:rotate-12 transition-transform" /> {t.completeSale}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Modern Invoice Overlay */}
      <AnimatePresence>
        {showInvoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-2xl z-[200] flex items-center justify-center p-6">
             {/* Invisible Print Section */}
             <div id="printable-bill" className="hidden print:block text-black font-serif w-full p-4">
                <div className="text-center mb-10 pt-4 border-b-2 border-black pb-8">
                   <h1 className="text-3xl font-black uppercase mb-1 tracking-widest">{shopDetails.name}</h1>
                   <p className="text-xs italic opacity-70 mb-4">{shopDetails.tagline}</p>
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-bold uppercase opacity-40 text-left">EST: 2024</p>
                      <p className="text-[10px] font-bold uppercase text-right">INV: #{String(showInvoice.id).slice(-6).toUpperCase()}<br/>{new Date(showInvoice.date).toLocaleDateString()}</p>
                   </div>
                </div>
                
                <div className="flex justify-between text-sm mb-8">
                   <div>
                      <p className="text-[10px] uppercase opacity-40 font-bold mb-1">To Customer:</p>
                      <p className="font-bold text-lg uppercase leading-none">{showInvoice.customerName}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] uppercase opacity-40 font-bold mb-1">Contact No:</p>
                      <p className="font-bold text-lg leading-none">{showInvoice.customerMobile}</p>
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
                      {showInvoice.items.map((i, idx) => (
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
                   <span className="text-2xl font-black">₹{showInvoice.total}</span>
                </div>
                
                <div className="text-center pt-8 border-t border-black/10">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2">{t.thankYou}</p>
                   <p className="text-[8px] opacity-40">Please keep this invoice for your future records</p>
                </div>
             </div>

             {/* UI Success Card */}
             <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[56px] w-full max-w-xl overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                <div className="theme-bg p-16 text-center text-white relative">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[40px] rounded-full"></div>
                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }} className="bg-white/20 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto mb-8 backdrop-blur-xl border border-white/30 rotate-12">
                     <CheckCircle size={48} strokeWidth={3} />
                   </motion.div>
                   <h2 className="text-5xl font-black mb-3 tracking-tighter leading-none">{t.saleComplete}</h2>
                   <p className="text-[11px] font-black uppercase tracking-[0.5em] opacity-60">Success • Transaction Secured</p>
                </div>
                
                <div className="p-12 md:p-16 space-y-10">
                   <div className="flex justify-between items-center bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                      <div>
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">Settled by</p>
                        <p className="font-black text-slate-800 text-2xl uppercase tracking-tighter leading-none">{showInvoice.customerName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase font-black text-slate-400 mb-2 tracking-widest">Total Paid</p>
                        <p className="text-4xl font-black theme-text tracking-tighter leading-none">₹{showInvoice.total.toLocaleString()}</p>
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4">
                     <button onClick={() => { window.print(); }} className="flex-1 theme-bg text-white py-6 rounded-[28px] font-black text-lg flex items-center justify-center gap-4 shadow-2xl shadow-pink-500/30 hover:scale-[1.02] active:scale-95 transition-all group">
                        <Printer size={24} className="group-hover:rotate-12 transition-transform" /> Print Invoice
                     </button>
                     <button onClick={() => setShowInvoice(null)} className="flex-1 bg-slate-900 text-white py-6 rounded-[28px] font-black text-lg flex items-center justify-center gap-4 hover:scale-[1.02] active:scale-95 transition-all">
                        <ArrowRight size={24} /> Next Order
                     </button>
                   </div>
                   
                   <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Transaction Ref: #{String(showInvoice.id).slice(-10).toUpperCase()}</p>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Billing;
