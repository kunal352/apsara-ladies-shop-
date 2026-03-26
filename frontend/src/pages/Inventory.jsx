import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, Filter, X, Save, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Kurti', price: '', stock: '' });

  const categories = ['All', 'Kurti', 'Saree', 'Dress', 'Accessories'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load inventory');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/products/${editingId}`, formData);
        toast.success('Product updated!');
      } else {
        await axios.post(`${API_URL}/products`, formData);
        toast.success('New product added!');
      }
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: '', category: 'Kurti', price: '', stock: '' });
      fetchProducts();
    } catch (err) {
      toast.error('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      toast.success('Product removed');
      fetchProducts();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filtered = products.filter(p => 
    (filterCategory === 'All' || p.category === filterCategory) &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-none">Inventory Catalog</h1>
          <p className="text-slate-500 font-medium">Manage stock levels and product details</p>
        </div>
        <button 
          onClick={() => { setShowModal(true); setEditingId(null); setFormData({ name: '', category: 'Kurti', price: '', stock: '' }); }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} /> Add New Product
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search products by name..." 
            className="input-field pl-16 py-4 text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={20} className="text-slate-400" />
          <div className="flex gap-2">
            {categories.map(cat => (
              <button 
                key={cat} onClick={() => setFilterCategory(cat)}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${filterCategory === cat ? 'bg-apsara-pink text-white shadow-lg' : 'bg-white text-slate-500 hover:bg-slate-100'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-500 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-10 py-6">Product Details</th>
              <th className="px-10 py-6 text-center">Price</th>
              <th className="px-10 py-6 text-center">Remaining</th>
              <th className="px-10 py-6 text-center">Sold</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(p => (
              <tr key={p._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-apsara-light flex items-center justify-center text-apsara-pink shadow-inner">
                       <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 border-b border-transparent group-hover:border-apsara-pink/20 transition-all">{p.name}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">{p.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6 text-center font-black text-xl text-slate-800">₹{p.price}</td>
                <td className="px-10 py-6 text-center">
                   <span className={`px-4 py-1.5 rounded-full font-black text-sm ${p.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                     {p.stock} units
                   </span>
                </td>
                <td className="px-10 py-6 text-center font-bold text-slate-400">{p.sold} sold</td>
                <td className="px-10 py-6 text-right">
                   <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button 
                        onClick={() => { setEditingId(p._id); setFormData({ name: p.name, category: p.category, price: p.price, stock: p.stock }); setShowModal(true); }}
                        className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-apsara-pink hover:text-apsara-pink shadow-sm transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(p._id)}
                        className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 hover:border-red-500 hover:text-red-500 shadow-sm transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden p-10 relative">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-50 transition-all"
              >
                <X size={24} />
              </button>
              
              <h2 className="text-3xl font-black text-slate-950 mb-8">{editingId ? 'Edit Collection' : 'Add New Arrivals'}</h2>
              
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-600 uppercase tracking-widest mb-2 px-2">Product Name</label>
                  <input required placeholder="E.g. Banarasi Silk Saree" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-black text-slate-600 uppercase tracking-widest mb-2 px-2 text-center">Category</label>
                    <select className="input-field cursor-pointer font-bold text-center" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-black text-slate-600 uppercase tracking-widest mb-2 px-2 text-center">Selling Price (₹)</label>
                    <input required type="number" placeholder="499" className="input-field text-center font-bold text-xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-black text-slate-600 uppercase tracking-widest mb-2 px-2">Initial Stock Qty</label>
                  <input required type="number" placeholder="20" className="input-field" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
                
                <button type="submit" className="w-full btn-primary py-5 text-xl flex items-center justify-center gap-2 mt-4">
                  <Save size={24} /> {editingId ? 'Save Changes' : 'Add to Catalog'}
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
