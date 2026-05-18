import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, ShoppingBag, Search, Filter, ArrowUpRight, Sparkles, Package, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

const Inventory = () => {
  const { products, addProduct, removeProduct, updateProduct, t, activeTheme, loading, lang } = useShop();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Kurti', price: '', stock: '' });

  const categories = ['Kurti', 'Saree', 'Dress', 'Accessories', 'Silk', 'Cotton'];
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProduct(editingId, { ...formData, price: Number(formData.price), stock: Number(formData.stock) });
        toast.success('Collection Updated ✨');
      } else {
        await addProduct({ ...formData, price: Number(formData.price), stock: Number(formData.stock) });
        toast.success('New Arrival Added 🌸');
      }
      setShowModal(false);
      setEditingId(null);
    } catch (err) { }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormData({ name: p.name, category: p.category, price: p.price, stock: p.stock });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="w-16 h-16 border-[5px] border-slate-100 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="font-black text-slate-400 uppercase tracking-[0.5em] text-[10px]">Updating Boutique</p>
      </div>
    );
  }

  const totalVal = filteredProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const lowStockCount = products.filter(p => p.stock < 5).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5 pb-6">
      {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white/40 backdrop-blur-xl p-5 rounded-[24px] border border-white/60 premium-shadow gap-4 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 theme-bg opacity-[0.05] blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10 flex items-center gap-4">
             <div className="w-12 h-12 theme-bg rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/10 rotate-3">
                <ShoppingBag className="text-white" size={20} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-800 leading-none mb-1.5 tracking-tighter">{t.inventory}</h1>
                <p className="font-black uppercase tracking-[0.3em] text-[9px] text-slate-400">Apsara • {products.length} {lang === 'mr' ? 'वस्तू' : 'Items'}</p>
             </div>
          </div>
          <button 
            onClick={() => { setEditingId(null); setFormData({ name: '', category: 'Kurti', price: '', stock: '' }); setShowModal(true); }}
            className="w-full md:w-auto theme-bg text-white px-6 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Plus size={16} strokeWidth={3} /> {t.addProduct}
          </button>
        </div>

      {/* Stats Summary Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
           {[
             { label: t.totalItems, value: products.length, sub: t.varieties, color: 'bg-white' },
             { label: t.categories, value: [...new Set(products.map(p => p.category))].length, sub: t.category, color: 'bg-white' },
             { label: t.lowStock, value: lowStockCount, sub: t.criticalStock, color: 'bg-red-50', text: 'text-red-600' },
             { label: t.netWorth, value: `₹${totalVal.toLocaleString()}`, sub: t.stockValue, color: 'bg-indigo-50', text: 'text-indigo-600' }
           ].map((stat, i) => (
             <div key={i} className={`p-4 glass-card rounded-2xl premium-shadow border border-white/40 group hover:bg-white transition-all duration-500`}>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <p className={`text-xl font-black ${stat.text || 'text-slate-800'} tracking-tight`}>{stat.value}</p>
                <p className="text-[8px] font-bold text-slate-300 mt-0.5 uppercase">{stat.sub}</p>
             </div>
           ))}
        </div>

      {/* Search & Filter Bar */}
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
          <button className="hidden md:flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-100 font-black text-xs uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            <Filter size={14} /> {lang === 'mr' ? 'फिल्टर' : 'Filter List'}
          </button>
        </div>

      {/* Inventory Table/List */}
        <div className="glass-card rounded-2xl premium-shadow border border-white/40 overflow-hidden">
          <div className="hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/30">
                  <th className="px-6 py-3 text-left text-[9px] font-black uppercase tracking-wider text-slate-400">{t.productDetails}</th>
                  <th className="px-6 py-3 text-center text-[9px] font-black uppercase tracking-wider text-slate-400">{t.unitPrice}</th>
                  <th className="px-6 py-3 text-center text-[9px] font-black uppercase tracking-wider text-slate-400">{t.quantity}</th>
                  <th className="px-6 py-3 text-center text-[9px] font-black uppercase tracking-wider text-slate-400">{t.totalStatus}</th>
                  <th className="px-6 py-3 text-right text-[9px] font-black uppercase tracking-wider text-slate-400">{t.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((p, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={p.id} 
                    className="group hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl theme-bg-secondary theme-text flex items-center justify-center font-black text-lg shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                           <span className="opacity-80">👗</span>
                        </div>
                        <div>
                          <p className="font-black text-slate-800 text-sm tracking-tight mb-0.5 group-hover:text-pink-600 transition-colors uppercase">{p.name}</p>
                          <span className="text-[8px] font-black bg-white px-2 py-0.5 rounded border border-slate-100 text-slate-400 uppercase tracking-wider shadow-sm group-hover:text-pink-500 group-hover:border-pink-100 transition-all">{p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <p className="text-base font-black text-slate-800 tracking-tight">₹{p.price.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className={`px-4 py-1.5 rounded-xl font-black text-[10px] inline-flex flex-col items-center justify-center border shadow-sm transition-all duration-500 ${p.stock < 5 ? 'bg-red-50 border-red-100 text-red-600 animate-pulse scale-105' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                        <span className="text-base leading-none mb-0.5">{p.stock}</span>
                        <span className="uppercase tracking-wider text-[7px] opacity-60">{t.unitsLeft}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="inline-flex items-center gap-2 bg-slate-900 px-4 py-1.5 rounded-xl text-white shadow-md shadow-slate-950/20 group-hover:bg-slate-800 transition-colors">
                         <TrendingUp size={12} className="text-pink-400" />
                         <div>
                            <p className="text-sm font-black leading-none">{p.sold}</p>
                            <p className="text-[7px] font-black uppercase text-slate-500 tracking-wider mt-0.5">{t.gela}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-20 group-hover:opacity-100 transition-all duration-300">
                        <button onClick={() => startEdit(p)} className="p-2 bg-white text-slate-400 rounded-xl hover:text-indigo-600 hover:shadow-md hover:-translate-y-0.5 transition-all border border-slate-100"><Edit2 size={14} /></button>
                        <button onClick={() => removeProduct(p.id)} className="p-2 bg-white text-slate-400 rounded-xl hover:text-red-500 hover:shadow-md hover:-translate-y-0.5 transition-all border border-slate-100"><Trash2 size={14} /></button>
                      </div>
                    </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Modern Cards */}
        <div className="lg:hidden p-6 space-y-6 bg-slate-50/50">
          {filteredProducts.map((p, idx) => (
             <div key={p.id} className="bg-white p-8 rounded-[40px] premium-shadow space-y-8 relative overflow-hidden active:scale-[0.98] transition-transform">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl theme-bg-secondary theme-text flex items-center justify-center text-xl shadow-inner">🛍️</div>
                    <div>
                      <h3 className="font-black text-slate-800 text-xl tracking-tight leading-tight">{p.name}</h3>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{p.category}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-800 font-black text-xl">₹{p.price}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-5 rounded-[24px] border-2 flex flex-col items-center justify-center ${p.stock < 5 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}>
                    <span className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">{t.remainingStock}</span>
                    <span className="text-2xl font-black">{p.stock} <span className="text-[10px] lowercase">{t.shilak}</span></span>
                  </div>
                  <div className="p-5 rounded-[24px] bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-white">
                    <span className="text-[9px] font-black uppercase tracking-widest mb-1 text-slate-400">{t.totalStatus}</span>
                    <span className="text-2xl font-black">{p.sold} <span className="text-[10px] lowercase">{t.gela}</span></span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => startEdit(p)} className="flex-1 py-5 bg-slate-100 text-slate-800 rounded-[20px] font-bold text-sm tracking-tight active:bg-slate-200 transition-colors flex items-center justify-center gap-3">
                    <Edit2 size={18} /> {t.personalize}
                  </button>
                  <button onClick={() => removeProduct(p.id)} className="w-16 h-16 bg-red-50 text-red-500 rounded-[20px] flex items-center justify-center border border-red-100 active:scale-90 transition-all">
                    <Trash2 size={24} />
                  </button>
                </div>
             </div>
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-40 space-y-8 animate-fade-in bg-slate-50/50">
             <div className="w-24 h-24 bg-white rounded-[38px] flex items-center justify-center mx-auto shadow-2xl shadow-slate-200">
               <Search size={40} className="text-slate-200" />
             </div>
             <p className="text-slate-300 font-extrabold uppercase tracking-[0.5em] text-xs">{lang === 'mr' ? 'कोणतीही वस्तू आढळली नाही' : 'No Boutique items Found'}</p>
          </div>
        )}
      </div>

      {/* Modern Modal / Editor */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/40 backdrop-blur-xl z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[48px] w-full max-w-2xl p-10 md:p-16 shadow-[0_40px_100px_rgba(0,0,0,0.3)] relative overflow-y-auto max-h-[90vh] custom-scrollbar border border-white/20">
               <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 p-3 bg-slate-50 text-slate-300 rounded-2xl hover:text-red-500 hover:bg-red-50 transition-all"><X size={24}/></button>
               
               <div className="flex items-center gap-6 mb-16">
                  <div className="p-5 theme-bg rounded-[24px] text-white shadow-xl rotate-6 group-hover:rotate-0 transition-transform">
                     <Sparkles size={32} />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter leading-none">{editingId ? (lang === 'mr' ? 'माहिती बदला' : 'Refine Product') : (lang === 'mr' ? 'नवीन कलेक्शन' : 'New Collection')}</h2>
               </div>
               
               <form onSubmit={handleSave} className="space-y-10">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-4">{lang === 'mr' ? 'वस्तूचे नाव' : 'Product Title'}</label>
                    <input required className="w-full px-10 py-6 rounded-[28px] bg-slate-50/80 border-none outline-none focus:bg-white focus:ring-[15px] focus:ring-slate-100 transition-all font-black text-xl text-slate-800 placeholder:text-slate-300" placeholder={lang === 'mr' ? 'येथे वस्तूचे नाव लिहा...' : 'Product Title Here...'} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-4">{lang === 'mr' ? 'कॅटेगरी' : 'Category'}</label>
                      <input 
                        list="categories-list"
                        className="w-full px-10 py-6 rounded-[28px] bg-slate-50/80 border-none outline-none font-bold text-lg text-slate-800 focus:bg-white focus:ring-[15px] focus:ring-slate-100 transition-all shadow-sm"
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        placeholder={lang === 'mr' ? 'कॅटेगरी निवडा...' : 'Select Category...'}
                      />
                      <datalist id="categories-list">
                        {categories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                    <div className="space-y-4 text-center">
                      <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{lang === 'mr' ? 'किंमत (₹ प्रति नग)' : 'Unit Price (₹)'}</label>
                      <input required type="number" className="w-full px-10 py-6 rounded-[28px] bg-slate-50/80 border-none outline-none font-black text-center text-4xl text-slate-800 focus:bg-white focus:ring-[15px] focus:ring-slate-100 transition-all shadow-sm" placeholder="00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 px-4">{lang === 'mr' ? 'एकूण नग (स्टॉक)' : 'Starting Quantity'}</label>
                    <div className="relative group">
                       <Package className="absolute left-10 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-pink-500 transition-colors" size={24} />
                       <input required type="number" className="w-full pl-20 pr-10 py-6 rounded-[28px] bg-slate-50/80 border-none outline-none font-black text-xl text-slate-800 focus:bg-white focus:ring-[15px] focus:ring-slate-100 transition-all" placeholder={lang === 'mr' ? 'स्टॉक मधील नग संख्या...' : 'Volume in stock...'} value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                    </div>
                 </div>
                 
                 <div className="pt-6">
                   <button type="submit" className={`w-full theme-bg text-white py-8 rounded-[32px] font-black text-xl hover:scale-[1.03] active:scale-95 transition-all shadow-[0_25px_60px_-15px_rgba(190,24,93,0.4)] flex items-center justify-center gap-6 group`}>
                      <Save size={28} className="group-hover:rotate-12 transition-transform" /> 
                      {editingId ? (lang === 'mr' ? 'माहिती जतन करा' : 'Update Boutique') : (lang === 'mr' ? 'कलेक्शन समाविष्ट करा' : 'Introduce Collection')}
                   </button>
                 </div>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Inventory;
