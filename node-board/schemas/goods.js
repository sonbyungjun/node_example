const mongoose = require('mongoose');

const {Schema} = mongoose;

const goodsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  file: String,
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, {
  versionKey: false,
});

module.exports = mongoose.model('Goods', goodsSchema);