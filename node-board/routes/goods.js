const router = require('express').Router();
const CustomError = require('../addons/customError');
const multer = require('multer');
const path = require('path');

const Goods = require('../schemas/goods');

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
  limit: {fileSize: 5 * 2014 * 1024},
});

router.post('/img', upload.single('img'), (req, res, next) => {
  console.log(req.file.filename)
  res.json({
    code : 201,
    success : true,
    url: `/img/${req.file.filename}`,
  });
});

router.get('/', async (req, res, next) => {
  try {
    console.log(req.cookie)
    const goods = await Goods.find({}).sort('createdAt')
    res.json({
      code: 200,
      success: true,
      goods
    })
  } catch (error) {
    console.error(error);
    next(new CustomError('상품 조회 실패', 400));
  }
});

router.post('/', async (req, res, next) => {
  try {
    const goods = new Goods({
      title: req.body.title,
      content: req.body.content,
      price: parseInt(req.body.price),
      file: req.body.url,
      user: req.body.user,
    });
    const newBoard = await goods.save();
    console.log(newBoard);
    res.status(201).json({
      code: 201,
      success: true,
    });
  } catch (error) {
    console.error(error);
    next(new CustomError('상품 저장 실패', 401));
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const goods = await Goods.find({_id: req.params.id});
    if (!goods) {
      throw new CustomError('상품이 없습니다.', 400);
    }
    res.json({
      code: 200,
      success: true,
      goods
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const goods = await Goods.updateOne({_id: req.params.id}, req.body);
    if (goods.n === 0) {
      throw new CustomError('상품이 없거나 수정에 실패 했습니다.', 400);
    }
    res.json({
      code: 200,
      success: true,
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const goods = await Goods.deleteOne({_id: req.params.id});
    if (goods.n === 0) {
      throw new CustomError('상품이 없거나 삭제에 실패 했습니다.', 400);
    }
    res.json({
      code: 200,
      success: true,
    })
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
