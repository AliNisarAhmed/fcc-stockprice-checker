const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const connect = require('./connect');
const stockRoutes = require('./routes/stockRoutes');

const PORT = process.env.PORT || 3000;

const app = express();

if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log('morgan enabled');
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/stock-prices', stockRoutes);

app.use(express.static(process.cwd() + '/server/public'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/server/public/index.html');
})

module.exports = app;

connect('mongodb://localhost:27017/stockprice-checker')
  .then(() => {
    app.listen(3000, () => {
      console.log(`server started on port: ${PORT}`)
    });
  });
