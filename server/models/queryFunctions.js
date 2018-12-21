const Like = require('./like');
const Stock = require('./stock');

function createNewStock(stockValue) {
  return Stock.create({
    stock: stockValue
  });
}

function createNewLike(ipValue, stockId) {
  return Like.create({ip: ipValue, stock: stockId});
}

function findOrCreateNewStock(ticker) {
  return Stock.findOneAndUpdate({stock: ticker}, {}, {new: true, upsert: true}).exec();
}

function findLikeByIp(ip) {
  return Like.findOne({ip}).exec(); 
}

function updateStockWithLike(stockId, likeId) {
  return Stock.findByIdAndUpdate(stockId, {$push: {likes: likeId}}, {new: true});
}

module.exports = {
  createNewStock,
  createNewLike,
  findOrCreateNewStock,
  findLikeByIp,
  updateStockWithLike
}