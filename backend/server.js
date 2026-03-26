const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/apsara_ladies_shop';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB: Apsara Ladies Shop'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Models
const Product = require('./models/Product');
const Bill = require('./models/Bill');

// --- API ROUTES ---

// 1. PRODUCTS
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const saved = await newProduct.save();
    res.json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// 2. BILLING & INVENTORY REDUCTION
app.get('/api/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/billing', async (req, res) => {
  const { customerName, customerMobile, items, totalAmount } = req.body;
  try {
    // Generate Bill Number: BIL-timestamp
    const billNumber = `BIL-${Date.now()}`;
    
    // Create & Save Bill
    const newBill = new Bill({ billNumber, customerName, customerMobile, items, totalAmount });
    await newBill.save();

    // Reduce Stock for each item
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty, sold: item.qty }
      });
    }

    res.json({ success: true, bill: newBill });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// 3. DASHBOARD STATS
app.get('/api/stats', async (req, res) => {
  try {
    const products = await Product.find();
    const totalProducts = products.length;
    const totalSold = products.reduce((sum, p) => sum + p.sold, 0);
    const remainingStock = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter(p => p.stock < 5).length;
    
    const bills = await Bill.find();
    const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({ totalProducts, totalSold, remainingStock, lowStock, totalRevenue });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`🚀 Apsara Server running on port ${PORT}`));
