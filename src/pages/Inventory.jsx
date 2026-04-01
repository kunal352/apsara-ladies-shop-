import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, ShoppingBag, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Inventory = () => {
  const { products, addProduct, removeProduct, updateProduct, t, activeTheme, loading } = useShop();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Kurti', price: '', stock: '' });

  const categories = ['Kurti', 'Saree', 'Dress', 'Accessories'];

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
        toast.success('Inventory updated!');
      } else {
        await addProduct({ ...formData, price: Number(formData.price), stock: Number(formData.stock) });
        toast.success('Collection added!');
      }
      setShowModal(false);
      setEditingId(null);
    } catch (err) {
      // Error handled in context
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormData({ name: p.name, category: p.category, price: p.price, stock: p.stock });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-pink-600 rounded-full animate-spin"></div>
        <p className="font-black text-black uppercase tracking-widest text-xs">Loading Inventory...</p>
      </div>
    );
  }

  const totalVal = filteredProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock < 5).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 md:space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm gap-6">
        <div className="w-full md:w-auto">
           <h1 className="text-3xl md:text-4xl font-black text-black leading-none mb-2">{t.inventory}</h1>
           <p className="font-bold uppercase tracking-widest text-[10px] theme-text">Apsara General Store • Stock Management</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({ name: '', category: 'Kurti', price: '', stock: '' }); setShowModal(true); }}
          className="w-full md:w-auto theme-bg text-white px-8 py-4 rounded-xl md:rounded-2xl font-black text-lg flex items-center justify-center md:justify-start gap-2 shadow-xl hover:-translate-y-1 transition-all"
        >
          <Plus size={20} /> {t.addProduct}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Items</p>
            <p className="text-2xl font-black text-black">{products.length}</p>
         </div>
         <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mb-1">Categories</p>
            <p className="text-2xl font-black text-black">{[...new Set(products.map(p => p.category))].length}</p>
         </div>
         <div className="bg-red-50 p-6 rounded-3xl border border-red-100 shadow-sm">
            <p className="text-[10px] font-black text-red-600/60 uppercase tracking-widest mb-1">Low Stock</p>
            <p className="text-2xl font-black text-red-600">{lowStockCount}</p>
         </div>
         <div className="theme-bg-secondary p-6 rounded-3xl border theme-border shadow-sm">
            <p className="text-[10px] font-black theme-text uppercase tracking-widest mb-1">Value</p>
            <p className="text-2xl font-black theme-text">₹{totalVal}</p>
         </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={t.searchProducts}
            className="w-full pl-16 pr-8 py-4 md:py-5 rounded-xl md:rounded-[24px] bg-slate-50 border-none outline-none font-bold text-base md:text-lg text-black focus:ring-4 transition-all placeholder:text-black/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-hidden shadow-xl shadow-slate-200/50">
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-black/40 text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="px-12 py-10 text-left">Item Name</th>
                <th className="px-12 py-10 text-center">{t.price}</th>
                <th className="px-12 py-10 text-center">{t.stockShilak}</th>
                <th className="px-12 py-10 text-center">{t.stockGela}</th>
                <th className="px-12 py-10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(p => (
                <tr key={p.id} className="transition-colors group hover:bg-slate-50">
                  <td className="px-12 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner shadow-slate-900/10 transition-transform group-hover:scale-110 theme-bg-secondary theme-text">🛍️</div>
                      <div>
                        <p className="font-black text-black text-lg uppercase leading-none mb-1">{p.name}</p>
                        <p className="text-[10px] font-black tracking-widest uppercase border-l-2 pl-2 ml-1 mt-2 theme-text theme-border">{p.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-center font-black text-2xl text-black">₹{p.price}</td>
                  <td className="px-12 py-8 text-center">
                    <div className={`px-6 py-3 rounded-2xl font-black text-sm inline-flex items-center gap-2 border-2 ${p.stock < 5 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-green-50 border-green-200 text-green-600'}`}>
                      <span className={`w-2 h-2 rounded-full ${p.stock < 5 ? 'bg-red-600' : 'bg-green-600'}`}></span>
                      {p.stock} {t.shilak}
                    </div>
                  </td>
                  <td className="px-12 py-8 text-center">
                    <div className="bg-slate-900 px-6 py-3 rounded-2xl font-black text-sm inline-flex items-center gap-2 border border-slate-800 shadow-xl shadow-slate-900/50">
                      <span className="text-white font-mono">{p.sold}</span> <span className="text-slate-400">{t.gela}</span>
                    </div>
                  </td>
                  <td className="px-12 py-8 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => startEdit(p)} className="p-3 bg-slate-50 text-black/30 rounded-xl transition-all hover:theme-bg hover:text-white shadow-sm"><Edit2 size={18} /></button>
                      <button onClick={() => removeProduct(p.id)} className="p-3 bg-slate-50 text-black/30 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredProducts.map(p => (
            <div key={p.id} className="p-6 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner shadow-slate-900/10 theme-bg-secondary theme-text">🛍️</div>
                   <div>
                     <h3 className="font-black text-black uppercase leading-tight mb-1 text-lg">{p.name}</h3>
                     <p className="text-[9px] font-black tracking-widest uppercase theme-text">{p.category}</p>
                   </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-black">₹{p.price}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center ${p.stock < 5 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
                  <span className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Stock</span>
                  <span className="text-lg font-black">{p.stock}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center">
                  <span className="text-[9px] font-black uppercase tracking-widest mb-1 text-slate-400">Sold</span>
                  <span className="text-lg font-black text-white">{p.sold}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="flex-1 py-4 bg-slate-50 text-black rounded-xl font-black flex items-center justify-center gap-2 border border-slate-100 active:scale-95 transition-all">
                  <Edit2 size={16} /> Edit
                </button>
                <button onClick={() => removeProduct(p.id)} className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100 active:scale-95 transition-all">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[32px] md:rounded-[40px] w-full max-w-xl p-8 md:p-12 shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scrollbar">
               <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 md:top-10 md:right-10 text-black/20 hover:text-black"><X /></button>
               <h2 className="text-2xl md:text-4xl font-black text-black mb-8 md:mb-10">{editingId ? 'Edit Product' : 'Add New Arrivals'}</h2>
               
               <form onSubmit={handleSave} className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 px-4 mb-2 block">Product Name</label>
                    <input required className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-base md:text-lg text-black" placeholder="E.g. Traditional Saree" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 px-4 mb-2 block">Category</label>
                      <input 
                        list="categories-list"
                        className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-none outline-none font-bold text-base md:text-lg text-black focus:ring-4 focus:ring-slate-100" 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        placeholder="Select or Type..."
                      />
                      <datalist id="categories-list">
                        {categories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-black/40 px-4 mb-2 block md:text-center">Price (₹)</label>
                      <input required type="number" className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-none outline-none font-black md:text-center text-xl md:text-2xl text-black" placeholder="00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-black/40 px-4 mb-2 block">Opening Stock Qty</label>
                    <input required type="number" className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-none outline-none font-bold text-base md:text-lg text-black" placeholder="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                 </div>
                 
                 <button type="submit" className={`w-full theme-bg text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:theme-hover transition-all shadow-xl shadow-slate-200 mt-4 flex items-center justify-center gap-4`}>
                    <Save size={24} /> {editingId ? 'Store Changes' : 'Confirm New Arrival'}
                 </button>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Inventory;
