const router = require('express').Router();
const controller = require('./bookmark.controller');

router.get('/', controller.list);

module.exports = router;