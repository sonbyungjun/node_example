const express = require('express');
const app = express();

const mongoose = require('mongoose');

app.use('/', require('./routes/api'));

app.listen(3000, () => {
  console.log('server is open...');
})

mongoose.connect(
  'mongodb://root:1111@localhost:27017/admin',
  {
    dbName: 'study',
    useNewUrlParser: true,
  }
);
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', () => {
  console.log(`mongdb running...`);
});