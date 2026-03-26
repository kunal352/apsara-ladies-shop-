import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Package, AlertTriangle, TrendingUp } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const StatCard = ({ title, value, icon, color, colorGlow }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`glass-card p-8 flex items-center justify-between border-l-8 ${color}`}
  >
    <div>
      <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
      <h2 className="text-4xl font-extrabold text-slate-900">{value}</h2>
    </div>
    <div className={`p-5 rounded-2xl shadow-xl ${colorGlow}`}>
      {icon}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ totalProducts: 0, totalSold: 0, remainingStock: 0, lowStock: 0, totalRevenue: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/stats`);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12 max-w-7xl"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 leading-none mb-3">Shop Overview</h1>
          <p className="text-xl font-medium text-slate-500">Apsara Ladies Shop - Real-time performance</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-xl shadow-slate-100 flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-bold text-slate-700">Live Analytics</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatCard 
          title="Total Revenue" 
          value={`₹${stats.totalRevenue}`} 
          icon={<DollarSign className="text-white" size={32} />} 
          color="border-apsara-pink"
          colorGlow="bg-apsara-pink shadow-pink-200"
        />
        <StatCard 
          title="Items Sold" 
          value={stats.totalSold} 
          icon={<TrendingUp className="text-white" size={32} />} 
          color="border-apsara-purple"
          colorGlow="bg-apsara-purple shadow-purple-200"
        />
        <StatCard 
          title="Remaining Stock" 
          value={stats.remainingStock} 
          icon={<Package className="text-white" size={32} />} 
          color="border-sky-500"
          colorGlow="bg-sky-500 shadow-sky-200"
        />
      </div>

      {stats.lowStock > 0 && (
        <motion.div 
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="bg-red-50 border-2 border-red-200 p-8 rounded-3xl flex items-center justify-between"
        >
          <div className="flex items-center gap-6">
             <div className="bg-red-500 p-4 rounded-2xl">
               <AlertTriangle className="text-white" size={32} />
             </div>
             <div>
                <h3 className="text-2xl font-black text-red-950">Low Stock Alert!</h3>
                <p className="text-red-700 font-medium">{stats.lowStock} products are running low on inventory. Please restock soon.</p>
             </div>
          </div>
          <button className="bg-red-500 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-red-200 hover:opacity-90 transition-all">
            Review Stock
          </button>
        </motion.div>
      )}

      {/* Placeholder for Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="glass-card p-10 h-96 flex flex-col justify-center items-center text-center">
            <div className="bg-apsara-light p-6 rounded-full mb-6">
              <ShoppingCart className="text-apsara-pink opacity-20" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Recent Sales</h3>
            <p className="text-slate-500 max-w-xs mx-auto">Sales history will appear here once the first transaction is recorded.</p>
        </div>
        <div className="glass-card p-10 h-96 flex flex-col justify-center items-center text-center">
            <div className="bg-apsara-light p-6 rounded-full mb-6">
              <Package className="text-apsara-purple opacity-20" size={64} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">New Arrivals</h3>
            <p className="text-slate-500 max-w-xs mx-auto">New inventory arrivals will be logged here for quick reference.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
