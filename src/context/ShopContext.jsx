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
  
  const [lang, setLang] = useState('mr');
  const [theme, setTheme] = useState('pink');

  const themes = {
    pink: { hex: '#be185d', secondaryHex: '#fdf2f8', primary: 'pink-600', secondary: 'pink-50', text: 'text-pink-600', bg: 'bg-pink-600', hover: 'hover:bg-pink-700' },
    blue: { hex: '#2563eb', secondaryHex: '#eff6ff', primary: 'blue-600', secondary: 'blue-50', text: 'text-blue-600', bg: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    purple: { hex: '#9333ea', secondaryHex: '#f5f3ff', primary: 'purple-600', secondary: 'purple-50', text: 'text-purple-600', bg: 'bg-purple-600', hover: 'hover:bg-purple-700' },
    emerald: { hex: '#059669', secondaryHex: '#ecfdf5', primary: 'emerald-600', secondary: 'emerald-50', text: 'text-emerald-600', bg: 'bg-emerald-600', hover: 'hover:bg-emerald-700' },
  };

  const translations = {
    en: {
      dashboard: "Dashboard", billing: "New Bill", inventory: 'Inventory',
      searchProducts: 'Search Products...',
      addProduct: 'Add Product',
      totalRevenue: "Total Revenue", stockGela: "Total Sold (Stock Gela)", stockShilak: "In Stock (Shilak)", varieties: "Total Varieties",
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
      dashboard: "डॅशबोर्ड", billing: "नवीन बिल", inventory: "इन्व्हेंटरी",
      searchProducts: 'वस्तू शोधा...',
      addProduct: 'नवीन वस्तू जोडा',
      totalRevenue: "एकूण कमाई", stockGela: "विकलेला स्टॉक (गेला)", stockShilak: "शिल्लक स्टॉक", varieties: "एकूण प्रकार",
      collection: "कलेक्शन", search: "वस्तू शोधा...", customerName: "ग्राहकाचे नाव", mobile: "मोबाईल नंबर", completeSale: "विक्री पूर्ण करा",
      remainingStock: "शिल्लक", addProduct: "नवीन वस्तू जोडा", price: "किंमत", category: "कॅटेगरी",
      inventoryAlert: "स्टॉक अलर्ट!", lowStockDesc: "वस्तूंचा स्टॉक कमी होत आहे. कृपया नवीन साठा भरा.",
      recentSales: "अलीकडील विक्री माहिती", criticalStock: "कमी झालेला स्टॉक", unitsLeft: "शिल्लक नग",
      noSales: "अद्याप कोणतीही विक्री नाही.", healthyStock: "स्टॉकची स्थिती चांगली आहे! ✓",
      printBill: "बिल प्रिंट करा", pdfDownload: "PDF डाऊनलोड", saleComplete: "विक्री यशस्वी!", invoiceGenerated: "पावती तयार झाली आहे",
      continueSale: "पुढील बिल सुरू करा", thankYou: "धन्यवाद! पुन्हा भेट द्या.",
      success: "विक्री यशस्वी!", error: "माहिती तपासा!", shilak: "नग शिल्लक", gela: "नग विक्री"
    },
    hi: {
      dashboard: "डैशबोर्ड", billing: "नया बिल", inventory: "इन्वेंट्री",
      searchProducts: 'सामान खोजें...',
      addProduct: 'नया सामान जोड़ें',
      totalRevenue: "कुल कमाई", stockGela: "बिका हुआ स्टॉक (गया)", stockShilak: "बचा हुआ स्टॉक", varieties: "कुल प्रकार",
      collection: "कलेक्शन", search: "सामान खोजें...", customerName: "ग्राहक का नाम", mobile: "मोबाइल नंबर", completeSale: "बिक्री पूरी करें",
      remainingStock: "बचा हुआ", addProduct: "नया सामान जोड़ें", price: "कीमत", category: "श्रेणी",
      inventoryAlert: "स्टॉक चेतावनी!", lowStockDesc: "सामान का स्टॉक कम हो रहा है। कृपया नया स्टॉक जोड़ें।",
      recentSales: "हाल की बिक्री जानकारी", criticalStock: "कम हुआ स्टॉक", unitsLeft: "नग बचे हैं",
      noSales: "अभी तक कोई बिक्री नहीं हुई।", healthyStock: "स्टॉक की स्थिति अच्छी है! ✓",
      printBill: "बिल प्रिंट करें", pdfDownload: "PDF डाउनलोड", saleComplete: "बिक्री सफल!", invoiceGenerated: "बिल सफलतापूर्वक तैयार हुआ",
      continueSale: "अगला बिल शुरू करें", thankYou: "धन्यवाद! फिर आएं।",
      success: "बिक्री सफल!", error: "विवरण जांचें!", shilak: "नग शेष", gela: "नग बिका"
    }
  };

  const t = translations[lang];
  const activeTheme = themes[theme];

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
      products, orders, shopDetails,
      addProduct, removeProduct, updateProduct, completeBill,
      lang, setLang, t, 
      theme, setTheme, themes, activeTheme
    }}>
      {children}
    </ShopContext.Provider>
  );
};
