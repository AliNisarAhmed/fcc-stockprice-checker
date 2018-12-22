const Like = require('./like');
const Stock = require('./stock');

function createNewLike(ipValue, stockId) {
  return Like.create({ip: ipValue, stock: stockId});
}

function findStock(ticker) {
  return Stock.findOne({stock: ticker}).exec();
}

function createStock(ticker) {
  return Stock.create({stock: ticker, likes: []});
}

function findLike(ip, stockId) {
  return Like.findOne({ip, stock: stockId}).exec();
}

function createLike(ip, stockId) {
  return Like.create({ip, stock: stockId}); 
}

async function updateStockWithLike(stockId, likeId) {
  return Stock.findByIdAndUpdate(stockId, {$push: {likes: likeId}}, {new: true}).exec();
}

module.exports = {
  createNewLike,
  findStock,
  createStock,
  findLike,
  updateStockWithLike,
  createLike,
}