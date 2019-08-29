const mongoose = require('mongoose');

const Schema = mongoose.Schema

const Bookmark = new Schema({
  name: String,
  url: String,
  visits: [Date]
});

Bookmark.static

module.exports = mongoose.model('Bookmark', Bookmark);