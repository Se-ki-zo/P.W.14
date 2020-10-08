const express = require('express');
const mongoose = require('mongoose');

// npm install body-parser
// http://expressjs.com/en/resources/middleware/body-parser.html
const bodyParser = require('body-parser');

const {
  PORT = 3000,
} = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => { // ???
  req.user = {
    _id: '5f79a49cf4e7d0b68326ce91',
  };

  next();
});

const cards = require('./routes/cards.js');
const users = require('./routes/users.js');
const otherReq = require('./routes/other.js');

app.use('', express.static(`${__dirname}/public`));

app.use('/', cards);
app.use('/', users);
app.use('/', otherReq);

app.listen(PORT, () => {
  console.log(`
  ======================
  Server has been started.
  ======================
  Current port: [ ${PORT} ].
  ======================
  Current time [ ${new Date().getHours()}:${new Date().getMinutes()} ]
  ======================
  Enjoy this crap. :)
  ======================
  `);
});
