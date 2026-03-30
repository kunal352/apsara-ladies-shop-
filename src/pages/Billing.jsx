import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, User, Phone, ShoppingCart, Trash2, CreditCard, Sparkles, X, CheckCircle, Printer, Search } from 'lucide-react';
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
    if (product.stock <= 0) return toast.error('Out of stock!');
    setSelectedItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.qty + 1 > product.stock) {
           toast.error('Not enough stock!');
           return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const removeItem = (id) => setSelectedItems(prev => prev.filter(item => item.id !== id));

  const [manualAmount, setManualAmount] = useState(0);
  const [isManual, setIsManual] = useState(false);

  const totalAmount = isManual ? manualAmount : selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    if (!customer.name || customer.mobile.length !== 10 || selectedItems.length === 0) {
      if (customer.mobile.length !== 10) return toast.error('Enter valid 10-digit mobile!');
      return toast.error('Check customer details and items!');
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
        setIsManual(false);
        toast.success(t.success);
      }
    } catch (err) {
      toast.error('Checkout failed!');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-[1400px]">
      {/* Header - Hidden in Print */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm print:hidden">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-none mb-2">{t.billing}</h1>
          <p className="font-bold uppercase tracking-widest text-[10px] theme-text">{shopDetails.name} • {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:hidden">
        {/* Left: Product Selector */}
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm min-h-[500px]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10">
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3 leading-none">
                   <Sparkles style={{ color: activeTheme.hex }} size={24} /> {t.collection}
                </h2>
                <div className="relative w-full sm:w-80">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <input 
                    className="w-full pl-16 py-4 rounded-full bg-slate-50 border-none outline-none font-bold text-slate-900 focus:ring-4 transition-all text-base shadow-inner"
                    placeholder={t.search} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
              </div>

              {/* Quick Categories */}
              <div className="flex flex-wrap gap-2 mb-8">
                 {['All', ...new Set(products.map(p => p.category))].map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setSearchTerm(cat === 'All' ? '' : cat)}
                    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                      (searchTerm.toLowerCase() === cat.toLowerCase() || (cat === 'All' && searchTerm === ''))
                      ? 'theme-bg text-white border-transparent shadow-lg scale-105' 
                      : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'
                    }`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                 {filteredProducts.map(p => (
                   <button 
                     key={p.id} 
                     onClick={() => addItem(p)}
                     disabled={p.stock <= 0}
                     className={`p-5 rounded-[24px] border text-left transition-all relative group ${p.stock <= 0 ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed shadow-none' : 'bg-white border-slate-100 hover:shadow-xl hover:-translate-y-1'}`}
                     style={{ boxShadow: p.stock <= 0 ? 'none' : '0 10px 15px -3px rgb(0 0 0 / 0.05)' }}
                   >
                     {p.stock < 5 && p.stock > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce z-10">LOW</span>}
                     <div className="flex items-center gap-4 mb-4">
                       <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl theme-bg-secondary transform group-hover:rotate-12 transition-transform">🛍️</div>
                       <div className="flex-1 min-w-0">
                         <h4 className="font-black text-slate-900 leading-tight text-sm uppercase truncate">{p.name}</h4>
                         <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase truncate">{p.category}</p>
                       </div>
                     </div>
                     <div className="flex justify-between items-center bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
                       <span className="text-xl font-black text-slate-900 leading-none">₹{p.price}</span>
                       <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-lg ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>{p.stock} {t.shilak}</span>
                     </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Cart/Sidebar */}
        <div className="lg:col-span-4">
           <div className="bg-white p-8 rounded-[32px] border-t-8 shadow-2xl shadow-slate-900/5 lg:sticky lg:top-8" style={{ borderTopColor: activeTheme.hex }}>
              <h2 className="text-xl font-black text-slate-950 flex items-center gap-2 mb-8">
                 <ShoppingCart style={{ color: activeTheme.hex }} size={20} /> Current Bill
              </h2>

              <div className="space-y-6">
                 <div className="grid grid-cols-1 gap-4">
                    <div className="relative group">
                       <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-none outline-none font-bold text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-slate-100 uppercase"
                        placeholder={t.customerName} 
                        value={customer.name} 
                        onChange={e => setCustomer({...customer, name: e.target.value.replace(/[^A-Za-z ]/g, '')})} 
                       />
                    </div>
                    <div className="relative group">
                       <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border-none outline-none font-bold text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-slate-100 font-mono"
                        placeholder={t.mobile} 
                        maxLength="10"
                        value={customer.mobile} 
                        onChange={e => setCustomer({...customer, mobile: e.target.value.replace(/\D/g, '')})} 
                       />
                    </div>
                 </div>

                 <div className="space-y-3 min-h-[150px] max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 group shadow-sm">
                         <div className="flex-1">
                            <p className="font-black text-slate-900 text-xs uppercase truncate leading-none mb-1">{item.name}</p>
                            <p className="font-bold text-slate-400 text-[10px]">₹{item.price} × {item.qty}</p>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="font-black text-slate-900">₹{item.price * item.qty}</span>
                            <button onClick={() => removeItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
                         </div>
                      </div>
                    ))}
                    {selectedItems.length === 0 && (
                      <div className="text-center py-10 opacity-30">
                        <ShoppingCart className="mx-auto mb-2" size={32} />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Items Added</p>
                      </div>
                    )}
                 </div>

                 <div className="bg-slate-900 text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden">
                    <div className="flex justify-between items-end mb-6 relative z-10">
                       <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Grand Total</p>
                       <span className="text-4xl font-black theme-text leading-none">₹{totalAmount}</span>
                    </div>
                    <button 
                      onClick={handleCheckout}
                      disabled={selectedItems.length === 0}
                      className="w-full theme-bg text-white py-5 rounded-2xl font-black text-lg hover:shadow-lg active:scale-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2"
                    >
                      <CreditCard size={22} /> {t.completeSale}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Success Modal & Printing */}
      <AnimatePresence>
        {showInvoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl z-[200] flex items-center justify-center p-6">
             {/* Hidden Print Content - Formatted for Thermal Paper */}
             <div id="printable-bill" className="hidden print:block text-slate-900 font-serif w-full p-2">
                <div className="text-center mb-6 pt-4 border-b-2 border-dashed border-slate-900 pb-4">
                   <h1 className="text-2xl font-black uppercase mb-1">{shopDetails.name}</h1>
                   <p className="text-[10px] italic">{shopDetails.tagline}</p>
                   <p className="text-[9px] mt-2 uppercase">INV: #{showInvoice.id.slice(-6).toUpperCase()} • {new Date(showInvoice.date).toLocaleDateString()}</p>
                </div>
                
                <div className="flex justify-between text-[11px] mb-4">
                   <p><b>Cust:</b> {showInvoice.customerName}</p>
                   <p><b>PH:</b> {showInvoice.customerMobile}</p>
                </div>

                <table className="w-full text-left text-[11px] mb-4">
                   <thead className="border-b border-slate-900">
                      <tr>
                        <th className="py-2">Item</th>
                        <th className="py-2 text-center">Qty</th>
                        <th className="py-2 text-right">Amt</th>
                      </tr>
                   </thead>
                   <tbody>
                      {showInvoice.items.map((i, idx) => (
                        <tr key={idx} className="border-b border-slate-50">
                           <td className="py-2 font-bold uppercase">{i.name}</td>
                           <td className="py-2 text-center">{i.qty}</td>
                           <td className="py-2 text-right">₹{i.price * i.qty}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>

                <div className="flex justify-between items-center text-lg font-black border-t-2 border-slate-900 pt-3">
                   <span>TOTAL</span>
                   <span>₹{showInvoice.total}</span>
                </div>
                
                <p className="text-center mt-10 text-[10px] font-bold uppercase tracking-widest">{t.thankYou}</p>
             </div>

             <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl relative print:hidden">
                <div className="theme-bg p-12 text-center text-white">
                   <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
                     <CheckCircle size={40} />
                   </div>
                   <h2 className="text-4xl font-black mb-2">{t.saleComplete}</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Order ID: #{showInvoice.id.slice(-6)}</p>
                </div>
                <div className="p-10 space-y-8">
                   <div className="flex justify-between items-center">
                      <div><p className="text-[10px] uppercase font-black text-slate-400">Customer</p><p className="font-black text-slate-900 text-lg uppercase">{showInvoice.customerName}</p></div>
                      <div className="text-right"><p className="text-[10px] uppercase font-black text-slate-400">Total Paid</p><p className="text-3xl font-black theme-text">₹{showInvoice.total}</p></div>
                   </div>
                   <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
                      <Printer size={22} /> {t.printBill}
                   </button>
                   <button onClick={() => setShowInvoice(null)} className="w-full text-center py-2 theme-text font-black text-xs uppercase tracking-widest hover:opacity-70 transition-all">
                      Close & Next Order
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Billing;
