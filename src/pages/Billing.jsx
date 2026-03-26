import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Receipt, User, Phone, ShoppingCart, Trash2, Plus, Minus, CreditCard, Sparkles, X, CheckCircle, Printer, Download, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Billing = () => {
  const { products, completeBill, shopDetails, t, lang, setLang, activeTheme } = useShop();
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
           toast.error('Not enough stock available!');
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
      return toast.error('Please check customer details and items!');
    }
    const bill = completeBill({ 
      customerName: customer.name, 
      customerMobile: customer.mobile, 
      items: selectedItems, 
      total: Number(totalAmount) 
    });
    setShowInvoice(bill);
    setSelectedItems([]);
    setCustomer({ name: '', mobile: '' });
    setIsManual(false);
    toast.success(t.success);
  };

  const generatePDF = (bill) => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    // Setting manual color based on theme
    const rgb = activeTheme.primary.includes('pink') ? [190, 24, 93] : activeTheme.primary.includes('blue') ? [37, 99, 235] : activeTheme.primary.includes('purple') ? [147, 51, 234] : [5, 150, 105];
    doc.setTextColor(rgb[0], rgb[1], rgb[2]);
    doc.text(shopDetails.name, 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(shopDetails.tagline, 105, 28, { align: 'center' });
    doc.line(10, 35, 200, 35);

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Bill No: ${bill.id.slice(-6)}`, 10, 45);
    doc.text(`Date: ${new Date(bill.date).toLocaleDateString()}`, 10, 52);
    doc.text(`Customer: ${bill.customerName}`, 140, 45);
    doc.text(`Mobile: ${bill.customerMobile}`, 140, 52);

    const tableData = bill.items.map(item => [item.name, `Rs.${item.price}`, item.qty, `Rs.${item.price * item.qty}`]);
    doc.autoTable({
      startY: 65,
      head: [['Product Name', 'Rate', 'Qty', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: rgb },
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text(`GRAND TOTAL: Rs.${bill.total}/-`, 140, finalY);

    doc.setFontSize(10);
    doc.text(`${t.thankYou} - ${shopDetails.name}`, 105, finalY + 25, { align: 'center' });
    doc.save(`Shop_Bill_${bill.id.slice(-6)}.pdf`);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 max-w-[1400px]">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm no-print">
        <div>
          <h1 className="text-4xl font-black text-slate-900 leading-none mb-2">{t.billing}</h1>
          <p className={`font-bold uppercase tracking-widest text-[10px] text-${activeTheme.primary}`}>{shopDetails.name} - {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 no-print">
        {/* Left: Product Selector */}
        <div className="xl:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm min-h-[600px]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <h2 className="text-2xl font-black text-slate-950 flex items-center gap-3 leading-none">
                   <Sparkles className={`text-${activeTheme.primary}`} /> {t.collection}
                </h2>
                <div className="relative w-full md:w-80">
                   <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                   <input 
                    className={`w-full pl-16 py-5 rounded-2xl bg-slate-50 border-none outline-none font-bold text-slate-900 focus:ring-4 focus:ring-${activeTheme.secondary} text-lg shadow-inner`}
                    placeholder={t.search} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {filteredProducts.map(p => (
                   <button 
                     key={p.id} 
                     onClick={() => addItem(p)}
                     disabled={p.stock <= 0}
                     className={`p-4 rounded-[24px] border text-left transition-all ${p.stock <= 0 ? 'bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed' : `bg-white border-slate-100 hover:border-${activeTheme.primary} hover:bg-${activeTheme.secondary}/20 shadow-sm hover:shadow-xl`}`}
                   >
                     <div className="flex items-center gap-3 mb-3">
                       <span className="text-2xl">🛍️</span>
                       <div>
                         <h4 className="font-black text-slate-900 leading-tight text-sm uppercase">{p.name}</h4>
                         <p className="text-[9px] font-black tracking-widest text-slate-400 uppercase">{p.category}</p>
                       </div>
                     </div>
                     <div className="flex justify-between items-center mt-1">
                       <span className="text-xl font-black text-slate-900 leading-none">₹{p.price}</span>
                       <span className={`text-[9px] font-black uppercase ${p.stock < 5 ? 'text-red-500 font-black' : 'text-slate-400'}`}>{p.stock} {t.shilak}</span>
                     </div>
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Right: Cart/Sidebar */}
        <div className="space-y-6 relative">
           <div className={`bg-white p-6 rounded-[32px] border-t-8 border-${activeTheme.primary} shadow-xl shadow-slate-900/5 sticky top-8`}>
              <h2 className={`text-xl font-black text-slate-950 mb-6 flex items-center gap-2 underline decoration-${activeTheme.primary}/20 decoration-8 underline-offset-4 mt-2`}>
                 <Receipt className={`text-${activeTheme.primary}`} size={20} /> {t.billing}
              </h2>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <div className="relative">
                       <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none font-bold text-slate-900 text-sm focus:ring-2 focus:ring-${activeTheme.secondary} transition-all uppercase`}
                        placeholder={t.customerName} 
                        value={customer.name} 
                        onChange={e => {
                          const val = e.target.value.replace(/[^A-Za-z ]/g, '');
                          setCustomer({...customer, name: val});
                        }} 
                       />
                    </div>
                    <div className="relative">
                       <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                       <input 
                        type="tel"
                        maxLength="10"
                        className={`w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border-none outline-none font-bold text-slate-900 text-sm focus:ring-2 focus:ring-${activeTheme.secondary} transition-all font-mono tracking-wider`}
                        placeholder={t.mobile} 
                        value={customer.mobile} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 10) setCustomer({...customer, mobile: val});
                        }} 
                       />
                    </div>
                 </div>

                 <hr className="border-slate-50" />

                 <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {selectedItems.map(item => (
                      <div key={item.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl group transition-all hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100">
                         <div className="flex-1">
                            <p className="font-black text-slate-900 text-[11px] leading-tight mb-1 uppercase">{item.name}</p>
                            <p className={`font-bold text-${activeTheme.primary} text-[10px]`}>₹{item.price} x {item.qty}</p>
                         </div>
                         <div className="flex items-center gap-2">
                            <button onClick={() => removeItem(item.id)} className="p-1.5 bg-white text-slate-300 hover:text-red-500 rounded-lg transition-all shadow-sm"><Trash2 size={14} /></button>
                         </div>
                      </div>
                    ))}
                    {selectedItems.length === 0 && <p className="text-center py-10 text-slate-400 italic text-xs">No items selected.</p>}
                 </div>

                 <div className="bg-slate-950 text-white rounded-[24px] p-6 space-y-4 shadow-2xl shadow-slate-200">
                    <div className="flex justify-between items-end">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest mb-1">Total Payable</span>
                          <button 
                            onClick={() => { setIsManual(!isManual); if(!isManual) setManualAmount(totalAmount); }}
                            className={`text-[9px] font-black text-${activeTheme.primary} uppercase tracking-tighter hover:underline`}
                          >
                            {isManual ? 'Auto Total' : 'Edit Manual'}
                          </button>
                       </div>
                       {isManual ? (
                         <div className={`flex items-center gap-2 border-b-2 border-${activeTheme.primary} pb-1`}>
                            <span className={`text-lg font-black text-${activeTheme.primary}`}>₹</span>
                            <input 
                              type="number" 
                              autoFocus
                              className={`bg-transparent text-3xl font-black text-${activeTheme.primary} outline-none w-20`}
                              value={manualAmount} 
                              onChange={(e) => setManualAmount(e.target.value)} 
                            />
                         </div>
                       ) : (
                         <span className={`text-4xl font-black text-${activeTheme.primary} leading-none`}>₹{totalAmount}</span>
                       )}
                    </div>
                    <button 
                      onClick={handleCheckout}
                      disabled={selectedItems.length === 0}
                      className={`w-full bg-${activeTheme.primary} text-white py-4 rounded-xl font-black text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-40 shadow-xl shadow-${activeTheme.primary}/20`}
                    >
                      <CreditCard size={20} /> {t.completeSale}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showInvoice && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl z-[200] flex items-center justify-center p-8 active">
             {/* Hidden Print Content */}
             <div id="printable-invoice" className="hidden print:block text-slate-900 w-[80mm] max-w-full mx-auto p-4">
                <div className="text-center mb-6 border-b-2 pb-4">
                   <h1 className="text-xl font-black uppercase tracking-widest text-pink-600 leading-none">{shopDetails.name}</h1>
                   <p className="italic text-[10px] text-slate-400 font-bold tracking-widest mt-1">{shopDetails.tagline}</p>
                </div>
                
                <div className="flex justify-between mb-4 text-[10px]">
                   <div className="flex-1">
                      <p><b>Bill No:</b> {showInvoice.id.slice(-6)}</p>
                      <p><b>Date:</b> {new Date(showInvoice.date).toLocaleDateString()}</p>
                   </div>
                   <div className="text-right flex-1">
                      <p><b>Cust:</b> {showInvoice.customerName}</p>
                      <p><b>Mob:</b> {showInvoice.customerMobile}</p>
                   </div>
                </div>

                <table className="w-full border-collapse mb-4 text-[10px]">
                   <thead className="border-b-2 border-slate-900 text-left">
                      <tr>
                        <th className="py-1">Item</th>
                        <th className="py-1 text-center">Qty</th>
                        <th className="py-1 text-right">Amt</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y border-b-2 border-slate-900">
                      {showInvoice.items.map(i => (
                        <tr key={i.id} className="py-1">
                           <td className="py-2 font-bold leading-tight uppercase">{i.name}</td>
                           <td className="py-2 text-center">{i.qty}</td>
                           <td className="py-2 text-right font-bold">₹{i.price * i.qty}</td>
                        </tr>
                      ))}
                   </tbody>
                </table>

                <div className="flex justify-end mt-4">
                   <div className="text-right">
                      <p className="text-[10px] uppercase font-black text-slate-400 leading-none">Grand Total</p>
                      <p className="text-xl font-black">₹{showInvoice.total}/-</p>
                   </div>
                </div>

                <div className="mt-8 border-t-2 pt-2 text-center">
                   <p className="font-bold text-slate-400 italic text-[10px] tracking-wide">{t.thankYou}</p>
                </div>
             </div>

             {/* On-Screen Success Modal */}
             <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl relative no-print">
                <div className={`bg-${activeTheme.primary} p-12 text-center text-white relative`}>
                   <button onClick={() => setShowInvoice(null)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><X/></button>
                   <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/40 shadow-xl">
                     <CheckCircle size={40} />
                   </div>
                   <h2 className="text-4xl font-black mb-1 leading-none mt-2">{t.saleComplete}</h2>
                   <p className="text-[10px] uppercase font-black tracking-widest border-t border-white/20 pt-4 mt-2">{t.invoiceGenerated}</p>
                </div>
                
                <div className="p-12 space-y-8">
                   <div className="flex justify-between pb-8 border-b border-slate-50 text-center">
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t.customerName}</p><p className="font-bold text-slate-950 uppercase">{showInvoice.customerName}</p></div>
                      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p><p className={`text-2xl font-black text-${activeTheme.primary} leading-none underline decoration-4 decoration-pink-600/10`}>₹{showInvoice.total}</p></div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => window.print()} className="flex items-center justify-center gap-2 bg-slate-900 text-white py-5 rounded-2xl font-black hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-slate-200">
                         <Printer size={20} /> {t.printBill}
                      </button>
                      <button onClick={() => generatePDF(showInvoice)} className={`flex items-center justify-center gap-2 bg-${activeTheme.primary} text-white py-5 rounded-2xl font-black hover:opacity-90 transition-all active:scale-95 shadow-xl shadow-slate-200`}>
                         <Download size={20} /> {t.pdfDownload}
                      </button>
                   </div>

                   <button onClick={() => setShowInvoice(null)} className={`w-full text-center py-4 text-${activeTheme.primary} font-black hover:opacity-80 transition-all mt-4 uppercase tracking-[0.2em] text-[10px] bg-slate-50 rounded-xl`}>
                      {t.continueSale}
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
