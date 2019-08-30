const express = require('express');
const app = express();
const { port } = require('./config');
const connect = require('./schemas');
const cors = require('cors');

connect();

app.use((req, res, next) => {
  cors({ origin: 'http://localhost:8080' })(req, res, next);
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