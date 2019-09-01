const express = require('express');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const connect = require('./schemas');

const CustomError = require('./addons/customError');
const app = express();
connect();

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use('/goods', require('./routes/goods'));
app.use('/cart', require('./routes/cart'));

app.use((req, res, next) => {
  const err = new CustomError('페이지를 찾을 수 없습니다.', 404);
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    code: err.status,
    message: err.message
  });
});

app.listen(process.env.PORT || 8010, () => {
  console.log(`${process.env.PORT || 8010}번 포트에서 서버 실행중입니다.`);
});