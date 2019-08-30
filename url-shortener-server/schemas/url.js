const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Url = new Schema({
  url: String,
  visits: [Date],
});

Url.statics.create = function (url) {
  const newUrlDocument = new this({
    url
  });
  return newUrlDocument.save();
};

Url.statics.pushVisit = function (_id) {
  this.update(
    { _id },
    { $push : { visits: Date.now() } },
  ).exec();
};

module.exports = mongoose.model('Url', Url);