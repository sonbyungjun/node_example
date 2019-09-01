const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const { isLoggedIn } = require('./middlewares');
const { User, Post, Hashtag } = require('../models');

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/')
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        }
    }),
    limit: { fileSize: 5 * 2014 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res, next) => {
    res.json({
        url : `/img/${req.file.filename}`
    });
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            img: req.body.url,
            userId: req.user.id,
        });
        const hashtags = req.body.content.match(/#[^\s]*/g);
        if (hashtags) {
            const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            })));
            await post.addHashtags(result.map(r => r[0]));
        }
        res.redirect('/');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/hashtag', async (req, res, next) => {
   const query = req.query.hashtag;
   if (!query) {
       return res.redirect('/');
   }
   try {
       const hashtag = await Hashtag.findOne({ where: { title: query }});
       let posts = [];
       if (hashtag) {
           posts = await hashtag.getPosts({
               include: [{
                   model: User
                   }, {
                       model: User,
                       attributes: ['id', 'nick'],
                       as: 'Liker'
                   }]});
       }
       return res.render('main', {
           title: `${query} || NodeBird`,
           user: req.user,
           twits: posts
       });
   } catch (e) {
       console.error(e);
       next(e);
   }
});

router.delete('/:id', async (req, res, next) => {
   try {
       await Post.destroy({ where: { id: req.params.id, userId: req.user.id }});
       res.send('OK');
   } catch (e) {
       console.error(e);
       next(e);
   }
});

router.post('/:id/like', async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id }});
        await post.addLiker(req.user.id);
        res.send('OK');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.delete('/:id/unlike', async (req, res, next) => {
    try {
        const post = await Post.findOne({ where: { id: req.params.id }});
        await post.removeLiker(req.user.id);
        res.send('OK');
    } catch (e) {
        console.error(e);
        next(e);
    }
});

module.exports = router;