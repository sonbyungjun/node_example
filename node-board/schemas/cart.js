const mongoose = require('mongoose');

const {Schema} = mongoose;
const {Types: {ObjectId}} = Schema;

const cartSchema = new Schema({
  goods: {
    type: ObjectId,
    required: true,
    ref: 'Goods'
  },
  user: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  sum: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cart', cartSchema);