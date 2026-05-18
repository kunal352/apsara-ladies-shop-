import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ShopContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || '/api';

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used within a ShopProvider');
  return context;
};

export const ShopProvider = ({ children }) => {
  const [shopDetails, setShopDetails] = useState(() => {
    const saved = localStorage.getItem('apsara_details');
    return saved ? JSON.parse(saved) : {
      name: 'Apsara General Store',
      tagline: 'Premium Boutique & General Collection',
      theme: 'pink'
    };
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Sync state with online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initial Data Load (Hybrid: Try API then Fallback to Local)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Step 1: Pre-populate from Local Storage instantly for zero-latency startup
        const localProds = JSON.parse(localStorage.getItem('apsara_products_backup') || '[]');
        const localOrders = JSON.parse(localStorage.getItem('apsara_orders_backup') || '[]');
        setProducts(localProds);
        setOrders(localOrders);

        const [prodRes, billRes] = await Promise.all([
          fetch(`${API_URL}/products`).catch(() => null),
          fetch(`${API_URL}/bills`).catch(() => null)
        ]);
        
        if (prodRes && prodRes.ok && billRes && billRes.ok) {
          const prodData = await prodRes.json();
          const billData = await billRes.json();
          let mappedProds = prodData.map(p => ({ ...p, id: p._id }));
          let mappedOrders = billData.map(b => ({ ...b, id: b._id, total: b.totalAmount }));
          
          // Step 2: Auto-sync any products added offline (numeric temporary IDs)
          const unsyncedProds = localProds.filter(lp => typeof lp.id === 'number');
          for (const up of unsyncedProds) {
            try {
              const { id, ...prodToSave } = up;
              const res = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prodToSave)
              });
              if (res.ok) {
                const saved = await res.json();
                mappedProds.push({ ...saved, id: saved._id });
              }
            } catch (err) {
              console.error('Failed to sync offline product:', err);
            }
          }

          // Step 3: Auto-sync any invoices settled offline (IDs starting with BILL-)
          const unsyncedOrders = localOrders.filter(lo => String(lo.id).startsWith('BILL-'));
          for (const uo of unsyncedOrders) {
            try {
              const res = await fetch(`${API_URL}/billing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  customerName: uo.customerName,
                  customerMobile: uo.customerMobile,
                  items: uo.items.map(i => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty })),
                  totalAmount: uo.total
                })
              });
              if (res.ok) {
                const data = await res.json();
                mappedOrders.push({ ...data.bill, id: data.bill._id, total: data.bill.totalAmount });
              }
            } catch (err) {
              console.error('Failed to sync offline order:', err);
            }
          }

          // Step 4: Populate blank backend database with local backups to prevent empty overwrite
          if (mappedProds.length === 0 && localProds.length > 0) {
            for (const lp of localProds) {
              try {
                const { id, ...prodToSave } = lp;
                const res = await fetch(`${API_URL}/products`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(prodToSave)
                });
                if (res.ok) {
                  const saved = await res.json();
                  mappedProds.push({ ...saved, id: saved._id });
                }
              } catch (err) {
                console.error('Failed to sync local data backup to empty server:', err);
              }
            }
          }

          // Step 5: Save final unified, synced data
          setProducts(mappedProds);
          setOrders(mappedOrders);
          localStorage.setItem('apsara_products_backup', JSON.stringify(mappedProds));
          localStorage.setItem('apsara_orders_backup', JSON.stringify(mappedOrders));
        } else {
          throw new Error('Server unreachable');
        }
      } catch (err) {
        console.warn('Backend connection failed, using local storage backups.');
        const fallbackProds = JSON.parse(localStorage.getItem('apsara_products_backup') || '[]');
        const fallbackOrders = JSON.parse(localStorage.getItem('apsara_orders_backup') || '[]');
        setProducts(fallbackProds);
        setOrders(fallbackOrders);
        if (!isOffline) toast('Using local mode (Offline)', { icon: '📴' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOffline]);

  const addProduct = async (product) => {
    const localId = Date.now();
    const optimisticProduct = { ...product, id: localId, sold: 0 };
    
    setProducts(prev => {
      const updated = [optimisticProduct, ...prev];
      localStorage.setItem('apsara_products_backup', JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const saved = await res.json();
        setProducts(prev => {
           const updated = prev.map(p => p.id === localId ? { ...saved, id: saved._id } : p);
           localStorage.setItem('apsara_products_backup', JSON.stringify(updated));
           return updated;
        });
        toast.success('Synced to Cloud!');
      }
    } catch (err) {
      toast('Saved locally (Offline)', { icon: '📂' });
    }
  };

  const removeProduct = async (id) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('apsara_products_backup', JSON.stringify(updated));
      return updated;
    });
    try {
      await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
    } catch (err) {
      toast('Removed locally', { icon: '🗑️' });
    }
  };

  const updateProduct = async (id, updated) => {
    setProducts(prev => {
      const newProds = prev.map(p => p.id === id ? { ...p, ...updated } : p);
      localStorage.setItem('apsara_products_backup', JSON.stringify(newProds));
      return newProds;
    });
    try {
      await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (err) {
      console.warn('Update only applied locally');
    }
  };

  const completeBill = async (billData) => {
    const localBillId = `BILL-${Date.now()}`;
    const optimisticBill = { 
       ...billData, 
       id: localBillId, 
       total: billData.total,
       date: new Date().toISOString()
    };

    setOrders(prev => {
      const updated = [optimisticBill, ...prev];
      localStorage.setItem('apsara_orders_backup', JSON.stringify(updated));
      return updated;
    });

    setProducts(prev => {
      const updated = prev.map(p => {
        const billItem = billData.items.find(item => item.id === p.id);
        if (billItem) {
          return { ...p, stock: p.stock - billItem.qty, sold: p.sold + billItem.qty };
        }
        return p;
      });
      localStorage.setItem('apsara_products_backup', JSON.stringify(updated));
      return updated;
    });

    try {
      const res = await fetch(`${API_URL}/billing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: billData.customerName,
          customerMobile: billData.customerMobile,
          items: billData.items.map(i => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty })),
          totalAmount: billData.total
        })
      });
      if (res.ok) {
        const data = await res.json();
        const savedBill = { ...data.bill, id: data.bill._id, total: data.bill.totalAmount };
        setOrders(prev => {
           const updated = prev.map(o => o.id === localBillId ? savedBill : o);
           localStorage.setItem('apsara_orders_backup', JSON.stringify(updated));
           return updated;
        });
        toast.success('Bill synced to Cloud!');
        return savedBill;
      }
    } catch (err) {
      toast('Bill saved locally (Offline)', { icon: '📄' });
    }
    return optimisticBill;
  };
  
  const [lang, setLang] = useState(() => localStorage.getItem('apsara_lang') || 'mr');
  const [theme, setTheme] = useState(() => localStorage.getItem('apsara_theme') || 'pink');

  useEffect(() => {
    localStorage.setItem('apsara_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('apsara_theme', theme);
  }, [theme]);

  const themes = {
    pink: { hex: '#831843', secondaryHex: '#fff1f2', primary: 'pink-900', secondary: 'pink-50', text: 'text-pink-900', bg: 'bg-pink-900', hover: 'hover:bg-pink-950' },
    blue: { hex: '#1e3a8a', secondaryHex: '#eff6ff', primary: 'blue-900', secondary: 'blue-50', text: 'text-blue-900', bg: 'bg-blue-900', hover: 'hover:bg-blue-950' },
    purple: { hex: '#581c87', secondaryHex: '#f5f3ff', primary: 'purple-900', secondary: 'purple-50', text: 'text-purple-900', bg: 'bg-purple-900', hover: 'hover:bg-purple-950' },
    emerald: { hex: '#064e3b', secondaryHex: '#ecfdf5', primary: 'emerald-950', secondary: 'emerald-50', text: 'text-emerald-950', bg: 'bg-emerald-950', hover: 'hover:bg-emerald-900' },
    dark: { hex: '#0f172a', secondaryHex: '#f1f5f9', primary: 'slate-900', secondary: 'slate-400', text: 'text-slate-900', bg: 'bg-slate-900', hover: 'hover:bg-slate-950' }
  };

  const translations = {
    en: {
      mainMenu: "Main Menu", personalize: "Personalize", language: "Language", settings: "Settings",
      offlineMode: "Using local mode (Offline)", onlineMode: "Connected (Cloud)",
      dashboard: "Dashboard", billing: "New Bill", inventory: 'Inventory', reports: 'Reports',
      searchProducts: 'Search Products...',
      totalRevenue: "Total Revenue", stockGela: "Total Sold", stockShilak: "In Stock", varieties: "Total Varieties", stockValue: "Stock Value",
      collection: "Collection", search: "Search items...", customerName: "Customer Name", mobile: "Mobile Number", completeSale: "Complete Sale",
      remainingStock: "In Stock", addProduct: "Add New Item", price: "Price", category: "Category",
      inventoryAlert: "Inventory Alert!", lowStockDesc: "products are running low on stock. Please restock soon.",
      recentSales: "Recent Sales Activity", criticalStock: "Critical Stock Items", unitsLeft: "Units Left",
      noSales: "No sales activity yet.", healthyStock: "Stock levels are healthy! ✓",
      printBill: "Print Bill", pdfDownload: "PDF Download", saleComplete: "Sale Complete!", invoiceGenerated: "Invoice Generated Successfully",
      continueSale: "Continue to Next Sale", thankYou: "Thank you! Visit again.",
      success: "Sale Completed!", error: "Check details!", shilak: "pcs In Stock", gela: "pcs Sold",
      productDetails: "Product Details", unitPrice: "Unit Price", quantity: "Quantity",
      totalStatus: "Total Status", actions: "Actions", totalItems: "Total Items",
      categories: "Categories", netWorth: "Net Worth", lowStock: "Critical Stock"
    },
    mr: {
      mainMenu: "मुख्य मेनू", personalize: "थीम बदला", language: "भाषा निवडा", settings: "सेटिंग्ज",
      offlineMode: "ऑफलाइन मोड (पीसीवर सेव्ह होत आहे)", onlineMode: "ऑनलाइन (क्लाउड बॅकअप चालू)",
      dashboard: "डॅशबोर्ड", billing: "नवीन बिल", inventory: "इन्व्हेंटरी", reports: "रिपोर्ट्स",
      searchProducts: 'वस्तू शोधा...',
      totalRevenue: "एकूण कमाई", stockGela: "विकलेला स्टॉक (गेला)", stockShilak: "शिल्लक स्टॉक", varieties: "एकूण प्रकार", stockValue: "एकूण स्टॉक किंमत",
      collection: "कलेक्शन", search: "वस्तू शोधा...", customerName: "ग्राहकाचे नाव", mobile: "मोबाईल नंबर", completeSale: "विक्री पूर्ण करा",
      remainingStock: "शिल्लक", addProduct: "नवीन वस्तू जोडा", price: "किंमत", category: "कॅटेगरी",
      inventoryAlert: "स्टॉक अलर्ट!", lowStockDesc: "वस्तूंचा स्टॉक कमी होत आहे. कृपया नवीन साठा भरा.",
      recentSales: "अलीकडील विक्री माहिती", criticalStock: "कमी झालेला स्टॉक", unitsLeft: "शिल्लक नग",
      noSales: "अद्याप कोणतीही विक्री नाही.", healthyStock: "स्टॉकची स्थिती चांगली आहे! ✓",
      printBill: "बिल प्रिंट करा", pdfDownload: "PDF डाऊनलोड", saleComplete: "विक्री यशस्वी!", invoiceGenerated: "पावती तयार झाली आहे",
      continueSale: "पुढील बिल सुरू करा", thankYou: "धन्यवाद! पुन्हा भेट द्या.",
      success: "विक्री यशस्वी!", error: "माहिती तपासा!", shilak: "नग शिल्लक", gela: "नग विक्री",
      productDetails: "वस्तूची माहिती", unitPrice: "किंमत (प्रति नग)", quantity: "शिल्लक साठा",
      totalStatus: "एकूण विक्री", actions: "क्रिया", totalItems: "एकूण वस्तू",
      categories: "कॅटेगरी", netWorth: "एकूण स्टॉक किंमत", lowStock: "कमी स्टॉक"
    }
  };

  const t = translations[lang] || translations['mr'];
  const activeTheme = themes[theme];

  return (
    <ShopContext.Provider value={{ 
      products, orders, shopDetails, loading, isOffline,
      addProduct, removeProduct, updateProduct, completeBill,
      lang, setLang, t, 
      theme, setTheme, themes, activeTheme
    }}>
      {children}
    </ShopContext.Provider>
  );
};
