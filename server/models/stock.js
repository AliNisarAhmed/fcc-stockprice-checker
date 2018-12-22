const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  stock: {
    type: String,
    required: true,
    unique: true,
  },
  likes: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'like'}],
  }
});

const Stock = mongoose.model('stock', stockSchema);

module.exports = Stock;