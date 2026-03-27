import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Save, ShoppingBag, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Inventory = () => {
  const { products, addProduct, removeProduct, updateProduct, t, activeTheme } = useShop();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Kurti', price: '', stock: '' });

  const categories = ['Kurti', 'Saree', 'Dress', 'Accessories'];

  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      updateProduct(editingId, { ...formData, price: Number(formData.price), stock: Number(formData.stock) });
      toast.success('Inventory updated!');
    } else {
      addProduct({ ...formData, price: Number(formData.price), stock: Number(formData.stock) });
      toast.success('Collection added!');
    }
    setShowModal(false);
    setEditingId(null);
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setFormData({ name: p.name, category: p.category, price: p.price, stock: p.stock });
    setShowModal(true);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm gap-6">
        <div className="w-full md:w-auto">
           <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none mb-2">{t.inventory}</h1>
           <p className="font-bold uppercase tracking-widest text-[10px] theme-text">Apsara General Store - Stock Control</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({ name: '', category: 'Kurti', price: '', stock: '' }); setShowModal(true); }}
          className="w-full md:w-auto theme-bg text-white px-8 py-4 rounded-xl md:rounded-2xl font-black text-lg flex items-center justify-center md:justify-start gap-2 shadow-xl hover:-translate-y-1 transition-all"
        >
          <Plus size={20} /> {t.addProduct}
        </button>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={t.searchProducts}
            className="w-full pl-16 pr-8 py-4 md:py-5 rounded-xl md:rounded-[24px] bg-slate-50 border-none outline-none font-bold text-base md:text-lg text-slate-900 focus:ring-4 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>


      <div className="bg-white rounded-[24px] md:rounded-[40px] border border-slate-100 shadow-sm overflow-x-auto custom-scrollbar shadow-xl shadow-slate-200/50">
        <table className="w-full text-left min-w-[700px] md:min-w-[1000px]">
          <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center">
            <tr>
              <th className="px-6 md:px-12 py-8 md:py-10 text-left">Item Name</th>
              <th className="px-6 md:px-12 py-8 md:py-10">{t.price}</th>
              <th className="px-6 md:px-12 py-8 md:py-10">{t.stockShilak}</th>
              <th className="px-6 md:px-12 py-8 md:py-10">{t.stockGela}</th>
              <th className="px-6 md:px-12 py-8 md:py-10 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map(p => (
              <tr key={p.id} className="transition-colors group theme-hover-secondary">
                <td className="px-6 md:px-12 py-6 md:py-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-black text-lg md:text-xl shadow-inner shadow-slate-900/10 transition-transform group-hover:scale-110 theme-bg-secondary theme-text">🛍️</div>
                    <div>
                      <p className="font-black text-slate-900 text-base md:text-lg uppercase leading-none mb-1">{p.name}</p>
                      <p className="text-[10px] font-black tracking-widest uppercase border-l-2 pl-2 ml-1 mt-2 theme-text theme-border">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 md:px-12 py-6 md:py-8 text-center font-black text-xl md:text-2xl text-slate-900">₹{p.price}</td>
                <td className="px-6 md:px-12 py-6 md:py-8 text-center">
                   <div className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm inline-flex items-center gap-2 border-2 ${p.stock < 5 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-green-50 border-green-200 text-green-600'}`}>
                     <span className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${p.stock < 5 ? 'bg-red-600' : 'bg-green-600'}`}></span>
                     {p.stock} {t.shilak}
                   </div>
                </td>
                <td className="px-6 md:px-12 py-6 md:py-8 text-center">
                   <div className="bg-slate-900 text-slate-400 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm inline-flex items-center gap-2 border border-slate-800 shadow-xl shadow-slate-900/50">
                     <span className="text-white">{p.sold}</span> {t.gela}
                   </div>
                </td>
                <td className="px-6 md:px-12 py-6 md:py-8 text-right flex items-center justify-end gap-1">
                   <button onClick={() => startEdit(p)} className="p-2 md:p-3 text-slate-400 transition-colors hover:theme-text"><Edit2 size={18} /></button>
                   <button onClick={() => removeProduct(p.id)} className="p-2 md:p-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[32px] md:rounded-[40px] w-full max-w-xl p-8 md:p-12 shadow-2xl shadow-slate-900/10 relative overflow-y-auto max-h-[90vh] custom-scrollbar">
               <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 md:top-10 md:right-10 text-slate-400 hover:text-slate-600"><X /></button>
               <h2 className="text-2xl md:text-4xl font-black text-slate-950 mb-8 md:mb-10">{editingId ? 'Edit Product' : 'Add New Arrivals'}</h2>
               
               <form onSubmit={handleSave} className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2 block">Product Name</label>
                   <input required className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-base md:text-lg text-slate-900" placeholder="E.g. Traditional Saree" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2 block">Category</label>
                      <input 
                        list="categories-list"
                        className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-none outline-none font-bold text-base md:text-lg text-slate-900 focus:ring-4 focus:ring-slate-100" 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        placeholder="Select or Type..."
                      />
                      <datalist id="categories-list">
                        {categories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2 block md:text-center">Price (₹)</label>
                      <input required type="number" className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-none outline-none font-black md:text-center text-xl md:text-2xl text-slate-900" placeholder="00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                 </div>
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2 block">Opening Stock Qty</label>
                   <input required type="number" className="w-full px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-slate-50 border-none outline-none font-bold text-base md:text-lg text-slate-900" placeholder="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                 </div>
                 
                 <button type="submit" className={`w-full theme-bg text-white py-5 md:py-6 rounded-xl md:rounded-2xl font-black text-lg md:text-xl hover:opacity-95 transition-all shadow-xl shadow-${activeTheme.primary}/20 mt-4 flex items-center justify-center gap-4`}>
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
