const router = require('express').Router();
const bookmark = require('./bookmark');

router.use('/bookmark', bookmark);

module.exports = router;