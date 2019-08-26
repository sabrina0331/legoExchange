const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');

const app = express();

mongoose.connect('mongodb+srv://xinya:bkrxgeMysMtshXRG@xinya-0gwbz.mongodb.net/legoExchange?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() =>{
    console.log('Connected to DB')
  })
  .catch(() => {
    console.log('Connect failed')
  })

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')))

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS, PUT'
  );
  next();
});

app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);

module.exports = app;
