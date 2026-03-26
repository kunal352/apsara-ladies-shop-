const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerMobile: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      qty: Number
    }
  ],
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);
