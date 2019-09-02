const router = require('express').Router();

const Cart = require('../schemas/cart');
const Goods = require('../schemas/goods');
const CustomError = require('../addons/customError');

router.get('/:id', async (req, res, next) => {
  try {
    if (!req.session.name) {
      req.session.name = new Date().valueOf();
    }
    const goods = await Goods.findOne({_id: req.params.id});
    const amount = req.query.amount && (parseInt(req.query.amount) > 0) ? parseInt(req.query.amount) : 1;
    const sum = goods.price * amount;
    const oldCart = await Cart.findOne({ goods : req.params.id, user: req.session.name});
    if (oldCart) {
      await oldCart.remove();
    }
    const cart = new Cart({
      goods: req.params.id,
      user: req.session.name,
      amount: amount,
      link: `/goods/${req.params.id}`,
      sum: sum,
    });
    await cart.save();
    res.json({
      code : 200,
      success : true,
    });
  } catch (error) {
    console.error(error);
    next(new CustomError('없는 상품입니다.', 400));
  }
});

router.get('/', async (req, res, next) => {
  if (!req.session.name) {
    return res.json({
      code : 304,
      success : false,
      message: '장바구니가 비어있습니다.'
    });
  }
  const cart = await Cart.find({ user : req.session.name });
  let resultSum = 0;
  cart.filter(o => resultSum += o.sum);
  res.json({
    code: 200,
    success: true,
    result : resultSum,
    cart
  });
});

module.exports = router;
