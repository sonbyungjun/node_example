const Bookmark = require('../../../models/bookmark');

const list = (req, res, next) => {
  const name = req.query.name;
  Bookmark
    .find({
      name
    })
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch(err => {
      console.error(err);
      // next(err);
    })
};

module.exports = {
  list
}