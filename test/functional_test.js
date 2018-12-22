
var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server/server');

chai.use(chaiHttp);

describe('Functional Tests', function() {
    
    describe('GET /api/stock-prices => stockData object', function() {
      
      it('1 stock without like', function(done) {
        this.timeout(5000);
        let stock = 'goog';
        chai.request(server)
         .get('/api/stock-prices')
          .query({stock})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body.stockData);
            let stockData = res.body.stockData;
            assert.property(stockData, "stock", 'property:stock exists on the stockData');
            assert.equal(stockData.stock, stock);
            assert.property(stockData, "likes", 'property:likes exists on the stockData');
            assert.isNumber(stockData.likes);
            assert.property(stockData, "price", 'property:price exists on the stockData');
            assert.isString(stockData.price);
            done();
        });
      });
      
      it('1 stock with like', function(done) {
        this.timeout(5000);
        let stock = 'goog'
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock, like: true})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body.stockData);
            let stockData = res.body.stockData;
            assert.property(stockData, "stock", 'property:stock exists on the stockData');
            assert.equal(stockData.stock, stock);
            assert.property(stockData, "likes", 'property:likes exists on the stockData');
            assert.isNumber(stockData.likes);
            assert.isAtLeast(stockData.likes, 1);
            assert.property(stockData, "price", 'property:price exists on the stockData');
            assert.isString(stockData.price);
            done();
          })
      });
      
      it('1 stock with like again (ensure likes arent double counted)', function(done) {
        this.timeout(5000);        
        let stock = 'goog';
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock, like: true})
          .end(function (err, res1) {
            assert.equal(res1.status, 200);
            assert.isAtLeast(res1.body.stockData.likes, 1, 'likes are at least 1 after the first request');
            chai.request(server)
              .get('/api/stock-prices')
              .query({stock, like: true})
              .end(function(error, res2) {
                assert.equal(res2.status, 200);
                assert.equal(res2.body.stockData.likes, res1.body.stockData.likes);
                done();
              });
          });
      });
      
      it('2 stocks', function(done) {
        this.timeout(5000);
        let stock1 = 'aapl';
        let stock2 = 'amzn'
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: [stock1, stock2]})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.stockData);
            let stockData = res.body.stockData;
            assert.isArray(stockData);
            assert.property(stockData[0], "stock", 'property:stock exists on the stockData');
            assert.property(stockData[1], "stock", 'property:stock exists on the stockData');
            assert.equal(stockData[0].stock, stock1);
            assert.equal(stockData[1].stock, stock2);
            assert.property(stockData[0], "rel_likes", 'property:rel_likes exists on the stockData');
            assert.property(stockData[1], "rel_likes", 'property:rel_likes exists on the stockData');
            assert.isNumber(stockData[0].rel_likes);
            assert.isNumber(stockData[1].rel_likes);
            assert.property(stockData[0], "price", 'property:price exists on the stockData');
            assert.property(stockData[1], "price", 'property:price exists on the stockData');
            assert.isString(stockData[0].price);
            assert.isString(stockData[1].price);
            done();
          })
      });
      
      it('2 stocks with like', function(done) {
        this.timeout(5000);
        let stock1 = 'amzn';
        let stock2 = 'aapl'
        chai.request(server)
          .get('/api/stock-prices')
          .query({stock: [stock1, stock2], like: true})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.stockData);
            let stockData = res.body.stockData;
            assert.isArray(stockData);
            assert.property(stockData[0], "stock", 'property:stock exists on the stockData');
            assert.property(stockData[1], "stock", 'property:stock exists on the stockData');
            assert.equal(stockData[0].stock, stock1);
            assert.equal(stockData[1].stock, stock2);
            assert.property(stockData[0], "rel_likes", 'property:rel_likes exists on the stockData');
            assert.property(stockData[1], "rel_likes", 'property:rel_likes exists on the stockData');
            assert.isNumber(stockData[0].rel_likes);
            assert.isNumber(stockData[1].rel_likes);
            assert.property(stockData[0], "price", 'property:price exists on the stockData');
            assert.property(stockData[1], "price", 'property:price exists on the stockData');
            assert.isString(stockData[0].price);
            assert.isString(stockData[1].price);
            done();
          })
      });
      
    });

});
