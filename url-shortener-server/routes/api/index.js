const router = require('express').Router();
const urlShortener = require('./url-shortener');

router.use('/', urlShortener);

module.exports = router;