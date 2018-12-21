const router = require('express').Router();
const Axios = require('axios');

const {
  createNewStock,
  createNewLike,
  findOrCreateNewStock,
  findLikeByIp,
  updateStockWithLike
} = require('../models/queryFunctions');

router.use(async function(req, res, next) {
  console.log(req.ip);
  if (!req.query.stock) {
    res.send('Must send Stock ticker as a query Params');
    next();
  } else if (typeof req.query.stock === 'string') {
    let stock = req.query.stock;
    let response = await Axios.get(`https://api.iextrading.com/1.0/stock/${stock}/price`);
    req.body.stockPrice1 = response.data;
    next();
  } else {
    let [ stock1, stock2 ] = req.query.stock;
    let res1 = await Axios.get(`https://api.iextrading.com/1.0/stock/${stock1}/price`);
    let res2 = await Axios.get(`https://api.iextrading.com/1.0/stock/${stock2}/price`);
    req.body.stockPrice1 = res1.data;
    req.body.stockPrice2 = res2.data;
    next();
  }
})

router.get('/', async (req, res) => {

  if (req.body.stockPrice2) {
    let [ ticker1, ticker2 ] = req.query.stock; 
    // means the user sent two stocks
    // we must check if either of these stocks already exist in DB,
    // if not we create them first,
    let stock1 = await findOrCreateNewStock(ticker1);
    let stock2 = await findOrCreateNewStock(ticker2);
    // then we check if the user has liked them both
    if (req.query.like === 'true') {
      
    }
      // if yes, we need to update both stocks.
  } else {
    try {
      let ticker = req.query.stock;
      let stock = await findOrCreateNewStock(ticker);
      console.log('stock', stock);
      
      if (req.query.like === 'true') {
        // find out if this IP has already liked this stock before
        let foundLike = await findLikeByIp(req.ip);
        if (!foundLike) {
          // if they have liked it, we ignore their request
          // else, we increment the likes for this particular stock
          let newLike = await createNewLike(req.ip);
          let updatedStock = await updateStockWithLike(stock._id, newLike._id); 
          console.log('updated Stock');            
          return res.json({
            stock: updatedStock.stock,
            price: req.body.stockPrice1.toFixed(2),
            likes: updatedStock.likes.length    
          });
        }
      }
      return res.json({
        stock: stock.stock,
        price: req.body.stockPrice1.toFixed(2),
        likes: stock.likes.length
      });

    } catch (error) {
      return res.json({error: error.message});
    }
  }
})

module.exports = router;