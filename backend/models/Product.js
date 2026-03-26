const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['Kurti', 'Saree', 'Dress', 'Accessories'], required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  sold: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
