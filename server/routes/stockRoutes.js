const router = require('express').Router();
const Axios = require('axios');

const {
  findStock,
  createStock,
  createLike,
  updateStockWithLike,
  findLike
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
    let price1 = req.body.stockPrice1.toFixed(2);
    let price2 = req.body.stockPrice2.toFixed(2);
    // means the user sent two stocks
    // we must check if either of these stocks already exist in DB,
    // if not we create them first,
    let stock1 = await findStock(ticker1);
    let stock2 = await findStock(ticker2);
    if (!stock1) {
      stock1 = createStock(ticker1);
    }
    if (!stock2) {
      stock2 = createStock(ticker2);
    }
    // then we check if the user has liked them both
    if (req.query.like === 'true') {
      let like1 = await findLike(req.ip, stock1._id);
      let like2 = await findLike(req.ip, stock2._id);
      if (!like1) {
        like1 = await createLike(req.ip, stock1._id);
        await updateStockWithLike(stock1._id, like1._id)
      }
      if (!like2) {
        like2 = await createLike(req.ip, stock2._id);
        await updateStockWithLike(stock2._id, like2._id);
      }
    }

    res.status(200).json({
      stockData: [
        {
          stock: stock1.stock,
          price: price1,
          rel_likes: stock1.likes.length - stock2.likes.length
        },
        {
          stock: stock2.stock,
          price: price2,
          rel_likes: stock2.likes.length - stock1.likes.length
        }
      ]
    })

      // if yes, we need to update both stocks.
  } else {
    try { 
      let ticker = req.query.stock;
      let stock; 
      stock = await findStock(ticker);
      if (!stock) {
        stock = await createStock(ticker);
      }
      
      if (req.query.like === 'true') {
        // find out if this IP has already liked this stock before
        let foundLike = await findLike(req.ip, stock._id);
        if (!foundLike) {
          let newLike = await createLike(req.ip, stock._id);
          let updatedStock = await updateStockWithLike(stock._id, newLike._id, req.ip); 
          return res.json({
            stock: updatedStock.stock,
            price: req.body.stockPrice1.toFixed(2),
            likes: updatedStock.likes.length    
          });
        }
      }
      return res.status(200).json({
        stockData: {
          stock: stock.stock,
          price: req.body.stockPrice1.toFixed(2),
          likes: stock.likes.length
        }
      });

    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  }
})

module.exports = router;