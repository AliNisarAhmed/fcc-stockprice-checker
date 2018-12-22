const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
  ip: {
    type: String,
  },
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'stock'
  }
});

const Like = mongoose.model('like', likeSchema);

module.exports = Like;