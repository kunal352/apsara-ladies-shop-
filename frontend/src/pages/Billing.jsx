import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X, CreditCard, Receipt, User, Phone, ShoppingCart, Trash2, Printer, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const API_URL = 'http://localhost:5000/api';

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({ name: '', mobile: '' });
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBill, setShowBill] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load products');
    }
  };

  const addItem = (product) => {
    if (product.stock <= 0) return toast.error('Out of stock!');
    setSelectedItems(prev => {
      const existing = prev.find(item => item.productId === product._id);
      if (existing) {
        if (existing.qty + 1 > product.stock) {
           toast.error('Not enough stock!');
           return prev;
        }
        return prev.map(item => item.productId === product._id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { productId: product._id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.productId === id) {
        const newQty = Math.max(1, item.qty + delta);
        const p = products.find(p => p._id === id);
        if (newQty > p.stock) {
          toast.error('Limit reached');
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id) => setSelectedItems(prev => prev.filter(item => item.productId !== id));

  const totalAmount = selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handleCheckout = async () => {
    if (!customer.name || !customer.mobile || selectedItems.length === 0) {
      return toast.error('Check customer details and items!');
    }
    try {
      const payload = {
        customerName: customer.name,
        customerMobile: customer.mobile,
        items: selectedItems,
        totalAmount
      };
      const { data } = await axios.post(`${API_URL}/billing`, payload);
      setShowBill(data.bill);
      setSelectedItems([]);
      setCustomer({ name: '', mobile: '' });
      fetchProducts(); // Refresh stock
      toast.success('Sale recorded successfully!');
    } catch (err) {
      toast.error('Error during checkout');
    }
  };

  const generatePDF = (bill) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(190, 24, 93); // Pink
    doc.text('Apsara Ladies Shop', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Premium Ladies Boutique & Designer Wear', 105, 28, { align: 'center' });
    doc.line(10, 35, 200, 35);

    // Customer Info
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Bill No: ${bill.billNumber}`, 10, 45);
    doc.text(`Date: ${new Date(bill.date).toLocaleDateString()}`, 10, 52);
    doc.text(`Customer: ${bill.customerName}`, 140, 45);
    doc.text(`Mobile: ${bill.customerMobile}`, 140, 52);

    // Table
    const tableData = bill.items.map(item => [item.name, `Rs.${item.price}`, item.qty, `Rs.${item.price * item.qty}`]);
    doc.autoTable({
      startY: 65,
      head: [['Product Name', 'Rate', 'Qty', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [109, 40, 217] }, // Purple
    });

    // Final Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`GRAND TOTAL: Rs.${bill.totalAmount}/-`, 140, finalY);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text('Visit again! Terms & Conditions Apply.', 105, finalY + 20, { align: 'center' });

    doc.save(`Invoice_${bill.billNumber}.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 max-w-[1400px]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-none">Billing Center</h1>
          <p className="text-slate-500 font-medium">Create and manage your shop invoices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        
        {/* Left Column: Product Selection */}
        <div className="xl:col-span-2 space-y-8">
          <div className="glass-card p-10">
             <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-2 underline decoration-apsara-pink/30 decoration-4 underline-offset-8 leading-none mt-2">
                   <ShoppingBag size={24} className="text-apsara-pink mb-2" /> Select Items
                </h2>
                <div className="text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl">
                  {products.length} Products Available
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                  <button 
                    key={p._id} 
                    onClick={() => addItem(p)}
                    disabled={p.stock <= 0}
                    className={`p-6 rounded-3xl border text-left transition-all ${p.stock <= 0 ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' : 'bg-white border-slate-100 hover:border-apsara-pink hover:bg-apsara-light shadow-sm hover:shadow-xl'}`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-apsara-pink font-bold">👗</div>
                      <div>
                        <h4 className="font-bold text-slate-900 leading-none">{p.name}</h4>
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{p.category}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xl font-black text-slate-900">₹{p.price}</span>
                      <span className={`text-xs font-bold ${p.stock < 5 ? 'text-red-500' : 'text-slate-400'}`}>{p.stock} left</span>
                    </div>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Bill Details */}
        <div className="space-y-8 relative">
          <div className="glass-card p-8 sticky top-12 border-t-8 border-apsara-purple">
            <h2 className="text-2xl font-black text-slate-950 mb-8 flex items-center gap-2">
               <Receipt className="text-apsara-purple" /> Bill Summary
            </h2>

            <div className="space-y-6">
               <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input className="input-field pl-12" placeholder="Customer Name" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input className="input-field pl-12" placeholder="Mobile Number" value={customer.mobile} onChange={e => setCustomer({...customer, mobile: e.target.value})} />
                  </div>
               </div>

               <hr className="border-slate-100" />

               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedItems.length === 0 && (
                    <div className="text-center py-10 text-slate-400 italic">No items added to bill</div>
                  )}
                  {selectedItems.map(item => (
                    <div key={item.productId} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl group">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        <p className="text-xs font-bold text-apsara-pink">₹{item.price} each</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                         <button onClick={() => updateQty(item.productId, -1)} className="text-slate-400 hover:text-apsara-pink transition-colors"><Minus size={14} /></button>
                         <span className="text-sm font-black w-4 text-center">{item.qty}</span>
                         <button onClick={() => updateQty(item.productId, 1)} className="text-slate-400 hover:text-apsara-pink transition-colors"><Plus size={14} /></button>
                      </div>
                      <button onClick={() => removeItem(item.productId)} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                    </div>
                  ))}
               </div>

               <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-4 shadow-2xl shadow-slate-200">
                  <div className="flex justify-between items-center opacity-60 text-xs font-bold tracking-widest uppercase">
                    <span>Tax (GST 0%)</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold">Total Payable</span>
                    <span className="text-4xl font-extrabold text-apsara-pink">₹{totalAmount}</span>
                  </div>
                  <button 
                    disabled={selectedItems.length === 0}
                    onClick={handleCheckout}
                    className="w-full bg-apsara-pink text-white py-5 rounded-2xl font-black text-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-lg mt-4 flex items-center justify-center gap-3 shadow-pink-900/10 border-b-4 border-pink-900/20"
                  >
                    <CreditCard size={24} /> Final Checkout
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Receipt Modal */}
      <AnimatePresence>
        {showBill && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-8">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden shadow-apsara-pink/10">
               <div className="bg-apsara-pink p-12 text-center text-white relative">
                  <button onClick={() => setShowBill(null)} className="absolute top-8 right-8 text-white/50 hover:text-white"><X /></button>
                  <div className="bg-white/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/20">
                    <CheckCircle size={48} />
                  </div>
                  <h2 className="text-4xl font-black mb-2">Success!</h2>
                  <p className="font-bold border-t border-white/20 pt-4 mt-2 inline-block">Order {showBill.billNumber}</p>
               </div>
               
               <div className="p-12 space-y-8">
                  <div className="flex justify-between text-center pb-8 border-b border-slate-100">
                     <div className="flex-1 border-r border-slate-100 px-4">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Customer</p>
                        <p className="font-bold text-slate-800">{showBill.customerName}</p>
                     </div>
                     <div className="flex-1 px-4">
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Total</p>
                        <p className="text-2xl font-black text-apsara-pink">₹{showBill.totalAmount}</p>
                     </div>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => generatePDF(showBill)} className="flex-1 btn-primary py-4 flex items-center justify-center gap-3 active:scale-95">
                      <Receipt size={20} /> Download PDF
                    </button>
                    <button onClick={() => window.print()} className="px-6 border border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                       <Printer size={20} /> Print
                    </button>
                  </div>

                  <button onClick={() => setShowBill(null)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-all mt-4 border-2 border-slate-50 rounded-2xl uppercase tracking-tighter text-sm">
                    Back to Counter
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
