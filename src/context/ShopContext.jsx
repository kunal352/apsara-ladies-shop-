import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

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

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('apsara_products');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Cotton Silk Saree', price: 1250, category: 'Saree', stock: 15, sold: 0 },
      { id: 2, name: 'Designer Anarkali', price: 850, category: 'Dress', stock: 10, sold: 0 },
      { id: 3, name: 'Embroidered Kurti', price: 450, category: 'Kurti', stock: 20, sold: 0 }
    ];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('apsara_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('apsara_details', JSON.stringify(shopDetails));
  }, [shopDetails]);

  useEffect(() => {
    localStorage.setItem('apsara_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('apsara_orders', JSON.stringify(orders));
  }, [orders]);

  const addProduct = (product) => setProducts(prev => [...prev, { ...product, id: Date.now(), sold: 0 }]);
  const removeProduct = (id) => setProducts(prev => prev.filter(p => p.id !== id));
  const updateProduct = (id, updated) => setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  
  const [lang, setLang] = useState('en');

  const translations = {
    en: {
      dashboard: "Dashboard", billing: "New Bill", inventory: "Inventory", reports: "Reports",
      totalRevenue: "Total Revenue", stockGela: "Total Sold (Stock Gela)", stockShilak: "In Stock (Shilak)", varieties: "Total Varieties",
      collection: "Collection", search: "Search items...", customerName: "Customer Name", mobile: "Mobile Number", completeSale: "Complete Sale",
      remainingStock: "In Stock", addProduct: "Add New Item", price: "Price", category: "Category",
      success: "Sale Completed!", error: "Check details!", shilak: "pcs In Stock", gela: "pcs Sold"
    },
    mr: {
      dashboard: "डॅशबोर्ड", billing: "नवीन बिल", inventory: "इन्व्हेंटरी", reports: "रिपोर्ट्स",
      totalRevenue: "एकूण कमाई", stockGela: "विकलेला स्टॉक (गेला)", stockShilak: "शिल्लक स्टॉक", varieties: "एकूण प्रकार",
      collection: "कलेक्शन", search: "वस्तू शोधा...", customerName: "ग्राहकाचे नाव", mobile: "मोबाईल नंबर", completeSale: "विक्री पूर्ण करा",
      remainingStock: "शिल्लक", addProduct: "नवीन वस्तू जोडा", price: "किंमत", category: "कॅटेगरी",
      success: "विक्री पूर्ण झाली!", error: "माहिती तपासा!", shilak: "पीस शिल्लक", gela: "पीस विक्री"
    },
    hi: {
      dashboard: "डैशबोर्ड", billing: "नया बिल", inventory: "इन्वेंट्री", reports: "रिपोर्ट्स",
      totalRevenue: "कुल कमाई", stockGela: "बिका हुआ स्टॉक (गया)", stockShilak: "बचा हुआ स्टॉक", varieties: "कुल प्रकार",
      collection: "कलेक्शन", search: "सामान खोजें...", customerName: "ग्राहक का नाम", mobile: "मोबाइल नंबर", completeSale: "बिक्री पूरी करें",
      remainingStock: "बचा हुआ", addProduct: "नया सामान जोड़ें", price: "कीमत", category: "श्रेणी",
      success: "बिक्री पूरी हुई!", error: "जानकारी जांचें!", shilak: "पीस बचा है", gela: "पीस बिका"
    }
  };

  const t = translations[lang];

  const completeBill = (billData) => {
    const newBill = {
      ...billData,
      id: `INV-${Date.now()}`,
      date: new Date().toISOString()
    };

    setOrders(prev => [newBill, ...prev]);
    setProducts(prev => prev.map(p => {
      const billItem = billData.items.find(item => item.id === p.id);
      if (billItem) {
        return { ...p, stock: p.stock - billItem.qty, sold: p.sold + billItem.qty };
      }
      return p;
    }));
    return newBill;
  };

  return (
    <ShopContext.Provider value={{ 
      shopDetails, 
      products, 
      addProduct, 
      removeProduct,
      updateProduct,
      orders,
      completeBill,
      lang,
      setLang,
      t
    }}>
      {children}
    </ShopContext.Provider>
  );
};
