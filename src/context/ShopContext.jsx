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
      name: 'Apsara Ladies Shop',
      tagline: 'Premium Boutique & Designer Wear',
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
      completeBill
    }}>
      {children}
    </ShopContext.Provider>
  );
};
