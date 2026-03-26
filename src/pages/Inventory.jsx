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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-none mb-2">{t.inventory}</h1>
          <p className={`font-bold uppercase tracking-widest text-[10px] text-${activeTheme.primary}`}>Apsara General Store - Stock Control</p>
        </div>
        <button 
          onClick={() => { setEditingId(null); setFormData({ name: '', category: 'Kurti', price: '', stock: '' }); setShowModal(true); }}
          className={`bg-${activeTheme.primary} text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-2 shadow-xl shadow-${activeTheme.primary}/20 hover:-translate-y-1 transition-all`}
        >
          <Plus size={20} /> {t.addProduct}
        </button>
      </div>

      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder={t.searchProducts}
            className={`w-full pl-16 pr-8 py-5 rounded-[24px] bg-slate-50 border-none outline-none font-bold text-lg text-slate-900 focus:ring-4 focus:ring-${activeTheme.secondary} transition-all`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-x-auto custom-scrollbar shadow-xl shadow-slate-200/50">
        <table className="w-full text-left min-w-[1000px]">
          <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-center">
            <tr>
              <th className="px-12 py-10 text-left">Item Name</th>
              <th className="px-12 py-10">{t.price}</th>
              <th className="px-12 py-10">{t.stockShilak}</th>
              <th className="px-12 py-10">{t.stockGela}</th>
              <th className="px-12 py-10 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.map(p => (
              <tr key={p.id} className={`hover:bg-${activeTheme.secondary}/20 transition-colors group`}>
                <td className="px-12 py-8">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${activeTheme.secondary} rounded-2xl flex items-center justify-center text-${activeTheme.primary} font-black text-xl shadow-inner shadow-slate-900/10 transition-transform group-hover:scale-110`}>🛍️</div>
                    <div>
                      <p className="font-black text-slate-900 text-lg uppercase leading-none mb-1">{p.name}</p>
                      <p className={`text-[10px] font-black tracking-widest text-${activeTheme.primary} uppercase border-l-2 border-${activeTheme.primary} pl-2 ml-1 mt-2`}>{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-12 py-8 text-center font-black text-2xl text-slate-900">₹{p.price}</td>
                <td className="px-12 py-8 text-center">
                   <div className={`px-6 py-3 rounded-2xl font-black text-sm inline-flex items-center gap-2 border-2 ${p.stock < 5 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : `bg-green-50 border-green-200 text-green-600`}`}>
                     <span className={`w-2 h-2 rounded-full ${p.stock < 5 ? 'bg-red-600' : 'bg-green-600'}`}></span>
                     {p.stock} {t.shilak}
                   </div>
                </td>
                <td className="px-12 py-8 text-center">
                   <div className="bg-slate-900 text-slate-400 px-6 py-3 rounded-2xl font-black text-sm inline-flex items-center gap-2 border border-slate-800 shadow-xl shadow-slate-900/50">
                     <span className="text-white">{p.sold}</span> {t.gela}
                   </div>
                </td>
                <td className="px-12 py-8 text-right">
                   <button onClick={() => startEdit(p)} className={`p-3 text-slate-400 hover:text-${activeTheme.primary} transition-colors mr-2`}><Edit2 size={20} /></button>
                   <button onClick={() => removeProduct(p.id)} className="p-3 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[40px] w-full max-w-xl p-12 shadow-2xl shadow-slate-900/10 relative">
               <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 text-slate-400 hover:text-slate-600"><X /></button>
               <h2 className="text-4xl font-black text-slate-950 mb-10">{editingId ? 'Edit Product' : 'Add New Arrivals'}</h2>
               
               <form onSubmit={handleSave} className="space-y-6">
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2 block">Product Name</label>
                   <input required className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-slate-100 transition-all font-bold text-lg text-slate-900" placeholder="E.g. Traditional Saree" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                 </div>
                 <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2 block">Category (Type or Select)</label>
                      <input 
                        list="categories-list"
                        className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none outline-none font-bold text-lg text-slate-900 focus:ring-4 focus:ring-slate-100" 
                        value={formData.category} 
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        placeholder="Select or Type..."
                      />
                      <datalist id="categories-list">
                        {categories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2 block text-center">Price (₹)</label>
                      <input required type="number" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none outline-none font-black text-center text-2xl text-slate-900" placeholder="00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                 </div>
                 <div>
                   <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4 mb-2 block">Opening Stock Qty</label>
                   <input required type="number" className="w-full px-8 py-5 rounded-2xl bg-slate-50 border-none outline-none font-bold text-lg text-slate-900" placeholder="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                 </div>
                 
                 <button type="submit" className={`w-full bg-${activeTheme.primary} text-white py-6 rounded-2xl font-black text-xl hover:opacity-95 transition-all shadow-xl shadow-${activeTheme.primary}/20 mt-4 flex items-center justify-center gap-4`}>
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
