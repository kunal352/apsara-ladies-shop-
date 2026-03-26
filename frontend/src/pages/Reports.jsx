import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Calendar, Search, TrendingUp, DollarSign, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const Reports = () => {
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/bills`);
      setBills(data);
    } catch (err) {
      toast.error('Failed to load reports');
    }
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         bill.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || new Date(bill.date).toISOString().split('T')[0] === dateFilter;
    return matchesSearch && matchesDate;
  });

  const totalRevenue = filteredBills.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 max-w-[1400px]">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-none mb-3">Sales Intelligence</h1>
          <p className="text-slate-500 font-medium">Detailed reports and financial performance</p>
        </div>
        <div className="flex gap-4">
           <div className="glass-card bg-white px-8 py-5 border-l-8 border-apsara-pink">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Period Revenue</p>
              <h2 className="text-3xl font-black text-slate-900">₹{totalRevenue}</h2>
           </div>
           <div className="glass-card bg-white px-8 py-5 border-l-8 border-apsara-purple">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Invoices Count</p>
              <h2 className="text-3xl font-black text-slate-900">{filteredBills.length}</h2>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input className="input-field pl-16 py-4" placeholder="Search by customer name or bill number..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="relative">
          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input type="date" className="input-field pl-16 py-4 cursor-pointer" value={dateFilter} onChange={e => setDateFilter(e.target.value)} />
        </div>
        <button onClick={() => { setSearchTerm(''); setDateFilter(''); }} className="btn-secondary px-8 py-4">Reset</button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-slate-500 text-xs uppercase tracking-widest">
            <tr>
              <th className="px-10 py-6">Bill Details</th>
              <th className="px-10 py-6">Customer Info</th>
              <th className="px-10 py-6 text-center">Date</th>
              <th className="px-10 py-6 text-right font-black">Total Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filteredBills.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-20 text-slate-400 italic">No matching reports found.</td></tr>
            ) : filteredBills.map(bill => (
              <tr key={bill._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-10 py-6">
                   <p className="font-black text-apsara-purple text-sm">{bill.billNumber}</p>
                   <p className="text-xs text-slate-400">{bill.items.length} items sold</p>
                </td>
                <td className="px-10 py-6">
                   <p className="font-bold text-slate-900">{bill.customerName}</p>
                   <p className="text-xs text-slate-400 font-bold tracking-widest">{bill.customerMobile}</p>
                </td>
                <td className="px-10 py-6 text-center text-sm font-bold text-slate-500">
                   <div className="flex flex-col">
                      <span>{new Date(bill.date).toLocaleDateString()}</span>
                      <span className="text-[10px] uppercase opacity-50 tracking-widest">{new Date(bill.date).toLocaleTimeString()}</span>
                   </div>
                </td>
                <td className="px-10 py-6 text-right">
                   <div className="flex flex-col items-end">
                      <span className="text-2xl font-black text-slate-900 leading-none mb-1">₹{bill.totalAmount}</span>
                      <span className="bg-green-100 text-green-700 font-black px-2 py-1 rounded-md text-[8px] uppercase tracking-widest">Full Paid ✓</span>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Reports;
