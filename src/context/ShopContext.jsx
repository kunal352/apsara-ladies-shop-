import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const ShopContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
        const [prodRes, billRes] = await Promise.all([
          fetch(`${API_URL}/products`).catch(() => null),
          fetch(`${API_URL}/bills`).catch(() => null)
        ]);
        
        if (prodRes && prodRes.ok && billRes && billRes.ok) {
          const prodData = await prodRes.json();
          const billData = await billRes.json();
          const mappedProds = prodData.map(p => ({ ...p, id: p._id }));
          const mappedOrders = billData.map(b => ({ ...b, id: b._id, total: b.totalAmount }));
          
          setProducts(mappedProds);
          setOrders(mappedOrders);
          
          // Backup to LocalStorage for offline use
          localStorage.setItem('apsara_products_backup', JSON.stringify(mappedProds));
          localStorage.setItem('apsara_orders_backup', JSON.stringify(mappedOrders));
        } else {
          throw new Error('Server unreachable');
        }
      } catch (err) {
        console.warn('Backend connection failed, using local storage.');
        const localProds = JSON.parse(localStorage.getItem('apsara_products_backup') || '[]');
        const localOrders = JSON.parse(localStorage.getItem('apsara_orders_backup') || '[]');
        setProducts(localProds);
        setOrders(localOrders);
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
    pink: { hex: '#be185d', secondaryHex: '#fdf2f8', primary: 'pink-600', secondary: 'pink-50', text: 'text-pink-600', bg: 'bg-pink-600', hover: 'hover:bg-pink-700' },
    blue: { hex: '#2563eb', secondaryHex: '#eff6ff', primary: 'blue-600', secondary: 'blue-50', text: 'text-blue-600', bg: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    purple: { hex: '#9333ea', secondaryHex: '#f5f3ff', primary: 'purple-600', secondary: 'purple-50', text: 'text-purple-600', bg: 'bg-purple-600', hover: 'hover:bg-purple-700' },
    emerald: { hex: '#059669', secondaryHex: '#ecfdf5', primary: 'emerald-600', secondary: 'emerald-50', text: 'text-emerald-600', bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  };

  const translations = {
    en: {
      mainMenu: "Main Menu", personalize: "Personalize", language: "Language",
      offlineMode: "Using local mode (Offline)", onlineMode: "Connected (Cloud)",
      dashboard: "Dashboard", billing: "New Bill", inventory: 'Inventory', reports: 'Reports',
      searchProducts: 'Search Products...',
      addProduct: 'Add Product',
      totalRevenue: "Total Revenue", stockGela: "Total Sold", stockShilak: "In Stock", varieties: "Total Varieties", stockValue: "Stock Value",
      collection: "Collection", search: "Search items...", customerName: "Customer Name", mobile: "Mobile Number", completeSale: "Complete Sale",
      remainingStock: "In Stock", addProduct: "Add New Item", price: "Price", category: "Category",
      inventoryAlert: "Inventory Alert!", lowStockDesc: "products are running low on stock. Please restock soon.",
      recentSales: "Recent Sales Activity", criticalStock: "Critical Stock Items", unitsLeft: "Units Left",
      noSales: "No sales activity yet.", healthyStock: "Stock levels are healthy! ✓",
      printBill: "Print Bill", pdfDownload: "PDF Download", saleComplete: "Sale Complete!", invoiceGenerated: "Invoice Generated Successfully",
      continueSale: "Continue to Next Sale", thankYou: "Thank you! Visit again.",
      success: "Sale Completed!", error: "Check details!", shilak: "pcs In Stock", gela: "pcs Sold"
    },
    mr: {
      mainMenu: "मुख्य मेनू", personalize: "थीम बदला", language: "भाषा निवडा",
      offlineMode: "ऑफलाइन मोड (पीसीवर सेव्ह होत आहे)", onlineMode: "ऑनलाइन (क्लाउड बॅकअप चालू)",
      dashboard: "डॅशबोर्ड", billing: "नवीन बिल", inventory: "इन्व्हेंटरी", reports: "रिपोर्ट्स",
      searchProducts: 'वस्तू शोधा...',
      addProduct: 'नवीन वस्तू जोडा',
      totalRevenue: "एकूण कमाई", stockGela: "विकलेला स्टॉक (गेला)", stockShilak: "शिल्लक स्टॉक", varieties: "एकूण प्रकार", stockValue: "एकूण स्टॉक किंमत",
      collection: "कलेक्शन", search: "वस्तू शोधा...", customerName: "ग्राहकाचे नाव", mobile: "मोबाईल नंबर", completeSale: "विक्री पूर्ण करा",
      remainingStock: "शिल्लक", addProduct: "नवीन वस्तू जोडा", price: "किंमत", category: "कॅटेगरी",
      inventoryAlert: "स्टॉक अलर्ट!", lowStockDesc: "वस्तूंचा स्टॉक कमी होत आहे. कृपया नवीन साठा भरा.",
      recentSales: "अलीकडील विक्री माहिती", criticalStock: "कमी झालेला स्टॉक", unitsLeft: "शिल्लक नग",
      noSales: "अद्याप कोणतीही विक्री नाही.", healthyStock: "स्टॉकची स्थिती चांगली आहे! ✓",
      printBill: "बिल प्रिंट करा", pdfDownload: "PDF डाऊनलोड", saleComplete: "विक्री यशस्वी!", invoiceGenerated: "पावती तयार झाली आहे",
      continueSale: "पुढील बिल सुरू करा", thankYou: "धन्यवाद! पुन्हा भेट द्या.",
      success: "विक्री यशस्वी!", error: "माहिती तपासा!", shilak: "नग शिल्लक", gela: "नग विक्री"
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
