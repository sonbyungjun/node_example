const express = require('express');
const app = express();
const { port, mongodbURL } = require('./config');
var connect = require('./schemas');

connect();

app.use((req, res, next) => {
  var allowedOrigins = ['']; // 허용 URL
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', require('./routes/api'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.status || 500);
  }
  res.json({
    success: false,
    message: err.message,
    error: err
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});