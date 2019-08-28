const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/test', async (req, res, next) => {
   try {
       if (!req.session.jwt) {
           const tokenResult = await axios.post('http://localhost:8002/v2/token', {
               clientSecret: process.env.CLIENT_SECRET
           });
           if (tokenResult.data && tokenResult.data.code === 200) {
               req.session.jwt = tokenResult.data.token;
           } else {
               return res.json(tokenResult.data);
           }
       }
       const result = await axios.get('http://localhost:8002/v2/test', {
           headers: { authorization: req.session.jwt },
       });
       return res.json(result.data);
   } catch (e) {
       console.error(e);
       if (e.response.status === 419) {
           return res.json(e.response.data);
       }
       return next(e);
   }
});

const request = async (req, api) => {
    try {
        if (!req.session.jwt) {
            const tokenResult = await axios.post('http://localhost:8002/v2/token', {
                clientSecret: process.env.CLIENT_SECRET,
            });
            req.session.jwt = tokenResult.data.token;
        }
        return await axios.get(`http://localhost:8002/v2${api}`, {
            headers: { authorization: req.session.jwt },
        });
    } catch (e) {
        console.error(e);
        if (e.response.status < 500) {
            delete req.session.jwt;
            await request(req, api);
            return e.response;
        }
        throw e;
    }
}

router.get('/mypost', async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my');
        res.json(result.data);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/search/:hashtag', async (req, res, next) => {
    try {
        const result = await request(
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`
        );
        res.json(result.data);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/follow', async (req, res, next) => {
    try {
        const result = await request(
            req, `/follow`
        );
        res.json(result.data);
    } catch (e) {
        console.error(e);
        next(e);
    }
});

router.get('/', (req, res) => {
   res.render('main', { key: process.env.FRONT_SECRET });
});

module.exports = router;