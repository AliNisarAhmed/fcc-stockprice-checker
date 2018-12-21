const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  ip: {
    type: String,
    unique: true
  },
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stock'
  }
});

const Like = mongoose.model('like', likeSchema);

module.exports = Like;