const Url = require('../../../schemas/url');
const url = require('url');
const config = require('../../../config');
const CustomError = require('../../../addons/customError');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const register = (req, res, next) => {
  const reqUrl = req.query.url;
  Url
    .findOne({
      url: reqUrl
    })
    .then(result => {
      if (!result) {
        Url
          .create(reqUrl)
          .then(result => {
            return res.status(201).json({
              id: result._id,
              url: url.resolve(config.host, result._id.toString()),
            })
          })
          .catch(error => {
            console.error(error);
            next(error);
          })
      } else {
        return res.json({
          id: result._id,
          url: url.resolve(config.host, result._id.toString()),
        })
      }
    })
    .catch(error => {
      console.error(error);
      next(error);
    })
};

const redirecter = (req, res, next) => {
  const id = req.params.id;
  Url
    .findById(id)
    .then(result => {
      Url.pushVisit(id);
      return res.status(301).redirect(result.url);
    })
    .catch((error) => {
      console.error(error);
      return next(new CustomError('the URL not registered', 401));
    })
};

const stats = (req, res, next) => {
  Url.aggregate([
    {
      $match : { _id : ObjectId(req.params.id) },
    },
    {
      $unwind : "$visits",
    },
    {
      $project : {
        visit_date : "$visits",
      }
    },
    {
      $group : {
        _id : {
          visit_date : { $dateToString : { format : "%Y-%m-%d %H:00:00", date : "$visit_date" } }
        },
        visits : { "$sum" : 1 },
      }
    },
    {
      $project : {
        _id : 0,
        at : "$_id.visit_date",
        visits : "$visits",
      }
    },
  ]).exec((err, result) => {
    if (err) {
      console.error(err);
      next(err);
    }
    res.json({ stats: result });
  })
};

module.exports = {
  register,
  redirecter,
  stats
}
