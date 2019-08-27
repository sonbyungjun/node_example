const express = require('express');

const router = express.Router();
const { User } = require('../models');
const { isLoggedIn } = require('./middlewares');

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        await user.addFollowing(parseInt(req.params.id, 10));
        res.send('success');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/:id/unfollow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        await user.removeFollowing(parseInt(req.params.id, 10));
        res.send('success');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.post('/profile', async (req, res, next) => {
    try {
        await User.update({nick: req.body.nick}, {
            where: {id: req.user.id},
        });
        res.redirect('/profile');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;