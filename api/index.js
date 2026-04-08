const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with better handling for Vercel
const MONGO_URI = (process.env.MONGO_URI || '').trim();

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  if (!MONGO_URI) {
    console.error('MONGO_URI is missing!');
    return null;
  }
  
  try {
    const db = await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');
    cachedDb = db;
    return db;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    return null;
  }
}

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

// Models (Imported from backend/models or redefined)
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  stock: Number,
  sold: { type: Number, default: 0 },
  image: String
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const billSchema = new mongoose.Schema({
  billNumber: String,
  customerName: String,
  customerMobile: String,
  items: Array,
  totalAmount: Number,
  date: { type: Date, default: Date.now }
}, { timestamps: true });

const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);

// --- API ROUTES ---

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

app.get('/api/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/billing', async (req, res) => {
  const { customerName, customerMobile, items, totalAmount } = req.body;
  try {
    const billNumber = `BIL-${Date.now()}`;
    const newBill = new Bill({ billNumber, customerName, customerMobile, items, totalAmount });
    await newBill.save();

    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty, sold: item.qty }
      });
    }

    res.json({ success: true, bill: newBill });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/stats', async (req, res) => {
  try {
    const products = await Product.find();
    const bills = await Bill.find();
    
    res.json({
      totalProducts: products.length,
      totalSold: products.reduce((sum, p) => sum + (p.sold || 0), 0),
      remainingStock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
      lowStock: products.filter(p => p.stock < 5).length,
      totalRevenue: bills.reduce((sum, b) => sum + b.totalAmount, 0)
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = app;
