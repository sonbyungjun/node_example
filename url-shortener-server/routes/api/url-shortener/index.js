const router = require('express').Router();
const controller = require('./url-shoretener.controller');

router.post('/register', controller.register);
router.get('/:id/stats', controller.stats);
router.get('/:id', controller.redirecter);

module.exports =  router;