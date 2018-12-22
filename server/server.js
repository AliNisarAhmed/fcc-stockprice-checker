const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const connect = require('./connect');
const stockRoutes = require('./routes/stockRoutes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use(helmet());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'"]
  }
}))

app.use('/api/stock-prices', stockRoutes);

app.use(express.static(process.cwd() + '/server/public'));

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/server/public/index.html');
})

module.exports = app;

connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server started on port: ${PORT}`)
    });
  });
